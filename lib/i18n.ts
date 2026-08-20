// ===========================================================================
//  I18N — chuỗi giao diện (chrome) của trình chiếu, song ngữ Việt / English.
//  Nội dung slide nằm ở deck.ts (qua helper t()). File này chỉ chứa các nhãn
//  cố định trên khung trình chiếu và trong các component (nút, tooltip…).
// ===========================================================================
import type { Lang } from "./deck";

export type { Lang };

export const UI = {
  vi: {
    langName: "Tiếng Việt",
    langSwitchTo: "EN",
    navPrev: "Trước",
    navNext: "Sau",
    hintNav: "chuyển slide",
    hintFull: "toàn màn hình",
    imageComingSoon: "Ảnh sẽ thêm sau",
    openOrDownload: "Mở / Tải",
    repoAlt: "Repo trên GitHub",
    exDoneWhen: "✅ Hoàn thành khi",
    advancedDefault: "Nâng cao (không bắt buộc)",
    copySample: "Copy nội dung mẫu",
    sampleTag: "Nội dung mẫu",
    promptReveal: "Xem lời giải — prompt gửi cho AI",
    promptTagDefault: "Prompt — copy & gửi cho AI",
    copy: "Copy",
    copied: "Đã copy ✓",
    hide: "Ẩn đi",
    detailBtn: "Xem hướng dẫn chi tiết (ảnh từng bước)",
    detailTitle: "Hướng dẫn chi tiết",
    close: "Đóng",
  },
  en: {
    langName: "English",
    langSwitchTo: "VI",
    navPrev: "Previous",
    navNext: "Next",
    hintNav: "change slide",
    hintFull: "fullscreen",
    imageComingSoon: "Image coming soon",
    openOrDownload: "Open / Download",
    repoAlt: "Repo on GitHub",
    exDoneWhen: "✅ Done when",
    advancedDefault: "Advanced (optional)",
    copySample: "Copy the sample",
    sampleTag: "Sample content",
    promptReveal: "Show the solution — prompt to send the AI",
    promptTagDefault: "Prompt — copy & send to the AI",
    copy: "Copy",
    copied: "Copied ✓",
    hide: "Hide",
    detailBtn: "See detailed guide (step-by-step images)",
    detailTitle: "Detailed guide",
    close: "Close",
  },
} as const;

export type UIStrings = (typeof UI)[Lang];

export function ui(lang: Lang): UIStrings {
  return UI[lang];
}
