"use client";

import { useEffect } from "react";

export type ZoomMedia = { src: string; video: boolean } | null;

// Phóng to ảnh/video toàn màn hình. Bấm nền hoặc Esc để đóng.
export default function Lightbox({
  media,
  onClose,
}: {
  media: ZoomMedia;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!media) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [media, onClose]);

  if (!media) return null;

  return (
    <div className="lightbox" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose} aria-label="Đóng">
        ✕
      </button>
      {media.video ? (
        <video
          className="lightbox-media"
          src={media.src}
          autoPlay
          muted
          loop
          playsInline
          controls
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="lightbox-media"
          src={media.src}
          alt=""
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>
  );
}
