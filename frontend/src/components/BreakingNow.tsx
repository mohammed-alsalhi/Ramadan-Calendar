import { useEffect, useState } from "react";

const CITIES = [
  { name: "Auckland", lon: 174.76, lat: -36.85 },
  { name: "Sydney", lon: 151.21, lat: -33.87 },
  { name: "Jakarta", lon: 106.85, lat: -6.21 },
  { name: "Kuala Lumpur", lon: 101.69, lat: 3.14 },
  { name: "Dhaka", lon: 90.41, lat: 23.81 },
  { name: "Delhi", lon: 77.21, lat: 28.61 },
  { name: "Karachi", lon: 67.01, lat: 24.86 },
  { name: "Dubai", lon: 55.27, lat: 25.2 },
  { name: "Mecca", lon: 39.83, lat: 21.39 },
  { name: "Riyadh", lon: 46.72, lat: 24.63 },
  { name: "Istanbul", lon: 28.98, lat: 41.01 },
  { name: "Cairo", lon: 31.24, lat: 30.04 },
  { name: "Lagos", lon: 3.39, lat: 6.52 },
  { name: "Paris", lon: 2.35, lat: 48.86 },
  { name: "London", lon: -0.12, lat: 51.51 },
  { name: "Casablanca", lon: -7.59, lat: 33.57 },
  { name: "New York", lon: -74.01, lat: 40.71 },
  { name: "Toronto", lon: -79.38, lat: 43.65 },
  { name: "Chicago", lon: -87.63, lat: 41.88 },
  { name: "Houston", lon: -95.37, lat: 29.76 },
  { name: "Los Angeles", lon: -118.24, lat: 34.05 },
  { name: "Honolulu", lon: -157.86, lat: 21.31 },
];

function getSunDeclination(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (now.getTime() - start.getTime()) / 86400000
  );
  return -23.45 * Math.cos((2 * Math.PI / 365) * (dayOfYear + 10));
}

function getIftarMinutesUTC(lat: number, lon: number): number {
  const decRad = (getSunDeclination() * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;
  const cosH =
    (Math.sin((-0.833 * Math.PI) / 180) -
      Math.sin(latRad) * Math.sin(decRad)) /
    (Math.cos(latRad) * Math.cos(decRad));
  if (cosH > 1 || cosH < -1) return -1;
  const H = (Math.acos(cosH) * 180) / Math.PI;
  const sunsetMinUTC = (12 + H / 15 - lon / 15) * 60;
  return ((sunsetMinUTC % 1440) + 1440) % 1440;
}

function getNowMinUTC(): number {
  const n = new Date();
  return n.getUTCHours() * 60 + n.getUTCMinutes();
}

function minutesDiff(iftar: number, now: number): number {
  let d = iftar - now;
  if (d < -720) d += 1440;
  if (d > 720) d -= 1440;
  return d;
}

export default function BreakingNow() {
  const [now, setNow] = useState(getNowMinUTC());

  useEffect(() => {
    const id = setInterval(() => setNow(getNowMinUTC()), 30_000);
    return () => clearInterval(id);
  }, []);

  const data = CITIES.map((c) => {
    const iftar = getIftarMinutesUTC(c.lat, c.lon);
    return { ...c, diff: iftar >= 0 ? minutesDiff(iftar, now) : Infinity };
  }).filter((c) => c.diff !== Infinity);

  const breakingNow = data
    .filter((c) => c.diff >= -30 && c.diff <= 0)
    .sort((a, b) => b.diff - a.diff);

  const upcoming = data
    .filter((c) => c.diff > 0 && c.diff <= 120)
    .sort((a, b) => a.diff - b.diff)
    .slice(0, 3);

  const recent = data
    .filter((c) => c.diff < -30 && c.diff >= -90)
    .sort((a, b) => b.diff - a.diff)
    .slice(0, 3);

  if (!breakingNow.length && !upcoming.length && !recent.length) return null;

  return (
    <div className="breaking-now" role="region" aria-label="Who is breaking their fast">
      <div className="breaking-header">Who's Breaking Their Fast?</div>

      {breakingNow.length > 0 && (
        <div className="breaking-section">
          <div className="breaking-label">Right now</div>
          <div className="breaking-cities">
            {breakingNow.map((c) => (
              <span key={c.name} className="breaking-chip active">
                {c.name}
                <span className="breaking-eta">{Math.abs(Math.round(c.diff))}m ago</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="breaking-section">
          <div className="breaking-label">Up next</div>
          <div className="breaking-cities">
            {upcoming.map((c) => (
              <span key={c.name} className="breaking-chip">
                {c.name}
                <span className="breaking-eta">{Math.ceil(c.diff)}m</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {!breakingNow.length && !upcoming.length && recent.length > 0 && (
        <div className="breaking-section">
          <div className="breaking-label">Just broke their fast</div>
          <div className="breaking-cities">
            {recent.map((c) => (
              <span key={c.name} className="breaking-chip faded">
                {c.name}
                <span className="breaking-eta">
                  {Math.abs(Math.round(c.diff))}m ago
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
