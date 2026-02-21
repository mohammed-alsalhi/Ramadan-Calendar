import { useEffect, useState } from "react";
import type { RamadanDay } from "../types";

interface CountdownProps {
  days: RamadanDay[];
}

function parseTime(dateStr: string, timeStr: string): Date {
  const [time, period] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  const date = new Date(dateStr + "T00:00:00");
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function findNextEvent(days: RamadanDay[]): { label: string; time: Date } | null {
  const now = new Date();

  for (const day of days) {
    const sahurTime = parseTime(day.date, day.sahur);
    const iftarTime = parseTime(day.date, day.iftar);

    if (sahurTime > now) return { label: "Suhoor", time: sahurTime };
    if (iftarTime > now) return { label: "Iftaar", time: iftarTime };
  }

  return null;
}

export default function Countdown({ days }: CountdownProps) {
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const [eventLabel, setEventLabel] = useState("");

  useEffect(() => {
    const tick = () => {
      const next = findNextEvent(days);
      if (!next) {
        setEventLabel("Ramadan has ended");
        return;
      }

      setEventLabel(next.label);
      const ms = next.time.getTime() - Date.now();
      const total = Math.floor(ms / 1000);
      setHours(String(Math.floor(total / 3600)).padStart(2, "0"));
      setMinutes(String(Math.floor((total % 3600) / 60)).padStart(2, "0"));
      setSeconds(String(total % 60).padStart(2, "0"));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [days]);

  if (!eventLabel) return null;

  return (
    <div className="countdown" role="timer" aria-label={eventLabel === "Ramadan has ended" ? eventLabel : `Time until ${eventLabel}: ${hours} hours ${minutes} minutes ${seconds} seconds`} aria-live="off">
      <div className="countdown-label">
        {eventLabel === "Ramadan has ended"
          ? eventLabel
          : `Time until ${eventLabel}`}
      </div>
      {eventLabel !== "Ramadan has ended" && (
        <div className="countdown-digits">
          <div className="digit-group">
            <span className="digit">{hours}</span>
            <span className="digit-label">Hours</span>
          </div>
          <span className="digit-sep">:</span>
          <div className="digit-group">
            <span className="digit">{minutes}</span>
            <span className="digit-label">Min</span>
          </div>
          <span className="digit-sep">:</span>
          <div className="digit-group">
            <span className="digit">{seconds}</span>
            <span className="digit-label">Sec</span>
          </div>
        </div>
      )}
    </div>
  );
}
