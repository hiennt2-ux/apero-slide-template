// ===========================================================================
//  CHỌN THEME
//  Đổi 1 dòng ACTIVE_THEME dưới đây là đổi toàn bộ giao diện bộ slide.
//  Các theme được định nghĩa trong app/theme.css (block .theme-*).
//
//    "brand" — ĐÚNG Apero Brand Guideline 4.0 (tím #4E018F + cam #F07D33,
//              tiêu đề font Clash). Dùng bộ slide pitch.
//    "pitch" — Dựng lại y bản pitch deck trên Canva (tím #AA61FF + cam đất
//              #E08245, tiêu đề Be Vietnam Pro). Dùng bộ slide pitch.
//    "apero" — Theme EB / chia sẻ nội bộ. Dùng bộ 29 slide gốc (lib/deck.ts).
// ===========================================================================

export type ThemeName = "brand" | "pitch" | "apero";

/** Theme đang dùng. Đổi giá trị này để đổi giao diện. */
export const ACTIVE_THEME: ThemeName = "brand";

/** Theme nào dùng bộ slide pitch (lib/pitch.ts) thay vì bộ gốc (lib/deck.ts). */
const PITCH_THEMES: ThemeName[] = ["brand", "pitch"];

export const usesPitchDeck = (t: ThemeName = ACTIVE_THEME) => PITCH_THEMES.includes(t);

export const themeClass = (t: ThemeName = ACTIVE_THEME) => `theme-${t}`;
