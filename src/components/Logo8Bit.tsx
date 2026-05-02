// 5x7 pixel letters for "0DAY", rendered as SVG rects.
const LETTERS: Record<string, string[]> = {
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
};

const WORD = "0DAY";
const LETTER_W = 5;
const LETTER_H = 7;
const GAP = 1;
const PIXEL = 6;

interface Props {
  className?: string;
  color?: string;
  shadow?: string;
  scale?: number;
}

export function Logo8Bit({
  className = "",
  color = "#a78bfa",
  shadow = "#22d3ee",
  scale = 1,
}: Props) {
  const widthCells = WORD.length * LETTER_W + (WORD.length - 1) * GAP;
  const w = widthCells * PIXEL;
  const h = LETTER_H * PIXEL;
  const renderW = w * scale;
  const renderH = h * scale;

  const rects: { x: number; y: number; fill: string }[] = [];

  WORD.split("").forEach((letter, idx) => {
    const grid = LETTERS[letter];
    if (!grid) return;
    const xOffset = idx * (LETTER_W + GAP);
    grid.forEach((row, ry) => {
      row.split("").forEach((cell, rx) => {
        if (cell === "1") {
          rects.push({ x: xOffset + rx, y: ry, fill: color });
        }
      });
    });
  });

  return (
    <svg
      viewBox={`-1 -1 ${w + 2} ${h + 2}`}
      width={renderW}
      height={renderH}
      className={className}
      style={{ imageRendering: "pixelated", maxWidth: "100%" }}
      aria-label="0DAY"
      role="img"
    >
      {rects.map((r, i) => (
        <rect
          key={`s-${i}`}
          x={r.x * PIXEL + 2}
          y={r.y * PIXEL + 2}
          width={PIXEL}
          height={PIXEL}
          fill={shadow}
          opacity={0.55}
        />
      ))}
      {rects.map((r, i) => (
        <rect
          key={i}
          x={r.x * PIXEL}
          y={r.y * PIXEL}
          width={PIXEL}
          height={PIXEL}
          fill={r.fill}
        />
      ))}
    </svg>
  );
}
