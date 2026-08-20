import type { Slide as SlideType, Lang } from "@/lib/deck";
import { ui } from "@/lib/i18n";
import ExercisePrompt from "./ExercisePrompt";
import ToolIcon from "./ToolIcon";
import StepsDetail from "./StepsDetail";

// Link mở tab mới, không làm chuyển slide.
function OpenLink({ url, label }: { url: string; label: string }) {
  return (
    <a
      className="open-link"
      href={url}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => e.stopPropagation()}
    >
      {label} <span aria-hidden>↗</span>
    </a>
  );
}

// Ảnh hoặc video (file .mp4/.webm -> video). Dùng cho slide profile.
function Media({ src, className }: { src: string; className?: string }) {
  const cls = `${className ?? ""} zoomable`.trim();
  if (/\.(mp4|webm)$/i.test(src)) {
    return <video className={cls} src={src} autoPlay muted loop playsInline />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={cls} src={src} alt="" />;
}

// Logo tổ chức: có file thì hiện logo, không thì badge chữ cái đầu.
function OrgLogo({ logo, name }: { logo?: string; name: string }) {
  if (logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="org-logo" src={logo} alt={name} />;
  }
  return <span className="org-letter">{(name.trim()[0] ?? "?").toUpperCase()}</span>;
}

// Khung ảnh tạm: hiển thị mô tả ảnh cần đặt. Có `image` thì hiện ảnh thật.
function Figure({ image, label, hint }: { image?: string; label?: string; hint: string }) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="figure-img zoomable" src={image} alt={label ?? ""} />;
  }
  return (
    <div className="figure" role="img" aria-label={label}>
      <div className="figure-icon" aria-hidden>+</div>
      <div className="figure-label">{label}</div>
      <div className="figure-hint">{hint}</div>
    </div>
  );
}

export default function Slide({ slide, lang }: { slide: SlideType; lang: Lang }) {
  const t = ui(lang);
  switch (slide.kind) {
    case "cover": {
      const collage = slide.images && slide.images.length > 0 ? slide.images : null;
      const hero = collage || slide.image || slide.placeholder;
      return (
        <div className={`slide cover ${hero ? "cover-split" : ""}`}>
          <div className="cover-main">
            {slide.eyebrow && <p className="eyebrow">{slide.eyebrow}</p>}
            <h1 className="title">{slide.title}</h1>
            {slide.subtitle && <p className="subtitle">{slide.subtitle}</p>}
            {slide.note && <p className="cover-note">{slide.note}</p>}
            {slide.link && (
              <a
                className="cover-link"
                href={slide.link.url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="cover-link-ico" aria-hidden>
                  🔗
                </span>
                {slide.link.label}
                <span aria-hidden>↗</span>
              </a>
            )}
            {slide.chips && slide.chips.length > 0 && (
              <div className="cover-chips">
                {slide.chips.map((c, i) => (
                  <span className="cover-chip" key={i}>
                    {c}
                  </span>
                ))}
              </div>
            )}
            {slide.footer && <p className="footer">{slide.footer}</p>}
          </div>
          {collage ? (
            <div className="cover-collage" aria-hidden>
              {collage.slice(0, 5).map((src, i) => (
                <span className={`cover-tile tile-${i + 1}`} key={i}>
                  <img className="zoomable" src={src} alt="" />
                </span>
              ))}
            </div>
          ) : hero ? (
            <div className="cover-hero">
              <Figure image={slide.image} label={slide.placeholder} hint={t.imageComingSoon} />
            </div>
          ) : null}
        </div>
      );
    }

    case "section":
      return (
        <div className="slide section">
          {slide.index && <div className="index">{slide.index}</div>}
          <h2 className="title">{slide.title}</h2>
          {slide.subtitle && <p className="subtitle">{slide.subtitle}</p>}
        </div>
      );

    case "bullets":
      return (
        <div className="slide bullets">
          {slide.eyebrow && <p className="eyebrow">{slide.eyebrow}</p>}
          <h2 className="title">{slide.title}</h2>
          <ul>
            {slide.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
          {slide.note && <p className="note">{slide.note}</p>}
          {slide.link && (
            <p className="bullets-link">
              <OpenLink url={slide.link.url} label={slide.link.label} />
            </p>
          )}
        </div>
      );

    case "steps": {
      const hasFigure = Boolean(slide.placeholder || slide.image);
      return (
        <div className={`slide steps ${hasFigure ? "steps-split" : ""}`}>
          <div className="steps-main">
            {slide.eyebrow && <p className="eyebrow">{slide.eyebrow}</p>}
            <h2 className="title">{slide.title}</h2>
            <ol className="steps-list">
              {slide.steps.map((s, i) => (
                <li key={i}>
                  <span className="step-num">{(slide.start ?? 1) + i}</span>
                  <span className="step-body">
                    <span className="step-title">
                      {s.title}
                      {s.icon && (
                        <ToolIcon
                          icon={s.icon}
                          name={s.title}
                          className="step-logo"
                        />
                      )}
                    </span>
                    {s.desc && <span className="step-desc">{s.desc}</span>}
                    {s.link && <OpenLink url={s.link.url} label={s.link.label} />}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          {(hasFigure || slide.detail) && (
            <div className="steps-aside">
              {hasFigure && <Figure image={slide.image} label={slide.placeholder} hint={t.imageComingSoon} />}
              {slide.detail && <StepsDetail detail={slide.detail} lang={lang} />}
            </div>
          )}
        </div>
      );
    }

    case "stats":
      return (
        <div className="slide stats">
          {slide.eyebrow && <p className="eyebrow">{slide.eyebrow}</p>}
          <h2 className="title">{slide.title}</h2>
          <div className="grid" data-cols={slide.stats.length}>
            {slide.stats.map((s, i) => (
              <div className="stat" key={i}>
                {s.icon && <div className="stat-ico" aria-hidden>{s.icon}</div>}
                <div className="value">{s.value}</div>
                <div className="label">{s.label}</div>
              </div>
            ))}
          </div>
          {slide.logos && (
            <div className="stats-logos">
              {slide.logos.caption && <p className="stats-logos-cap">{slide.logos.caption}</p>}
              <div className="stats-logos-panel">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={slide.logos.image} alt={slide.logos.caption ?? "logos"} />
              </div>
            </div>
          )}
        </div>
      );

    case "columns":
      return (
        <div className="slide columns">
          {slide.eyebrow && <p className="eyebrow">{slide.eyebrow}</p>}
          <h2 className="title">{slide.title}</h2>
          <div className="grid" data-cols={slide.columns.length}>
            {slide.columns.map((c, i) => (
              <div className="col" key={i}>
                {c.icon ? (
                  <ToolIcon icon={c.icon} name={c.heading} className="col-logo" />
                ) : (
                  <div className="num">{i + 1}</div>
                )}
                <h3>{c.heading}</h3>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case "tools":
      return (
        <div className="slide tools">
          {slide.eyebrow && <p className="eyebrow">{slide.eyebrow}</p>}
          <h2 className="title">{slide.title}</h2>
          <div className="tools-grid" data-cols={slide.tools.length}>
            {slide.tools.map((tool, i) => (
              <div className="tool-card" key={i}>
                <ToolIcon icon={tool.icon} name={tool.name} className="tool-logo-lg" />
                <div className="tool-info">
                  <h3>{tool.name}</h3>
                  <p>{tool.desc}</p>
                  {tool.url && <OpenLink url={tool.url} label={t.openOrDownload} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "gitflow":
      return (
        <div className="slide gitflow">
          {slide.eyebrow && <p className="eyebrow">{slide.eyebrow}</p>}
          <h2 className="title">{slide.title}</h2>
          {slide.subtitle && <p className="subtitle">{slide.subtitle}</p>}
          <div className={`gitflow-body ${slide.image ? "has-image" : ""}`}>
            <div className={`flow ${slide.image ? "flow-vertical" : ""}`}>
              <div className="flow-node local">
                <div className="flow-ico">💻</div>
                <h3>{slide.local.title}</h3>
                <p>{slide.local.desc}</p>
              </div>
              <div className="flow-arrows">
                <span className="arrow push">{slide.pushLabel ?? "push ↑"}</span>
                <span className="arrow pull">{slide.pullLabel ?? "pull ↓"}</span>
              </div>
              <div className="flow-node cloud">
                <div className="flow-ico">☁️</div>
                <h3>{slide.cloud.title}</h3>
                <p>{slide.cloud.desc}</p>
              </div>
            </div>
            {slide.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="gitflow-img zoomable" src={slide.image} alt={t.repoAlt} />
            )}
          </div>
          {slide.analogy && <p className="analogy">💡 {slide.analogy}</p>}
        </div>
      );

    case "compare":
      return (
        <div className="slide compare">
          {slide.eyebrow && <p className="eyebrow">{slide.eyebrow}</p>}
          <h2 className="title">{slide.title}</h2>
          <div className="compare-grid">
            {(["left", "right"] as const).map((side) => {
              const col = slide[side];
              const good = slide.highlight === side;
              return (
                <div className={`compare-card ${good ? "good" : "bad"}`} key={side}>
                  <div className="compare-head">
                    <span className="compare-mark">{good ? "✓" : "✕"}</span>
                    {col.heading}
                  </div>
                  {(col.placeholder || col.image) && (
                    <Figure image={col.image} label={col.placeholder} hint={t.imageComingSoon} />
                  )}
                  <ul>
                    {col.points.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      );

    case "split":
      return (
        <div className="slide split">
          <div className="split-text">
            {slide.eyebrow && <p className="eyebrow">{slide.eyebrow}</p>}
            <h2 className="title">{slide.title}</h2>
            <ul className="split-body">
              {slide.body.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
          <Figure image={slide.image} label={slide.placeholder} hint={t.imageComingSoon} />
        </div>
      );

    case "image":
      return (
        <div className="slide image-slide">
          {slide.eyebrow && <p className="eyebrow">{slide.eyebrow}</p>}
          {slide.title && <h2 className="title">{slide.title}</h2>}
          <Figure image={slide.image} label={slide.placeholder} hint={t.imageComingSoon} />
          {slide.caption && <p className="caption">{slide.caption}</p>}
        </div>
      );

    case "quote":
      return (
        <div className="slide quote">
          <div className="mark">&ldquo;</div>
          <blockquote>{slide.quote}</blockquote>
          {slide.author && <div className="author">{slide.author}</div>}
        </div>
      );

    case "gallery":
      return (
        <div className="slide gallery">
          {slide.eyebrow && <p className="eyebrow">{slide.eyebrow}</p>}
          <h2 className="title">{slide.title}</h2>
          {slide.subtitle && <p className="subtitle">{slide.subtitle}</p>}
          <div className="gallery-grid">
            {slide.items.map((it, i) => (
              <figure className="gallery-item" key={i}>
                {it.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="zoomable" src={it.image} alt={it.label} />
                ) : (
                  <div className="gallery-ph">
                    <span>🖼️</span>
                  </div>
                )}
                <figcaption>{it.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      );

    case "resources":
      return (
        <div className="slide resources">
          {slide.eyebrow && <p className="eyebrow">{slide.eyebrow}</p>}
          <h2 className="title">{slide.title}</h2>
          {slide.subtitle && <p className="subtitle">{slide.subtitle}</p>}
          <div className="res-grid">
            {slide.items.map((it, i) => (
              <a
                className="res-card"
                key={i}
                href={it.url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="res-thumb">
                  {it.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={it.image} alt={it.name} />
                  ) : (
                    <span aria-hidden>🖼️</span>
                  )}
                </div>
                <div className="res-body">
                  <div className="res-head">
                    <span className="res-name">{it.name}</span>
                    {it.tag && <span className="res-tag">{it.tag}</span>}
                  </div>
                  <p className="res-desc">{it.desc}</p>
                  <span className="res-host">
                    {it.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                    <span aria-hidden> ↗</span>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      );

    case "profile":
      return (
        <div className="slide profile">
          <div className="profile-head">
            {slide.index && <span className="p-index">{slide.index}</span>}
            <h2 className="title">{slide.title}</h2>
          </div>
          <div className="profile-grid">
            <div className="profile-left">
              <div className="p-avatar">
                {slide.avatar ? (
                  <Media src={slide.avatar} className="p-avatar-img" />
                ) : (
                  <div className="p-avatar-ph">🙂</div>
                )}
              </div>
              <div className="p-name">{slide.name}</div>
              <ul className="p-contact">
                {slide.email && (
                  <li>
                    <span className="c-ico">✉️</span>
                    <a href={`mailto:${slide.email}`}>{slide.email}</a>
                  </li>
                )}
                {slide.phone && (
                  <li>
                    <span className="c-ico">📞</span>
                    {slide.phone}
                  </li>
                )}
                {slide.linkedin && (
                  <li>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="c-logo" src="/icons/linkedin.svg" alt="LinkedIn" />
                    <a href={slide.linkedin} target="_blank" rel="noreferrer">
                      {slide.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com/, "")}
                    </a>
                  </li>
                )}
                {slide.discord && (
                  <li>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="c-logo" src="/icons/discord.svg" alt="Discord" />
                    {slide.discord}
                  </li>
                )}
              </ul>
              <ul className="p-edu">
                {slide.education.map((e, i) => (
                  <li key={i}>
                    <OrgLogo logo={e.logo} name={e.org} />
                    <span>
                      <b>{e.title}</b>
                      <small>{e.org}</small>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="careers">
              {slide.careers.map((c, i) => (
                <div className="career" key={i}>
                  <div className="career-media">
                    {c.image ? (
                      <Media src={c.image} className="career-img" />
                    ) : (
                      <div className="career-ph">🖼️</div>
                    )}
                  </div>
                  <div className="career-info">
                    <OrgLogo logo={c.logo} name={c.org} />
                    <div className="career-text">
                      <b>{c.role}</b>
                      <small>
                        {c.org}
                        {c.note && <em> · {c.note}</em>}
                      </small>
                    </div>
                  </div>
                  <ul className="career-points">
                    {c.points.map((p, j) => (
                      <li key={j}>{p}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "exercise":
      return (
        <div className="slide exercise">
          <span className="badge">{slide.badge}</span>
          <h2 className="title">{slide.title}</h2>
          <div
            className={`ex-body ${
              slide.placeholder || slide.image || slide.onPageNote ? "has-figure" : ""
            }`}
          >
            <ul className="ex-brief">
              {slide.brief.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
            {slide.onPageNote ? (
              <div className="ex-onpage">
                <div className="ex-onpage-ico">📋</div>
                <p>{slide.onPageNote}</p>
              </div>
            ) : (
              (slide.placeholder || slide.image) && (
                <Figure image={slide.image} label={slide.placeholder} hint={t.imageComingSoon} />
              )
            )}
          </div>
          {slide.success && (
            <p className="ex-success">
              <span className="ex-success-tag">{t.exDoneWhen}</span>
              {slide.success}
            </p>
          )}
          {slide.tip && <p className="ex-tip">💡 {slide.tip}</p>}
          {slide.link && (
            <p className="ex-link">
              <OpenLink url={slide.link.url} label={slide.link.label} />
            </p>
          )}
          {slide.prompt && (
            <ExercisePrompt
              prompt={slide.prompt}
              label={slide.promptLabel}
              tag={slide.promptTag}
              lang={lang}
            />
          )}
          {slide.detail && <StepsDetail detail={slide.detail} lang={lang} />}
          {slide.advanced && (
            <div className="ex-advanced">
              <div className="ex-adv-head">
                ⭐ {slide.advanced.title ?? t.advancedDefault}
              </div>
              <p className="ex-adv-note">{slide.advanced.note}</p>
              <ExercisePrompt
                prompt={slide.advanced.copyText}
                label={slide.advanced.copyLabel ?? t.copySample}
                tag={t.sampleTag}
                lang={lang}
              />
            </div>
          )}
        </div>
      );

    case "quiz": {
      const letters = ["A", "B", "C", "D", "E"];
      return (
        <div className="slide quiz">
          {slide.eyebrow && <p className="eyebrow">{slide.eyebrow}</p>}
          <h2 className="title">{slide.title}</h2>
          <div className="quiz-grid" data-cols={slide.options.length}>
            {slide.options.map((o, i) => {
              const isLie = slide.reveal && slide.lieIndex === i;
              const state = slide.reveal ? (isLie ? "lie" : "truth") : "";
              return (
                <div className={`quiz-card ${state}`} key={i}>
                  <div className="quiz-letter">{letters[i] ?? String(i + 1)}</div>
                  <h3>{o.label}</h3>
                  <p>{o.body}</p>
                  {slide.reveal && (
                    <span className={`quiz-badge ${isLie ? "x" : "ok"}`}>
                      {isLie ? "The lie ✕" : "True ✓"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          {slide.caption && <p className="quiz-caption">{slide.caption}</p>}
        </div>
      );
    }

    case "timeline":
      return (
        <div className="slide timeline">
          {slide.eyebrow && <p className="eyebrow">{slide.eyebrow}</p>}
          <h2 className="title">{slide.title}</h2>
          <div className="tl" data-cols={slide.events.length}>
            {slide.events.map((e, i) => (
              <div className="tl-item" key={i}>
                <div className="tl-rail">
                  <span className="tl-dot" />
                </div>
                <div className="tl-time">{e.time}</div>
                <div className="tl-card">
                  {(e.image || e.placeholder) && (
                    <div className="tl-media">
                      <Figure image={e.image} label={e.placeholder} hint={t.imageComingSoon} />
                    </div>
                  )}
                  <h3>{e.heading}</h3>
                  {e.desc && <p>{e.desc}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "statement":
      return (
        <div className={`slide statement ${slide.image || slide.placeholder ? "has-media" : ""}`}>
          <div className="stmt-text">
            {slide.kicker && <p className="eyebrow">{slide.kicker}</p>}
            <h2 className="stmt-title">{slide.title}</h2>
            {slide.sub && <p className="stmt-sub">{slide.sub}</p>}
          </div>
          {(slide.image || slide.placeholder) && (
            <div className="stmt-media">
              <Figure image={slide.image} label={slide.placeholder} hint={t.imageComingSoon} />
            </div>
          )}
        </div>
      );

    case "lessons":
      return (
        <div className="slide lessons">
          {slide.eyebrow && <p className="eyebrow">{slide.eyebrow}</p>}
          <h2 className="title">{slide.title}</h2>
          <div className="lessons-grid" data-cols={slide.items.length}>
            {slide.items.map((l, i) => (
              <div className="lesson-card" key={i}>
                <span className="lesson-index" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {l.icon && (
                  <div className="lesson-ico" aria-hidden>
                    {l.icon}
                  </div>
                )}
                <h3>{l.heading}</h3>
                <p>{l.body}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case "closing":
      return (
        <div className="slide closing">
          <h1 className="title">{slide.title}</h1>
          {slide.subtitle && <p className="subtitle">{slide.subtitle}</p>}
          {slide.note && <p className="closing-note">{slide.note}</p>}
          {slide.cta && <span className="cta">{slide.cta}</span>}
        </div>
      );
  }
}
