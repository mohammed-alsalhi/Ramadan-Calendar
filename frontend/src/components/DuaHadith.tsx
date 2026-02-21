import { useState } from "react";
import type { Dua, Hadith } from "../types";
import { shareDua, shareHadith } from "../shareCard";

interface DuaHadithProps {
  dua: Dua | null;
  hadith: Hadith | null;
}

export default function DuaHadith({ dua, hadith }: DuaHadithProps) {
  const [tab, setTab] = useState<"dua" | "hadith">("dua");

  if (!dua && !hadith) return null;

  return (
    <div className="dua-hadith" role="region" aria-label="Dua and Hadith">
      <div className="dua-hadith-tabs">
        {dua && (
          <button
            className={`dua-hadith-tab ${tab === "dua" ? "active" : ""}`}
            onClick={() => setTab("dua")}
            aria-pressed={tab === "dua"}
          >
            Dua
          </button>
        )}
        {hadith && (
          <button
            className={`dua-hadith-tab ${tab === "hadith" ? "active" : ""}`}
            onClick={() => setTab("hadith")}
            aria-pressed={tab === "hadith"}
          >
            Hadith
          </button>
        )}
      </div>

      {tab === "dua" && dua && (
        <div className="dua-hadith-content">
          <div className="dua-title">{dua.title}</div>
          <div className="dua-arabic">{dua.arabic}</div>
          <div className="dua-transliteration">{dua.transliteration}</div>
          <div className="dua-translation">{dua.translation}</div>
          <div className="dua-reference">{dua.reference}</div>
          <button className="share-btn" onClick={() => shareDua(dua)}>
            Share Dua
          </button>
        </div>
      )}

      {tab === "hadith" && hadith && (
        <div className="dua-hadith-content">
          <div className="dua-arabic">{hadith.arabic}</div>
          <div className="dua-translation">{hadith.english}</div>
          <div className="dua-reference">
            {hadith.source}
            {hadith.grade && <span> &middot; {hadith.grade}</span>}
          </div>
          <button className="share-btn" onClick={() => shareHadith(hadith)}>
            Share Hadith
          </button>
        </div>
      )}
    </div>
  );
}
