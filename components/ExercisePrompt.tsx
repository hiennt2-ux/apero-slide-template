"use client";

import { useState } from "react";
import type { Lang } from "@/lib/deck";
import { ui } from "@/lib/i18n";

// Bấm để hiện prompt, có nút copy gửi cho AI.
// stopPropagation để click vào đây không làm chuyển slide.
export default function ExercisePrompt({
  prompt,
  label,
  tag,
  lang,
}: {
  prompt: string;
  label?: string;
  tag?: string;
  lang: Lang;
}) {
  const t = ui(lang);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard có thể bị chặn ngoài https — bỏ qua */
    }
  };

  return (
    <div className="prompt-box" onClick={(e) => e.stopPropagation()}>
      {!open ? (
        <button className="prompt-reveal" onClick={() => setOpen(true)}>
          <span className="prompt-reveal-icon">✨</span>
          {label ?? t.promptReveal}
        </button>
      ) : (
        <div className="prompt-open">
          <div className="prompt-head">
            <span className="prompt-tag">{tag ?? t.promptTagDefault}</span>
            <button className="prompt-copy" onClick={copy}>
              {copied ? t.copied : t.copy}
            </button>
          </div>
          <p className="prompt-text">{prompt}</p>
          <button className="prompt-hide" onClick={() => setOpen(false)}>
            {t.hide}
          </button>
        </div>
      )}
    </div>
  );
}
