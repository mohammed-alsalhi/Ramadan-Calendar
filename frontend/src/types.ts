export type RamadanDay = {
  date: string;
  day: string;
  hijri: string;
  sahur: string;
  iftar: string;
  duration: string;
};

export type Dua = {
  title: string;
  arabic: string;
  translation: string;
  transliteration: string;
  reference: string;
};

export type Hadith = {
  arabic: string;
  english: string;
  source: string;
  grade: string;
};

export type RamadanResponse = {
  days: RamadanDay[];
  dua: Dua | null;
  hadith: Hadith | null;
};

export type PrayerTimesResponse = {
  data: {
    times: {
      Fajr: string;
      Sunrise: string;
      Dhuhr: string;
      Asr: string;
      Maghrib: string;
      Isha: string;
    };
  };
};
