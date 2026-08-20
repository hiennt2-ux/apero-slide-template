"use client";

import { useEffect, useState } from "react";
import type { DetailGuide, Lang } from "@/lib/deck";
import { ui } from "@/lib/i18n";

// Nút mở popup hướng dẫn chi tiết. Mỗi "shot" là một chỗ gắn ảnh từng bước.
// Bấm vào ảnh shot -> phóng to (đè trên popup). Esc: đóng zoom trước, rồi popup.
export default function StepsDetail({ detail, lang }: { detail: DetailGuide; lang: Lang }) {
  const t = ui(lang);
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        if (zoom) setZoom(null); // đang zoom -> đóng zoom trước
        else setOpen(false); // không zoom -> đóng popup
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, zoom]);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <button className="detail-btn" onClick={() => setOpen(true)}>
        <span>🔍</span> {t.detailBtn}
      </button>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <span className="modal-title">{t.detailTitle}</span>
              <button
                className="modal-close"
                onClick={() => setOpen(false)}
                aria-label={t.close}
              >
                ✕
              </button>
            </div>
            {detail.caption && <p className="modal-caption">{detail.caption}</p>}
            <div className="modal-grid">
              {detail.shots.map((s, i) => (
                <figure className="shot" key={i}>
                  {s.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className="zoomable"
                      src={s.image}
                      alt={s.label}
                      onClick={() => setZoom(s.image ?? null)}
                    />
                  ) : (
                    <div className="shot-ph">
                      <span>🖼️</span>
                    </div>
                  )}
                  <figcaption>
                    <b>{i + 1}.</b> {s.label}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      )}

      {zoom && (
        <div className="lightbox" onClick={() => setZoom(null)}>
          <button
            className="lightbox-close"
            onClick={() => setZoom(null)}
            aria-label={t.close}
          >
            ✕
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="lightbox-media"
            src={zoom}
            alt=""
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
