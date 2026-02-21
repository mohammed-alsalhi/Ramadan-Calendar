interface HelpModalProps {
  onClose: () => void;
}

export default function HelpModal({ onClose }: HelpModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="How to use">
      <div className="help-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close help">
          &times;
        </button>

        <div className="help-title">How to Use</div>

        <div className="help-section">
          <div className="help-heading">Calendar</div>
          <p>Each cell shows a day of Ramadan with Sahur and Iftar times for your location. Today is highlighted in purple with a gold badge. Past days are dimmed.</p>
        </div>

        <div className="help-section">
          <div className="help-heading">Day Details</div>
          <p>Click any day to see its full details including the Hijri date and fasting duration. Today's modal also shows Athan times.</p>
        </div>

        <div className="help-section">
          <div className="help-heading">Countdown</div>
          <p>The countdown timer shows the time remaining until the next Sahur or Iftar and updates every second.</p>
        </div>

        <div className="help-section">
          <div className="help-heading">Who's Breaking Their Fast?</div>
          <p>See which major Muslim cities around the world are breaking their fast right now, who's up next, and who just finished. Calculated using real-time sunset data for 22 cities.</p>
        </div>

        <div className="help-section">
          <div className="help-heading">Dua &amp; Hadith</div>
          <p>A daily dua and hadith related to fasting, sourced from the Ramadan API. Tap "Share Dua" or "Share Hadith" to generate a shareable image card.</p>
        </div>

        <div className="help-section">
          <div className="help-heading">Share Cards</div>
          <p>Share beautiful image cards for any day, dua, or hadith. On mobile, uses the native share sheet. On desktop, downloads as a PNG.</p>
        </div>

        <div className="help-section">
          <div className="help-heading">Location</div>
          <p>The app detects your location automatically. If browser location is denied, it falls back to IP-based geolocation, then defaults to Urbana, IL.</p>
        </div>

        <div className="help-section">
          <div className="help-heading">Accessibility</div>
          <p>Fully keyboard navigable — Tab through the calendar, Enter or Space to open a day. Supports screen readers and reduced-motion preferences.</p>
        </div>

        <div className="help-divider" />

        <div className="help-section">
          <div className="help-heading">About</div>
          <p>Built for the MTC Programming Assessment. Fasting data is provided by IslamicAPI and athan times by IslamicAPI's prayer-time endpoint.</p>
        </div>
      </div>
    </div>
  );
}
