import type { RamadanDay, Dua, Hadith } from "./types";

const W = 720;
const H = 1280;

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawStars(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  const seeds = [
    [80, 120], [200, 80], [350, 150], [500, 60], [620, 130],
    [100, 300], [400, 250], [580, 310], [260, 200], [650, 220],
    [50, 450], [320, 400], [520, 480], [150, 500], [680, 400],
  ];
  for (const [x, y] of seeds) {
    const r = 1 + Math.random() * 1.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function generateShareCard(
  day: RamadanDay,
  dayNumber: number,
  city: string
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, W * 0.3, H);
  bg.addColorStop(0, "#0c0a1d");
  bg.addColorStop(0.4, "#1a1145");
  bg.addColorStop(1, "#0f172a");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Stars
  drawStars(ctx);

  // Crescent moon
  ctx.font = "80px serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "#fbbf24";
  ctx.shadowColor = "rgba(251,191,36,0.5)";
  ctx.shadowBlur = 30;
  ctx.fillText("\u263E", W / 2, 160);
  ctx.shadowBlur = 0;

  // Title
  ctx.font = "bold 52px 'Segoe UI', system-ui, sans-serif";
  ctx.fillStyle = "#fefce8";
  ctx.fillText("Ramadan Mubarak", W / 2, 250);

  // Subtitle
  ctx.font = "24px 'Segoe UI', system-ui, sans-serif";
  ctx.fillStyle = "#a78bfa";
  ctx.fillText(`1447 AH \u00B7 ${city}`, W / 2, 295);

  // Day badge
  ctx.font = "bold 20px 'Segoe UI', system-ui, sans-serif";
  ctx.fillStyle = "#fbbf24";
  ctx.letterSpacing = "3px";
  ctx.fillText(`DAY ${dayNumber}`, W / 2, 380);
  ctx.letterSpacing = "0px";

  // Date
  ctx.font = "36px 'Segoe UI', system-ui, sans-serif";
  ctx.fillStyle = "#f8fafc";
  ctx.fillText(`${day.day}, ${day.date}`, W / 2, 430);

  // Hijri
  ctx.font = "22px 'Segoe UI', system-ui, sans-serif";
  ctx.fillStyle = "#a78bfa";
  ctx.fillText(day.hijri, W / 2, 470);

  // Fasting card background
  const cardX = 60;
  const cardY = 530;
  const cardW = W - 120;
  const cardH = 380;
  roundRect(ctx, cardX, cardY, cardW, cardH, 24);
  const cardBg = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
  cardBg.addColorStop(0, "rgba(67,56,202,0.2)");
  cardBg.addColorStop(1, "rgba(30,27,75,0.4)");
  ctx.fillStyle = cardBg;
  ctx.fill();
  ctx.strokeStyle = "#4338ca";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Sahur row
  const rowY1 = cardY + 80;
  ctx.textAlign = "left";
  ctx.font = "36px serif";
  ctx.fillStyle = "#a78bfa";
  ctx.fillText("\u263E", cardX + 40, rowY1);
  ctx.font = "28px 'Segoe UI', system-ui, sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("Sahur", cardX + 95, rowY1);
  ctx.textAlign = "right";
  ctx.font = "bold 32px 'Segoe UI', system-ui, sans-serif";
  ctx.fillStyle = "#fbbf24";
  ctx.fillText(day.sahur, cardX + cardW - 40, rowY1);

  // Divider
  ctx.beginPath();
  ctx.moveTo(cardX + 40, rowY1 + 40);
  ctx.lineTo(cardX + cardW - 40, rowY1 + 40);
  ctx.strokeStyle = "rgba(67,56,202,0.3)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Iftar row
  const rowY2 = rowY1 + 110;
  ctx.textAlign = "left";
  ctx.font = "36px serif";
  ctx.fillStyle = "#fbbf24";
  ctx.fillText("\u263C", cardX + 40, rowY2);
  ctx.font = "28px 'Segoe UI', system-ui, sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("Iftar", cardX + 95, rowY2);
  ctx.textAlign = "right";
  ctx.font = "bold 32px 'Segoe UI', system-ui, sans-serif";
  ctx.fillStyle = "#fbbf24";
  ctx.fillText(day.iftar, cardX + cardW - 40, rowY2);

  // Duration
  ctx.textAlign = "center";
  ctx.font = "22px 'Segoe UI', system-ui, sans-serif";
  ctx.fillStyle = "#6d5faa";
  ctx.fillText(`Fasting: ${day.duration}`, W / 2, rowY2 + 90);

  // Footer
  ctx.font = "18px 'Segoe UI', system-ui, sans-serif";
  ctx.fillStyle = "#4a4070";
  ctx.fillText("Generated with Ramadan Calendar App", W / 2, H - 60);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/png");
  });
}

function drawBackground(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const bg = ctx.createLinearGradient(0, 0, w * 0.3, h);
  bg.addColorStop(0, "#0c0a1d");
  bg.addColorStop(0.4, "#1a1145");
  bg.addColorStop(1, "#0f172a");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  drawStars(ctx);
}

function drawHeader(ctx: CanvasRenderingContext2D, w: number) {
  ctx.font = "60px serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "#fbbf24";
  ctx.shadowColor = "rgba(251,191,36,0.5)";
  ctx.shadowBlur = 30;
  ctx.fillText("\u263E", w / 2, 120);
  ctx.shadowBlur = 0;

  ctx.font = "bold 44px 'Segoe UI', system-ui, sans-serif";
  ctx.fillStyle = "#fefce8";
  ctx.fillText("Ramadan Mubarak", w / 2, 195);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(" ");
  let line = "";
  let curY = y;
  for (const word of words) {
    const test = line + (line ? " " : "") + word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, curY);
      line = word;
      curY += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, curY);
  return curY + lineHeight;
}

export function generateDuaCard(dua: Dua): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  drawBackground(ctx, W, H);
  drawHeader(ctx, W);

  // Label
  ctx.font = "bold 20px 'Segoe UI', system-ui, sans-serif";
  ctx.fillStyle = "#fbbf24";
  ctx.textAlign = "center";
  ctx.fillText("DUA FOR FASTING", W / 2, 270);

  // Title
  ctx.font = "26px 'Segoe UI', system-ui, sans-serif";
  ctx.fillStyle = "#a78bfa";
  ctx.fillText(dua.title, W / 2, 320);

  // Arabic
  ctx.font = "40px 'Traditional Arabic', serif";
  ctx.fillStyle = "#fefce8";
  ctx.direction = "rtl";
  let y = wrapText(ctx, dua.arabic, W / 2, 420, W - 120, 60);
  ctx.direction = "ltr";

  // Transliteration
  y += 20;
  ctx.font = "italic 22px 'Segoe UI', system-ui, sans-serif";
  ctx.fillStyle = "#c4b5fd";
  y = wrapText(ctx, dua.transliteration, W / 2, y, W - 120, 34);

  // Translation
  y += 20;
  ctx.font = "22px 'Segoe UI', system-ui, sans-serif";
  ctx.fillStyle = "#94a3b8";
  y = wrapText(ctx, dua.translation, W / 2, y, W - 120, 34);

  // Reference
  y += 20;
  ctx.font = "18px 'Segoe UI', system-ui, sans-serif";
  ctx.fillStyle = "#6d5faa";
  ctx.fillText(dua.reference, W / 2, y);

  // Footer
  ctx.font = "18px 'Segoe UI', system-ui, sans-serif";
  ctx.fillStyle = "#4a4070";
  ctx.fillText("Generated with Ramadan Calendar App", W / 2, H - 60);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/png");
  });
}

export function generateHadithCard(hadith: Hadith): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  drawBackground(ctx, W, H);
  drawHeader(ctx, W);

  // Label
  ctx.font = "bold 20px 'Segoe UI', system-ui, sans-serif";
  ctx.fillStyle = "#fbbf24";
  ctx.textAlign = "center";
  ctx.fillText("HADITH", W / 2, 270);

  // Arabic
  ctx.font = "40px 'Traditional Arabic', serif";
  ctx.fillStyle = "#fefce8";
  ctx.direction = "rtl";
  let y = wrapText(ctx, hadith.arabic, W / 2, 380, W - 120, 60);
  ctx.direction = "ltr";

  // English
  y += 30;
  ctx.font = "22px 'Segoe UI', system-ui, sans-serif";
  ctx.fillStyle = "#94a3b8";
  y = wrapText(ctx, hadith.english, W / 2, y, W - 120, 34);

  // Source & grade
  y += 25;
  ctx.font = "18px 'Segoe UI', system-ui, sans-serif";
  ctx.fillStyle = "#6d5faa";
  const sourceText = hadith.grade
    ? `${hadith.source} \u00B7 ${hadith.grade}`
    : hadith.source;
  ctx.fillText(sourceText, W / 2, y);

  // Footer
  ctx.font = "18px 'Segoe UI', system-ui, sans-serif";
  ctx.fillStyle = "#4a4070";
  ctx.fillText("Generated with Ramadan Calendar App", W / 2, H - 60);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/png");
  });
}

async function doShare(blob: Blob, filename: string, title: string, text: string) {
  const file = new File([blob], filename, { type: "image/png" });
  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({ title, text, files: [file] });
  } else {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}

export async function shareOrDownload(
  day: RamadanDay,
  dayNumber: number,
  city: string
) {
  const blob = await generateShareCard(day, dayNumber, city);
  await doShare(blob, `ramadan-day-${dayNumber}.png`, `Ramadan Day ${dayNumber}`, `Sahur: ${day.sahur} | Iftar: ${day.iftar}`);
}

export async function shareDua(dua: Dua) {
  const blob = await generateDuaCard(dua);
  await doShare(blob, "ramadan-dua.png", "Ramadan Dua", dua.translation);
}

export async function shareHadith(hadith: Hadith) {
  const blob = await generateHadithCard(hadith);
  await doShare(blob, "ramadan-hadith.png", "Ramadan Hadith", hadith.english);
}
