"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getDeck, type Lang } from "@/lib/deck";
import { ui } from "@/lib/i18n";
import { themeClass, usesPitchDeck } from "@/lib/theme";
import { getPitchDeck } from "@/lib/pitch";
import Background from "./Background";
import Slide from "./Slide";
import PitchSlide from "./PitchSlide";
import Lightbox, { type ZoomMedia } from "./Lightbox";

// Slide nhiều nội dung → giữ nhịp bố cục (ribbon-subtle).
const CONTENT_KINDS = new Set([
  "bullets",
  "stats",
  "columns",
  "tools",
  "gitflow",
  "steps",
  "compare",
  "split",
  "image",
  "gallery",
  "profile",
  "exercise",
]);

// Theme "pitch" dùng bộ slide riêng (lib/pitch.ts) với layout riêng
// (components/PitchSlide.tsx). Các theme khác dùng bộ slide gốc.
const IS_PITCH = usesPitchDeck();

// Slide nào trình bày TRÀN VIỀN (chiếm trọn màn hình, không khung 16:9).
//
// QUY TẮC: slide nào **tự vẽ nền phủ cả slide** thì BẮT BUỘC tràn viền. Nếu để
// trong khung 16:9 thì nền riêng đó bị bó lại, còn quanh khung là nền .bg khác
// màu — nhìn thành "một tấm ảnh dán lên nền".
//
// Hiện có 3 trường hợp:
//   • cover      — nền là ảnh bg-cover.jpg
//   • numbers    — nền là ảnh bg-arc.jpg
//   • statement  — CHỈ khi bare: true (nền tối trơn). statement thường dùng nền
//                  .bg chung nên giữ khung.
//
// Vì điều kiện phụ thuộc cả trường của slide (không chỉ kind) nên dùng hàm thay
// vì một Set các kind.
//
// Các slide còn lại dùng chung nền .bg nên nằm trong khung vẫn liền mạch, và
// giữ khung giúp không bị méo tỉ lệ ở màn không phải 16:9 (đã thử bật tràn viền
// cho tất cả: ở màn 5:4 biểu đồ bị kéo cao, nhãn trục chạm thanh điều khiển).
function isFullBleed(slide: { kind: string; bare?: boolean }): boolean {
  if (slide.kind === "cover" || slide.kind === "numbers") return true;
  if (slide.kind === "statement" && slide.bare) return true;
  return false;
}

const LANG_KEY = "vibecode-lang";

export default function Deck() {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState<ZoomMedia>(null);
  const [lang, setLang] = useState<Lang>("vi");

  // Khôi phục ngôn ngữ đã chọn (localStorage); cho phép override qua ?lang=en.
  useEffect(() => {
    const saved = window.localStorage.getItem(LANG_KEY);
    if (saved === "vi" || saved === "en") setLang(saved);
    const q = new URLSearchParams(window.location.search).get("lang");
    if (q === "vi" || q === "en") setLang(q);
  }, []);

  const deck = useMemo(
    () => (IS_PITCH ? getPitchDeck(lang) : getDeck(lang)),
    [lang],
  );
  const t = ui(lang);
  const total = deck.length;

  // Preload toàn bộ ảnh/video trong deck ngay từ đầu → chuyển slide là ảnh hiện
  // liền, không còn cảnh "tới slide mới bắt đầu load". Ảnh tải ngầm vào cache.
  useEffect(() => {
    const urls = new Set<string>();
    const walk = (n: unknown) => {
      if (typeof n === "string") {
        if (/\.(png|jpe?g|svg|webp|gif|mp4|webm)$/i.test(n)) urls.add(n);
      } else if (Array.isArray(n)) {
        n.forEach(walk);
      } else if (n && typeof n === "object") {
        Object.values(n as Record<string, unknown>).forEach(walk);
      }
    };
    // đường dẫn ảnh giống nhau ở mọi ngôn ngữ
    walk(IS_PITCH ? getPitchDeck("vi") : getDeck("vi"));
    urls.forEach((u) => {
      if (/\.(mp4|webm)$/i.test(u)) {
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.as = "video";
        link.href = u;
        document.head.appendChild(link);
      } else {
        const img = new Image();
        img.decoding = "async";
        img.src = u;
      }
    });
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next: Lang = prev === "vi" ? "en" : "vi";
      try {
        window.localStorage.setItem(LANG_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  // Deep-link: mở #3 để vào thẳng slide 3 (tiện trình chiếu / kiểm tra).
  useEffect(() => {
    const fromHash = parseInt(window.location.hash.slice(1), 10);
    if (!Number.isNaN(fromHash)) {
      setI(Math.min(total - 1, Math.max(0, fromHash - 1)));
    }
  }, [total]);

  const go = useCallback(
    (dir: number) => {
      setI((prev) => Math.min(total - 1, Math.max(0, prev + dir)));
    },
    [total]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (zoom) return; // đang phóng to: để Lightbox tự xử lý (Esc)
      switch (e.key) {
        case "ArrowRight":
        case " ":
        case "PageDown":
          e.preventDefault();
          go(1);
          break;
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          go(-1);
          break;
        case "Home":
          setI(0);
          break;
        case "End":
          setI(total - 1);
          break;
        case "f":
        case "F":
          if (document.fullscreenElement) document.exitFullscreen();
          else document.documentElement.requestFullscreen();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, total, zoom]);

  // Bấm vào ảnh/video có class .zoomable -> mở lightbox (không chuyển slide).
  const onStageClick = useCallback((e: React.MouseEvent) => {
    const el = (e.target as HTMLElement).closest(".zoomable");
    if (el) {
      e.stopPropagation();
      const src = el.getAttribute("src") || "";
      if (src) setZoom({ src, video: el.tagName === "VIDEO" });
      return;
    }
    go(1);
  }, [go]);

  const pct = total > 1 ? (i / (total - 1)) * 100 : 100;
  const current = deck[Math.min(i, total - 1)];
  const kind = current.kind;
  // Theme lấy từ lib/theme.ts — đổi ACTIVE_THEME ở đó là đổi cả bộ slide.
  const theme = themeClass();
  const ribbon = !IS_PITCH && CONTENT_KINDS.has(kind) ? "ribbon-subtle" : "";
  // Slide tràn viền: chiếm trọn màn hình, không còn khung 16:9 và không thấy
  // nền phía sau. Dùng cho trang bìa (và trang kết) của bộ pitch.
  const bleed = IS_PITCH && isFullBleed(current as { kind: string; bare?: boolean }) ? "stage-bleed" : "";

  return (
    <div className={`app ${theme} ${ribbon}`}>
      <Background />
      <div className="progress" style={{ width: `${pct}%` }} />

      <main className={`stage ${IS_PITCH ? "stage-pitch" : ""} ${bleed}`} onClick={onStageClick}>
        {/* key buộc remount để chạy lại animation mỗi lần chuyển slide / đổi ngôn ngữ */}
        {IS_PITCH ? (
          <div className="pd-stage">
            <PitchSlide
              key={`${lang}-${i}`}
              slide={current as import("@/lib/pitch").PitchSlide}
              lang={lang}
            />
          </div>
        ) : (
          <Slide
            key={`${lang}-${i}`}
            slide={current as import("@/lib/deck").Slide}
            lang={lang}
          />
        )}
      </main>

      <Lightbox media={zoom} onClose={() => setZoom(null)} />

      <button
        className="lang-toggle"
        onClick={(e) => {
          e.stopPropagation();
          toggleLang();
        }}
        aria-label="Switch language"
        title={lang === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
      >
        <span className="lang-globe" aria-hidden>
          🌐
        </span>
        {t.langSwitchTo}
      </button>

      <div className="hint">
        <kbd>←</kbd> <kbd>→</kbd> {t.hintNav} · <kbd>F</kbd> {t.hintFull}
      </div>

      <nav className="nav" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => go(-1)} disabled={i === 0} aria-label={t.navPrev}>
          ‹
        </button>
        <button
          onClick={() => go(1)}
          disabled={i === total - 1}
          aria-label={t.navNext}
        >
          ›
        </button>
      </nav>

      <div className="counter">
        <b>{String(i + 1).padStart(2, "0")}</b> / {String(total).padStart(2, "0")}
      </div>
    </div>
  );
}
