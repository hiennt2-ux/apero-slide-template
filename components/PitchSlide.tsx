import type { PitchSlide as P } from "@/lib/pitch";
import { ui } from "@/lib/i18n";
import type { Lang } from "@/lib/deck";

// Motif góc phải: 3 vòng tròn viền + 1 quả cầu gradient (asset gốc từ pptx).
function Motif() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="pd-motif" src="/pitch/motif-orbs.png" alt="" aria-hidden />;
}

// Logo APERO + tagline (bản trắng, tách nền từ deck gốc).
function Logo({ className }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={`pd-logo ${className ?? ""}`} src="/pitch/apero-logo.png" alt="Apero" />;
}

// Quả cầu số: gradient cam→tím, dùng cho cards / rows / roadmap / chú giải.
function Orb({ n, size }: { n: string; size?: "sm" | "md" | "lg" }) {
  return <span className={`pd-orb pd-orb-${size ?? "md"}`}>{n}</span>;
}

// Khung ảnh: viền đôi kiểu bản gốc. Có ảnh thì hiện, chưa có thì hiện mô tả.
function Frame({
  image,
  placeholder,
  ratio,
  lang,
}: {
  image?: string;
  placeholder?: string;
  ratio: "portrait" | "landscape";
  lang: Lang;
}) {
  return (
    <div className={`pd-frame pd-frame-${ratio}`}>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="pd-frame-img zoomable" src={image} alt="" />
      ) : (
        <div className="pd-frame-empty">
          <span>{placeholder ?? ui(lang).imageComingSoon}</span>
        </div>
      )}
    </div>
  );
}

// Dải đường nối của sơ đồ tổ chức: cuống từ root xuống, thanh ngang, rồi một
// cuống xuống mỗi nhánh.
//
// Các cuống nằm trong một GRID GIỐNG HỆT grid của các thẻ (cùng số cột, cùng
// gap) nên tự thẳng tâm thẻ — không phải tính vị trí theo phần trăm, vốn sai vì
// phần trăm không trừ đi khoảng cách giữa các thẻ.
function OrgConnector({ count }: { count: number }) {
  return (
    <div className="pd-org-link" style={{ ["--n" as string]: count }} aria-hidden>
      <span className="pd-org-link-stem" />
      <div className="pd-org-link-row">
        {Array.from({ length: count }, (_, i) => (
          <span
            key={i}
            className={`pd-org-link-cell${i === count - 1 ? " is-last" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}

// Vòng closed loop: 3 cung nối 3 mắt xích, mỗi cung có mũi tên chỉ chiều.
// Mắt xích nằm ở -90° (trên), 30° (phải-dưới), 150° (trái-dưới); mỗi cung chừa
// 18° hai đầu để mũi tên không chạm vào thẻ.
function LoopRing() {
  const R = 78, C = 100, GAP = 18;
  const at = (deg: number) => {
    const r = ((deg - 0) * Math.PI) / 180;
    return [C + R * Math.cos(r), C + R * Math.sin(r)] as const;
  };
  const arcs = [
    [-90, 30],
    [30, 150],
    [150, 270],
  ].map(([a, b]) => {
    const [x1, y1] = at(a + GAP);
    const [x2, y2] = at(b - GAP);
    return `M${x1.toFixed(2)},${y1.toFixed(2)} A${R},${R} 0 0 1 ${x2.toFixed(2)},${y2.toFixed(2)}`;
  });
  return (
    <svg className="pd-ring" viewBox="0 0 200 200" aria-hidden>
      <defs>
        <marker
          id="pd-loop-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <path d="M0,0 L10,5 L0,10 Z" fill="currentColor" />
        </marker>
      </defs>
      {arcs.map((d, i) => (
        <path key={i} d={d} markerEnd="url(#pd-loop-arrow)" />
      ))}
    </svg>
  );
}

const two = (i: number) => String(i + 1).padStart(2, "0");

export default function PitchSlide({ slide, lang }: { slide: P; lang: Lang }) {
  switch (slide.kind) {
    // ------------------------------------------------------------------ bìa
    case "cover":
      return (
        <section className="pd-slide pd-cover">
          <div className="pd-cover-left">
            <Logo className="pd-logo-cover" />
            <h1 className="pd-cover-title">{slide.title}</h1>
            {slide.subtitle && <p className="pd-cover-sub">{slide.subtitle}</p>}
            {slide.chips && (
              <div className="pd-chips">
                {slide.chips.map((c) => (
                  <span className="pd-chip" key={c}>
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>
      );

    // -------------------------------------------- tiêu đề 2 dòng + danh sách
    case "numbers":
      return (
        <section className="pd-slide pd-numbers">
          {/* Nền (tím + vòng cung phát sáng) là ảnh gốc, khai báo ở .pd-numbers
              trong pitch.css — không cần element riêng để vẽ vòng cung nữa. */}
          <div className="pd-numbers-left">
            <h2 className="pd-title-stack">
              <span className="pd-title-top">{slide.titleTop}</span>
              <span className="pd-title-accent">{slide.titleAccent}</span>
            </h2>
            {slide.lead && <p className="pd-lead">{slide.lead}</p>}
          </div>
          <ol className="pd-numbers-list">
            {slide.items.map((it, i) => (
              <li className="pd-numbers-item" key={i}>
                <span className="pd-bignum">{i + 1}</span>
                <p>{it.text}</p>
              </li>
            ))}
          </ol>
        </section>
      );

    // ------------------------------------------- tiêu đề 2 dòng + ảnh dọc
    case "story":
      return (
        <section className="pd-slide pd-story">
          <div className="pd-story-left">
            <h2 className="pd-title-stack">
              <span className="pd-title-top">{slide.titleTop}</span>
              {slide.titleAccent && <span className="pd-title-top">{slide.titleAccent}</span>}
            </h2>
            <div className="pd-paras">
              {slide.paragraphs.map((x, i) => (
                <p key={i}>{x}</p>
              ))}
            </div>
          </div>
          <div className="pd-story-right">
            <Frame image={slide.image} placeholder={slide.placeholder} ratio="portrait" lang={lang} />
          </div>
          <Motif />
        </section>
      );

    // ------------------------------------------------------------ 3 thẻ dọc
    case "cards":
      return (
        <section className="pd-slide pd-cards">
          <header className="pd-head">
            <h2 className="pd-title">{slide.title}</h2>
            <Motif />
          </header>
          {slide.lead && <p className="pd-lead pd-lead-wide">{slide.lead}</p>}
          <div className="pd-card-grid">
            {slide.cards.map((c, i) => (
              <article className="pd-card" key={i}>
                <Orb n={two(i)} size="lg" />
                <h3 className="pd-card-heading">{c.heading}</h3>
                <p className="pd-card-body">{c.body}</p>
              </article>
            ))}
          </div>
        </section>
      );

    // ------------------------------------------------------- 4 thẻ ngang 2×2
    case "rows":
      return (
        <section className="pd-slide pd-rows">
          <header className="pd-head">
            <h2 className="pd-title">{slide.title}</h2>
            <Motif />
          </header>
          <div className="pd-row-grid">
            {slide.rows.map((r, i) => (
              <article className="pd-row" key={i}>
                <Orb n={two(i)} size="lg" />
                <div>
                  <h3 className="pd-card-heading">{r.heading}</h3>
                  <p className="pd-card-body">{r.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      );

    // ---------------------------------------------- sản phẩm + ảnh ngang
    case "product":
      return (
        <section className="pd-slide pd-product">
          <header className="pd-head">
            <h2 className="pd-title">{slide.title}</h2>
            <Motif />
          </header>
          <div className="pd-product-body">
            <div className="pd-product-left">
              <h3 className="pd-accent-heading">{slide.heading}</h3>
              <div className="pd-paras">
                {slide.paragraphs.map((x, i) => (
                  <p key={i}>{x}</p>
                ))}
              </div>
            </div>
            <Frame image={slide.image} placeholder={slide.placeholder} ratio="landscape" lang={lang} />
          </div>
        </section>
      );

    // ------------------------------------------------------- biểu đồ cột
    case "chart": {
      // Trục dọc: 5 vạch từ max về 0 (giống bản gốc 100/80/60/40/20/0).
      const ticks = [0, 1, 2, 3, 4, 5].map((i) => Math.round((slide.max / 5) * (5 - i)));
      return (
        <section className="pd-slide pd-chart">
          <header className="pd-head">
            <h2 className="pd-title">{slide.title}</h2>
            <Motif />
          </header>
          <div className="pd-chart-body">
            <figure className="pd-plot">
              <div className="pd-plot-grid">
                <div className="pd-ticks">
                  {ticks.map((v) => (
                    <span key={v}>
                      {v}
                      {slide.unit && v > 0 ? slide.unit : ""}
                    </span>
                  ))}
                </div>
                <div className="pd-bars">
                  {slide.bars.map((b, i) => (
                    <div className="pd-bar-slot" key={i}>
                      <div
                        className="pd-bar"
                        style={{ height: `${(b.value / slide.max) * 100}%` }}
                        title={`${b.value}${slide.unit ?? ""}`}
                      />
                    </div>
                  ))}
                </div>
                {/* ô rỗng dưới cột nhãn trục dọc, để nhãn trục ngang thẳng cột */}
                <span aria-hidden />
                <div className="pd-bar-labels">
                  {slide.bars.map((b, i) => (
                    <span key={i}>{b.label}</span>
                  ))}
                </div>
              </div>
            </figure>
            <div className="pd-chart-side">
              <h3 className="pd-accent-heading">{slide.heading}</h3>
              <p className="pd-card-body">{slide.body}</p>
              <div className="pd-legend">
                {slide.bars.map((b, i) => (
                  <div className="pd-legend-item" key={i}>
                    <Orb n={two(i)} size="sm" />
                    <span>{b.legend}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      );
    }

    // ----------------------------------------------------------- đội ngũ
    case "team":
      return (
        <section className="pd-slide pd-team">
          <header className="pd-head">
            <h2 className="pd-title">{slide.title}</h2>
            <Motif />
          </header>
          <div className="pd-team-grid">
            {slide.members.map((m, i) => (
              <article className="pd-member" key={i}>
                {m.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="pd-avatar zoomable" src={m.photo} alt={m.name} />
                ) : (
                  <span className="pd-avatar pd-avatar-empty" aria-hidden />
                )}
                <h3 className="pd-card-heading">{m.name}</h3>
                <p className="pd-member-role">{m.role}</p>
              </article>
            ))}
          </div>
          {slide.caption && <p className="pd-team-caption">{slide.caption}</p>}
        </section>
      );

    // ---------------------------------------------------------- lộ trình
    case "roadmap":
      return (
        <section className="pd-slide pd-roadmap">
          <header className="pd-head">
            <h2 className="pd-title">{slide.title}</h2>
            <Motif />
          </header>
          <div className="pd-track">
            <span className="pd-track-line" aria-hidden />
            {slide.milestones.map((m, i) => (
              <div className={`pd-stop ${i % 2 === 0 ? "pd-stop-up" : "pd-stop-down"}`} key={i}>
                {/* arm = phần chữ + cuống nối, nằm hẳn trên hoặc dưới đường kẻ;
                    orb luôn ở hàng giữa nên mọi mốc thẳng hàng trên đường. */}
                <div className="pd-stop-arm">
                  <div className="pd-stop-text">
                    <h3 className="pd-card-heading">{m.heading}</h3>
                    <p className="pd-card-body">{m.body}</p>
                  </div>
                  <span className="pd-stop-tick" aria-hidden />
                </div>
                <Orb n={m.tag} size="lg" />
              </div>
            ))}
          </div>
        </section>
      );

    // ------------------------------------------------------ nhóm mục tiêu
    case "audience":
      return (
        <section className="pd-slide pd-audience">
          <header className="pd-head">
            <h2 className="pd-title">{slide.title}</h2>
            <Motif />
          </header>
          {slide.lead && <p className="pd-lead pd-lead-wide">{slide.lead}</p>}
          <div className="pd-card-grid">
            {slide.cards.map((c, i) => (
              <article className="pd-card pd-card-bottom" key={i}>
                <h3 className="pd-card-heading">{c.heading}</h3>
                <p className="pd-card-body">{c.body}</p>
              </article>
            ))}
          </div>
        </section>
      );

    // ------------------------------------------------- câu lớn / transition
    case "statement":
      return (
        <section className={`pd-slide pd-statement ${slide.bare ? "pd-statement-bare" : ""}`}>
          {!slide.bare && <Motif />}
          <div className="pd-statement-body">
            {slide.kicker && <p className="pd-kicker">{slide.kicker}</p>}
            <h2 className="pd-statement-title">{slide.title}</h2>
            {slide.sub && <p className="pd-statement-sub">{slide.sub}</p>}
          </div>
        </section>
      );

    // ------------------------------------------------------ số rất lớn
    case "bignum":
      return (
        <section className="pd-slide pd-bignum-slide">
          <header className="pd-head">
            <h2 className="pd-title">{slide.title ?? ""}</h2>
            <Motif />
          </header>
          {slide.lead && <p className="pd-lead pd-lead-wide">{slide.lead}</p>}
          <div className={`pd-figures pd-figures-${slide.figures.length}`}>
            {slide.figures.map((f, i) => (
              <div className="pd-figure" key={i}>
                <span className="pd-figure-value">{f.value}</span>
                <span className="pd-figure-label">{f.label}</span>
                {f.note && <span className="pd-figure-note">{f.note}</span>}
              </div>
            ))}
          </div>
          {slide.footnote && <p className="pd-footnote">{slide.footnote}</p>}
        </section>
      );

    // ------------------------------------------------------ lưới 4 khối số
    case "stats":
      return (
        <section className="pd-slide pd-stats">
          <header className="pd-head">
            <h2 className="pd-title">{slide.title}</h2>
            <Motif />
          </header>
          {slide.lead && <p className="pd-lead pd-lead-wide">{slide.lead}</p>}
          <div className="pd-stat-grid">
            {slide.items.map((it, i) => (
              <div className="pd-stat" key={i}>
                <span className="pd-stat-value">{it.value}</span>
                <span className="pd-stat-label">{it.label}</span>
              </div>
            ))}
          </div>
          {slide.footnote && <p className="pd-footnote">{slide.footnote}</p>}
        </section>
      );

    // ------------------------------------------------------------- bảng
    case "table":
      return (
        <section className="pd-slide pd-table-slide">
          <header className="pd-head">
            <h2 className="pd-title">{slide.title}</h2>
            <Motif />
          </header>
          {slide.lead && <p className="pd-lead pd-lead-wide">{slide.lead}</p>}
          <div className="pd-table-wrap">
            <table className="pd-table">
              <thead>
                <tr>{slide.columns.map((c, i) => <th key={i}>{c}</th>)}</tr>
              </thead>
              <tbody>
                {slide.rows.map((r, i) => (
                  <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
          {slide.footnote && <p className="pd-footnote">{slide.footnote}</p>}
        </section>
      );

    // ------------------------------------------------------- hai cột đối nhau
    case "compare":
      return (
        <section className="pd-slide pd-compare">
          <header className="pd-head">
            <h2 className="pd-title">{slide.title}</h2>
            <Motif />
          </header>
          {slide.lead && <p className="pd-lead pd-lead-wide">{slide.lead}</p>}
          <div className="pd-compare-grid">
            {[slide.left, slide.right].map((col, i) => (
              <div className={`pd-compare-col ${i === 0 ? "pd-compare-a" : "pd-compare-b"}`} key={i}>
                <h3 className="pd-card-heading">{col.heading}</h3>
                <ul className="pd-compare-list">
                  {col.items.map((x, j) => <li key={j}>{x}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
      );

    // ---------------------------------------------------------- sơ đồ tổ chức
    case "orgchart":
      return (
        <section className="pd-slide pd-org">
          <header className="pd-head">
            <h2 className="pd-title">{slide.title}</h2>
            <Motif />
          </header>
          <div className="pd-org-body">
            <div className="pd-org-root">{slide.root}</div>
            <OrgConnector count={slide.branches.length} />
            <div className="pd-org-branches">
              {slide.branches.map((b, i) => (
                <div className={`pd-org-branch ${b.highlight ? "pd-org-hot" : ""}`} key={i}>
                  <h3 className="pd-org-name">{b.name}</h3>
                  {b.note && <p className="pd-org-note">{b.note}</p>}
                  <ul className="pd-org-units">
                    {b.units.map((u, j) => <li key={j}>{u}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          {slide.footnote && <p className="pd-footnote">{slide.footnote}</p>}
        </section>
      );

    // ----------------------------------------------------------- closed loop
    case "loop":
      return (
        <section className="pd-slide pd-loop">
          <header className="pd-head">
            <h2 className="pd-title">{slide.title}</h2>
            <Motif />
          </header>
          {slide.lead && <p className="pd-lead pd-lead-wide">{slide.lead}</p>}
          <div className="pd-loop-body">
            <LoopRing />
            {slide.center && <span className="pd-loop-center">{slide.center}</span>}
            {slide.nodes.map((n, i) => (
              <div className={`pd-loop-node pd-loop-n${i + 1}`} key={i}>
                <Orb n={String(i + 1)} size="md" />
                <div>
                  <h3 className="pd-loop-name">{n.name}</h3>
                  <p className="pd-loop-role">{n.role}</p>
                </div>
              </div>
            ))}
          </div>
          {slide.footnote && <p className="pd-footnote">{slide.footnote}</p>}
        </section>
      );

    // -------------------------------------------------------------- collage
    case "gallery":
      return (
        <section className="pd-slide pd-gallery">
          <header className="pd-head">
            <h2 className="pd-title">{slide.title}</h2>
            <Motif />
          </header>
          {slide.lead && <p className="pd-lead pd-lead-wide">{slide.lead}</p>}
          <div className="pd-photo-grid">
            {slide.photos.map((ph, i) => (
              <figure className="pd-photo" key={i}>
                {ph.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="pd-photo-img zoomable" src={ph.image} alt={ph.caption ?? ""} />
                ) : (
                  <span className="pd-photo-empty">{ph.caption ?? ui(lang).imageComingSoon}</span>
                )}
              </figure>
            ))}
          </div>
        </section>
      );

    // --------------------------------------------------------------- kết
    case "closing":
      return (
        <section className="pd-slide pd-closing">
          <Logo className="pd-logo-closing" />
          <h1 className="pd-closing-title">{slide.title}</h1>
          {slide.subtitle && <p className="pd-closing-sub">{slide.subtitle}</p>}
        </section>
      );
  }
}
