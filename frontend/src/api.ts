import type { RamadanResponse, PrayerTimesResponse } from "./types";

const API_BASE = import.meta.env.DEV ? "http://localhost:8000" : "/api";

export async function fetchRamadanCalendar(
  lat: string,
  lon: string
): Promise<RamadanResponse> {
  const response = await fetch(
    `${API_BASE}/ramadan?lat=${lat}&lon=${lon}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Ramadan calendar");
  }

  return response.json();
}

export async function fetchPrayerTimes(
  lat: string,
  lon: string,
  date: string
): Promise<PrayerTimesResponse> {
  const response = await fetch(
    `${API_BASE}/prayer-times?lat=${lat}&lon=${lon}&date=${date}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch prayer times");
  }

  return response.json();
}
