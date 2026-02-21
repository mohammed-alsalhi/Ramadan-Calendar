import { useEffect, useState } from "react";
import "./App.css";
import { fetchRamadanCalendar } from "./api";
import type { RamadanDay, Dua, Hadith } from "./types";
import Calendar from "./components/Calendar";
import Countdown from "./components/Countdown";
import Stars from "./components/Stars";
import HelpModal from "./components/HelpModal";
import DuaHadith from "./components/DuaHadith";
import BreakingNow from "./components/BreakingNow";

const DEFAULT_LAT = "40.1106";
const DEFAULT_LON = "-88.2073";
const DEFAULT_CITY = "Urbana";

function getProgress(days: RamadanDay[]): { current: number; total: number } {
  const today = new Date().toISOString().split("T")[0];
  const idx = days.findIndex((d) => d.date === today);
  return { current: idx === -1 ? 0 : idx + 1, total: days.length };
}

async function ipGeolocate(): Promise<{ lat: string; lon: string }> {
  try {
    const res = await fetch("http://ip-api.com/json/?fields=lat,lon");
    const data = await res.json();
    if (data.lat && data.lon) {
      return { lat: String(data.lat), lon: String(data.lon) };
    }
  } catch {}
  return { lat: DEFAULT_LAT, lon: DEFAULT_LON };
}

function getLocation(): Promise<{ lat: string; lon: string }> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      ipGeolocate().then(resolve);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude.toFixed(4),
          lon: pos.coords.longitude.toFixed(4),
        }),
      () => ipGeolocate().then(resolve),
      { timeout: 5000 }
    );
  });
}

async function reverseGeocode(lat: string, lon: string): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    const data = await res.json();
    return (
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      DEFAULT_CITY
    );
  } catch {
    return DEFAULT_CITY;
  }
}

function App() {
  const [days, setDays] = useState<RamadanDay[]>([]);
  const [dua, setDua] = useState<Dua | null>(null);
  const [hadith, setHadith] = useState<Hadith | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [city, setCity] = useState(DEFAULT_CITY);
  const [coords, setCoords] = useState({ lat: DEFAULT_LAT, lon: DEFAULT_LON });
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    getLocation().then(({ lat, lon }) => {
      setCoords({ lat, lon });
      reverseGeocode(lat, lon).then(setCity);
      fetchRamadanCalendar(lat, lon)
        .then((res) => {
          setDays(res.days);
          setDua(res.dua);
          setHadith(res.hadith);
        })
        .catch(() => setError("Failed to load Ramadan calendar"))
        .finally(() => setLoading(false));
    });
  }, []);

  if (loading) {
    return (
      <>
        <Stars />
        <div className="status" role="status" aria-label="Loading Ramadan calendar">
          <div className="loading-moon" aria-hidden="true">&#9790;</div>
          <div className="loading-text">Loading</div>
          <div className="loading-dots" aria-hidden="true"><span /><span /><span /></div>
        </div>
      </>
    );
  }
  if (error)
    return (
      <>
        <Stars />
        <div className="error-screen" role="alert">
          <div className="error-icon">&#9888;</div>
          <div className="error-title">Something went wrong</div>
          <div className="error-message">{error}</div>
          <button className="error-retry" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </>
    );

  const { current, total } = getProgress(days);
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <>
      <a className="skip-link" href="#calendar">Skip to calendar</a>
      <Stars />
      <header className="app-header">
        <div className="header-icon">&#9790;</div>
        <h1>Ramadan Mubarak</h1>
        <p className="header-subtitle">1447 AH &middot; {city}</p>
      </header>

      {current > 0 && (
        <div className="progress-section">
          <div className="progress-text">
            Day <strong>{current}</strong> of {total}
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      <Calendar days={days} coords={coords} city={city} />

      <Countdown days={days} />

      <BreakingNow />

      <DuaHadith dua={dua} hadith={hadith} />

      <button className="help-btn" onClick={() => setShowHelp(true)} aria-label="Help">?</button>
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </>
  );
}

export default App;
