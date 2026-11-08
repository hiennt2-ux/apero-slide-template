import type { PitchSlide } from "./pitch";

export type PresentationSlide = PitchSlide & {
  sourceIndex: number;
  part: number;
  parts: number;
};

/** Conservative content budgets; never truncate a source row or card. */
export function preparePitchDeck(slides: PitchSlide[]): PresentationSlide[] {
  return slides.flatMap((slide, sourceIndex) => {
    let pages: PitchSlide[] = [slide];
    if (slide.kind === "cards" && (
      slide.cards.length > 3 || slide.cards.some(c => c.body.length > 180 || c.heading.length > 64)
    )) {
      pages = slide.cards.map((card, cardOffset) => ({
        ...slide, cards: [card], layout: "detail", cardOffset,
      }));
    }
    if (slide.kind === "table" && slide.rows.length > 0) {
      const rowsPerPage: string[][][] = [];
      let current: string[][] = [];
      let lines = 0;
      // Four rows at most; long cells consume more of the line budget.
      const charsPerLine = Math.max(12, Math.floor(112 / slide.columns.length));
      for (const row of slide.rows) {
        const weight = Math.max(1, ...row.map(cell => Math.ceil(cell.length / charsPerLine)));
        if (current.length && (current.length === 4 || lines + weight > 6)) {
          rowsPerPage.push(current);
          current = [];
          lines = 0;
        }
        current.push(row);
        lines += weight;
      }
      if (current.length) rowsPerPage.push(current);
      pages = rowsPerPage.map(rows => ({ ...slide, rows }));
    }
    return pages.map((page, part) => ({ ...page, sourceIndex, part, parts: pages.length }));
  });
}
