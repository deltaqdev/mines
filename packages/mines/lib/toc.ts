// Ported from Nuxt UI's ContentToc "circuit" highlight.

export const ROW_REM = 1.75;

const UNIT = 16;
const BEND = 6;
const INDENT = [0.5, 10.5];

/** SVG mask of a rail that runs through every row and steps inward for nested rows. */
export function railMask(levels: number[]) {
  const row = ROW_REM * UNIT;
  const xOf = (level: number) => INDENT[Math.min(level, 1)];

  let x = xOf(levels[0]);
  let path = `M${x} 0`;

  levels.forEach((level, i) => {
    const y = i * row;
    if (xOf(level) !== x) {
      x = xOf(level);
      path += ` L${x} ${y + BEND}`;
    }
    const bendsNext = i < levels.length - 1 && levels[i + 1] !== level;
    path += ` L${x} ${y + row - (bendsNext ? BEND : 0)}`;
  });

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 ${levels.length * row}'><path d='${path}' stroke='black' stroke-width='1' fill='none'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
