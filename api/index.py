import os

import httpx
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

ISLAMIC_API_KEY = os.environ.get("ISLAMIC_API_KEY", "")
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Accept": "application/json",
}


@app.get("/api")
async def root():
    return {"message": "Salaam World"}


@app.get("/api/ramadan")
async def get_ramadan(lat: str = Query(...), lon: str = Query(...)):
    if not ISLAMIC_API_KEY:
        raise HTTPException(status_code=500, detail="API key not configured")

    async with httpx.AsyncClient(timeout=15, headers=HEADERS) as client:
        response = await client.get(
            "https://islamicapi.com/api/v1/ramadan/",
            params={"lat": lat, "lon": lon, "api_key": ISLAMIC_API_KEY},
        )

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Islamic API error")

    data = response.json()
    fasting_days = data.get("data", {}).get("fasting", [])
    resource = data.get("resource", {})

    return {
        "days": [
            {
                "date": day["date"],
                "day": day["day"],
                "hijri": day.get("hijri_readable", ""),
                "sahur": day["time"]["sahur"],
                "iftar": day["time"]["iftar"],
                "duration": day["time"]["duration"],
            }
            for day in fasting_days
        ],
        "dua": resource.get("dua"),
        "hadith": resource.get("hadith"),
    }


@app.get("/api/prayer-times")
async def get_prayer_times(
    lat: str = Query(...),
    lon: str = Query(...),
    date: str = Query(...),
):
    if not ISLAMIC_API_KEY:
        raise HTTPException(status_code=500, detail="API key not configured")

    async with httpx.AsyncClient(timeout=15, headers=HEADERS) as client:
        response = await client.get(
            "https://islamicapi.com/api/v1/prayer-time/",
            params={
                "lat": lat,
                "lon": lon,
                "date": date,
                "method": "3",
                "school": "1",
                "api_key": ISLAMIC_API_KEY,
            },
        )

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Islamic API error")

    return response.json()
