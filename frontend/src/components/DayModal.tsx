import { useEffect, useState } from "react";
import type { RamadanDay } from "../types";
import { fetchPrayerTimes } from "../api";
import { shareOrDownload } from "../shareCard";

interface DayModalProps {
  day: RamadanDay;
  dayNumber: number;
  coords: { lat: string; lon: string };
  city: string;
  onClose: () => void;
}

type PrayerTimes = {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
} | null;

const PRAYER_INFO = [
  { key: "Fajr", label: "Fajr", icon: "\u{1F319}" },
  { key: "Sunrise", label: "Sunrise", icon: "\u{1F305}" },
  { key: "Dhuhr", label: "Dhuhr", icon: "\u2600" },
  { key: "Asr", label: "Asr", icon: "\u{1F324}" },
  { key: "Maghrib", label: "Maghrib", icon: "\u{1F307}" },
  { key: "Isha", label: "Isha", icon: "\u{1F303}" },
];

export default function DayModal({ day, dayNumber, coords, city, onClose }: DayModalProps) {
  const [prayers, setPrayers] = useState<PrayerTimes>(null);
  const [loading, setLoading] = useState(true);
  const isToday = day.date === new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!isToday) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchPrayerTimes(coords.lat, coords.lon, day.date)
      .then((res) => setPrayers(res.data.times))
      .catch(() => setPrayers(null))
      .finally(() => setLoading(false));
  }, [day.date, isToday, coords.lat, coords.lon]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={`Day ${dayNumber} details`}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close dialog">
          &times;
        </button>

        <div className="modal-header">
          <div className="modal-day-num">Day {dayNumber}</div>
          <div className="modal-date">{day.day}, {day.date}</div>
          <div className="modal-hijri">{day.hijri}</div>
        </div>

        <div className="modal-fasting">
          <div className="modal-fasting-row">
            <span className="modal-fasting-icon">&#9790;</span>
            <span className="modal-fasting-label">Sahur</span>
            <span className="modal-fasting-time">{day.sahur}</span>
          </div>
          <div className="modal-fasting-row">
            <span className="modal-fasting-icon">&#9788;</span>
            <span className="modal-fasting-label">Iftar</span>
            <span className="modal-fasting-time">{day.iftar}</span>
          </div>
          <div className="modal-duration">Fasting: {day.duration}</div>
        </div>

        {isToday && (
          <div className="modal-prayers">
            <h3 className="modal-section-title">Athan Times</h3>
            {loading ? (
              <div className="modal-loading">Loading...</div>
            ) : prayers ? (
              <div className="modal-prayer-grid">
                {PRAYER_INFO.map(({ key, label, icon }) => (
                  <div key={key} className="modal-prayer-row">
                    <span className="modal-prayer-icon">{icon}</span>
                    <span className="modal-prayer-name">{label}</span>
                    <span className="modal-prayer-time">
                      {prayers[key as keyof typeof prayers]}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="modal-loading">Could not load athan times</div>
            )}
          </div>
        )}

        <button
          className="share-btn"
          onClick={() => shareOrDownload(day, dayNumber, city)}
        >
          Share This Day
        </button>
      </div>
    </div>
  );
}
