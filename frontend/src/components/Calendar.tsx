import { useEffect, useRef, useState } from "react";
import type { RamadanDay } from "../types";
import DayModal from "./DayModal";

interface CalendarProps {
  days: RamadanDay[];
  coords: { lat: string; lon: string };
  city: string;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar({ days, coords, city }: CalendarProps) {
  const today = new Date().toISOString().split("T")[0];
  const todayRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    todayRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [days]);

  const firstDate = new Date(days[0].date + "T00:00:00");
  const startDay = firstDate.getDay();

  const blanks = Array.from({ length: startDay }, (_, i) => (
    <div key={`blank-${i}`} className="calendar-cell empty" />
  ));

  const dayCells = days.map((day, index) => {
    const isToday = day.date === today;
    const isPast = day.date < today;

    return (
      <div
        key={day.date}
        ref={isToday ? todayRef : undefined}
        className={`calendar-cell ${isToday ? "today" : ""} ${isPast ? "past" : ""}`}
        onClick={() => setSelectedIndex(index)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedIndex(index); } }}
        tabIndex={0}
        role="button"
        aria-label={`Day ${index + 1}, ${day.date}, Sahur ${day.sahur}, Iftar ${day.iftar}${isToday ? ", Today" : ""}`}
      >
        <div className="cell-header">
          <span className="cell-day-num">Day {index + 1}</span>
          <span className="cell-date">
            {new Date(day.date + "T00:00:00").getDate()}{" "}
            {new Date(day.date + "T00:00:00").toLocaleString("en", { month: "short" })}
          </span>
        </div>
        <div className="cell-hijri">{day.hijri}</div>
        <div className="cell-times">
          <div className="cell-time sahur-time">
            <span className="cell-time-icon">&#9790;</span>
            <span className="cell-time-value">{day.sahur}</span>
          </div>
          <div className="cell-time iftar-time">
            <span className="cell-time-icon">&#9788;</span>
            <span className="cell-time-value">{day.iftar}</span>
          </div>
        </div>
        <div className="cell-duration">{day.duration}</div>
        {isToday && <div className="today-badge">Today</div>}
      </div>
    );
  });

  return (
    <div id="calendar" className="calendar" role="region" aria-label="Ramadan Calendar">
      <div className="calendar-header">
        {WEEKDAYS.map((d) => (
          <div key={d} className="calendar-weekday">
            {d}
          </div>
        ))}
      </div>
      <div className="calendar-grid">
        {blanks}
        {dayCells}
      </div>

      {selectedIndex !== null && (
        <DayModal
          day={days[selectedIndex]}
          dayNumber={selectedIndex + 1}
          coords={coords}
          city={city}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </div>
  );
}
