// ===========================================================================
//  SLIDE MODEL
//  Đây là nơi bạn "làm slide". Thêm/sửa/xoá object trong mảng `deck` bên dưới.
//  Mỗi slide có 1 `kind` quyết định layout (xem các interface).
//
//  • Hình ảnh: nhiều slide có field `placeholder`, đây là KHUNG ẢNH TẠM, hiển
//    thị mô tả ảnh cần đặt. Khi có ảnh thật, đổi `placeholder` thành `image`
//    (đường dẫn file trong /public). Ví dụ: image: "/pitch/anh-cua-ban.png".
//  • Bài tập: slide kind "exercise" có `prompt`, học viên bấm nút để hiện
//    prompt và copy gửi cho AI.
// ===========================================================================

export interface CoverSlide {
  kind: "cover";
  eyebrow?: string;
  title: string;
  subtitle?: string;
  note?: string; // dòng nhấn nhỏ dưới subtitle (vd: tự học cùng AI)
  link?: { label: string; url: string }; // link mở bộ slide (hiện rõ cho học viên)
  footer?: string;
  chips?: string[]; // các "pill" thông tin (vd ngày, thời lượng)
  image?: string; // ảnh hero bên phải
  images?: string[]; // nhiều ảnh -> collage bên phải
  placeholder?: string; // mô tả ảnh hero (khi chưa có ảnh)
}

export interface SectionSlide {
  kind: "section";
  index?: string;
  title: string;
  subtitle?: string;
}

export interface BulletsSlide {
  kind: "bullets";
  eyebrow?: string;
  title: string;
  bullets: string[];
  note?: string;
  link?: { label: string; url: string }; // link ngoài (vd mở trang bài tập)
}

export interface StepItem {
  title: string;
  desc?: string;
  icon?: string; // slug logo công cụ liên quan (vd "github")
  link?: { label: string; url: string }; // link tải / mở
}
// Hướng dẫn chi tiết (mở trong popup, không phá luồng chính).
// Mỗi shot là 1 chỗ để gắn ảnh từng bước.
export interface DetailGuide {
  caption?: string;
  shots: { label: string; image?: string }[];
}
export interface StepsSlide {
  kind: "steps";
  eyebrow?: string;
  title: string;
  start?: number; // số bắt đầu (mặc định 1)
  steps: StepItem[];
  image?: string; // ảnh minh hoạ bên phải
  placeholder?: string; // mô tả ảnh cần đặt
  detail?: DetailGuide; // nút "Xem hướng dẫn chi tiết"
}

// Sơ đồ GitHub: Repo Local <-> Repo Cloud
export interface GitFlowSlide {
  kind: "gitflow";
  eyebrow?: string;
  title: string;
  subtitle?: string;
  local: { title: string; desc: string };
  cloud: { title: string; desc: string };
  pushLabel?: string;
  pullLabel?: string;
  analogy?: string;
  image?: string; // ảnh minh hoạ (vd ảnh chụp repo thật)
}

// Slide trưng bày công cụ, mỗi card có logo + mô tả
export interface ToolItem {
  name: string;
  icon?: string; // slug trong /public/icons (vd "claude"); thiếu -> badge chữ
  desc: string;
  url?: string; // link tải / mở
}
export interface ToolsSlide {
  kind: "tools";
  eyebrow?: string;
  title: string;
  tools: ToolItem[];
}

export interface StatsSlide {
  kind: "stats";
  eyebrow?: string;
  title: string;
  stats: { value: string; label: string; icon?: string }[]; // icon: emoji nhỏ (tùy chọn)
  logos?: { image: string; caption?: string }; // dải logo (vd các trường ĐH) dưới số liệu
}

export interface ColumnsSlide {
  kind: "columns";
  eyebrow?: string;
  title: string;
  columns: { heading: string; body: string; icon?: string }[];
}

export interface CompareSlide {
  kind: "compare";
  eyebrow?: string;
  title: string;
  highlight?: "left" | "right"; // bên nào được tô sáng (khuyên dùng)
  left: { heading: string; points: string[]; image?: string; placeholder?: string };
  right: { heading: string; points: string[]; image?: string; placeholder?: string };
}

// Slide ảnh toàn khung (placeholder cho tới khi có ảnh thật)
export interface ImageSlide {
  kind: "image";
  eyebrow?: string;
  title?: string;
  caption?: string;
  image?: string; // nếu có ảnh thật
  placeholder?: string; // mô tả ảnh cần đặt
}

// Chữ bên trái + ảnh bên phải
export interface SplitSlide {
  kind: "split";
  eyebrow?: string;
  title: string;
  body: string[];
  image?: string;
  placeholder?: string;
}

export interface QuoteSlide {
  kind: "quote";
  quote: string;
  author?: string;
}

// Lưới ảnh showcase (mỗi ô là 1 sản phẩm / ví dụ)
export interface GallerySlide {
  kind: "gallery";
  eyebrow?: string;
  title: string;
  subtitle?: string;
  items: { label: string; image?: string }[];
}

// Lưới tài nguyên: mỗi thẻ là 1 nguồn (thumbnail web + tên + mô tả + link bấm được)
export interface ResourcesSlide {
  kind: "resources";
  eyebrow?: string;
  title: string;
  subtitle?: string;
  items: {
    name: string;
    tag?: string; // nhãn nhỏ (vd "Người mới", "React")
    desc: string; // mô tả 1 dòng
    url: string; // mở tab mới khi bấm thẻ
    image?: string; // ảnh thumbnail trang web (/pitch/...)
  }[];
}

// Slide giới thiệu diễn giả (tiểu sử + sự nghiệp)
export interface ProfileSlide {
  kind: "profile";
  index?: string;
  title: string;
  name: string;
  email?: string;
  phone?: string;
  linkedin?: string; // URL
  discord?: string; // username
  avatar?: string; // ảnh chân dung (thiếu -> khung tạm)
  education: { title: string; org: string; logo?: string }[];
  careers: {
    role: string;
    org: string;
    note?: string; // ví dụ "Fortune Global 500"
    logo?: string;
    image?: string; // ảnh minh hoạ (thiếu -> khung tạm)
    points: string[];
  }[];
}

export interface ExerciseSlide {
  kind: "exercise";
  badge: string; // "Bài tập 1"
  title: string;
  brief: string[]; // đề bài / các bước
  prompt?: string; // prompt copy gửi AI (ẩn, bấm để hiện). Bỏ trống = không có prompt.
  onPageNote?: string; // callout: hướng dẫn nằm trên trang bài tập (thay cho ảnh)
  promptLabel?: string; // chữ trên nút mở (mặc định: "Xem lời giải, prompt gửi cho AI")
  promptTag?: string; // nhãn nhỏ trong hộp (mặc định: "Prompt, copy & gửi AI")
  success?: string; // điều kiện hoàn thành (hiển thị dạng "✅ Hoàn thành khi: …")
  tip?: string;
  link?: { label: string; url: string }; // link ngoài (vd mở Vercel)
  detail?: DetailGuide; // popup ảnh từng bước
  image?: string;
  placeholder?: string; // ảnh minh hoạ kết quả mong đợi
  // Phần nâng cao (không bắt buộc): nội dung mẫu để copy cho AI tái tạo
  advanced?: {
    title?: string;
    note: string;
    copyText: string;
    copyLabel?: string;
  };
}

export interface ClosingSlide {
  kind: "closing";
  title: string;
  subtitle?: string;
  note?: string; // gợi ý nhỏ dưới subtitle (vd: hết token thì đổi account)
  cta?: string;
}

// Quiz "hai thật một giả", game tương tác. Dùng 2 slide: 1 hỏi, 1 lộ đáp án.
export interface QuizSlide {
  kind: "quiz";
  eyebrow?: string;
  title: string;
  options: { label: string; body: string }[]; // A, B, C…
  lieIndex?: number; // index đáp án SAI (0-based)
  reveal?: boolean; // true = lộ đáp án (tô đúng/sai)
  caption?: string; // dòng dẫn dắt khi lộ đáp án
}

// Timeline dọc/ngang: mỗi mốc có thời gian + tiêu đề + mô tả + (ô ảnh chờ).
export interface TimelineSlide {
  kind: "timeline";
  eyebrow?: string;
  title: string;
  events: {
    time: string;
    heading: string;
    desc?: string;
    image?: string; // ảnh thật; thiếu -> khung ảnh chờ (nếu có placeholder)
    placeholder?: string; // mô tả ảnh cần đặt
  }[];
}

// Statement khổ lớn, 1 câu "đắt", tùy chọn ảnh minh hoạ bên phải.
export interface StatementSlide {
  kind: "statement";
  kicker?: string; // nhãn nhỏ phía trên
  title: string; // câu lớn (Clash Display)
  sub?: string; // dòng nhỏ dưới
  image?: string;
  placeholder?: string; // ảnh bên phải (tùy chọn)
}

// Lessons, thẻ bài học cao cấp: icon + số lớn mờ nền + heading + body.
export interface LessonsSlide {
  kind: "lessons";
  eyebrow?: string;
  title: string;
  items: { icon?: string; heading: string; body: string }[];
}

export type Slide =
  | CoverSlide
  | SectionSlide
  | BulletsSlide
  | StepsSlide
  | StatsSlide
  | ColumnsSlide
  | ToolsSlide
  | GitFlowSlide
  | CompareSlide
  | ImageSlide
  | SplitSlide
  | QuoteSlide
  | GallerySlide
  | ResourcesSlide
  | ProfileSlide
  | ExerciseSlide
  | ClosingSlide
  | QuizSlide
  | TimelineSlide
  | StatementSlide
  | LessonsSlide;

// ===========================================================================
//  I18N, song ngữ Việt / English
//  `t(vi, en)` gói 2 ngôn ngữ vào 1 chuỗi (giữ nguyên kiểu string cho slide).
//  Khi render, getDeck(lang) sẽ "resolve" mọi t(...) thành đúng ngôn ngữ.
//  Chuỗi nào để nguyên (không bọc t) sẽ hiển thị giống nhau ở cả 2 ngôn ngữ
//  (tên riêng, URL, các prompt vốn đã viết bằng tiếng Anh…).
// ===========================================================================
export type Lang = "vi" | "en";

export const t = (vi: string, en: string): string =>
  ({ vi, en } as unknown as string);

function isLoc(v: unknown): v is { vi: string; en: string } {
  return (
    !!v &&
    typeof v === "object" &&
    typeof (v as Record<string, unknown>).vi === "string" &&
    typeof (v as Record<string, unknown>).en === "string" &&
    Object.keys(v as object).length === 2
  );
}

function localize<T>(node: T, lang: Lang): T {
  if (isLoc(node)) return node[lang] as unknown as T;
  if (Array.isArray(node)) return node.map((n) => localize(n, lang)) as unknown as T;
  if (node && typeof node === "object") {
    const out: Record<string, unknown> = {};
    for (const k in node as Record<string, unknown>) {
      out[k] = localize((node as Record<string, unknown>)[k], lang);
    }
    return out as T;
  }
  return node;
}

export function getDeck(lang: Lang): Slide[] {
  return localize(deck, lang);
}


// ===========================================================================
//  DECK DEMO
//  Đây là bộ slide MẪU cho hệ layout "talk" (21 kind ở trên). Nội dung chỉ để
//  minh hoạ — xoá sạch và viết nội dung của bạn vào là dùng được.
//
//  Bộ pitch deck 11 slide của Apero nằm ở file khác: lib/pitch.ts.
//  Chuyển qua lại giữa hai bộ bằng ACTIVE_THEME trong lib/theme.ts.
// ===========================================================================

export const deck: Slide[] = [
  {
    kind: "cover",
    eyebrow: t("BỘ SLIDE MẪU", "SAMPLE DECK"),
    title: t("Tiêu đề bài nói của bạn", "Your talk title here"),
    subtitle: t(
      "Thay nội dung trong lib/deck.ts. Mỗi slide là một object, `kind` quyết định layout.",
      "Edit lib/deck.ts. Each slide is an object; its `kind` picks the layout.",
    ),
    chips: [t("Ngày trình bày", "Event date"), t("Thời lượng", "Duration")],
  },
  {
    kind: "section",
    index: "01",
    title: t("Phần thứ nhất", "Part one"),
    subtitle: t("Dùng kind \"section\" để ngăn các phần.", "Use kind \"section\" to split parts."),
  },
  {
    kind: "bullets",
    eyebrow: t("Ví dụ layout", "Layout example"),
    title: t("Danh sách gạch đầu dòng", "A bulleted list"),
    bullets: [
      t("Mỗi dòng là một phần tử trong mảng `bullets`.", "Each line is an item in the `bullets` array."),
      t("Bọc chuỗi bằng t(\"tiếng Việt\", \"English\") để có song ngữ.", "Wrap strings in t(\"vi\", \"en\") for bilingual text."),
      t("Chuỗi không bọc thì hiện giống nhau ở cả hai ngôn ngữ.", "Unwrapped strings show the same in both languages."),
    ],
    note: t("Nút 🌐 góc trên phải để đổi ngôn ngữ.", "Use the 🌐 button top-right to switch language."),
  },
  {
    kind: "steps",
    eyebrow: t("Ví dụ layout", "Layout example"),
    title: t("Các bước có đánh số", "Numbered steps"),
    steps: [
      { title: t("Bước một", "Step one"), desc: t("Mô tả ngắn cho bước này.", "A short description for this step.") },
      { title: t("Bước hai", "Step two"), desc: t("Thêm/bớt phần tử trong mảng `steps`.", "Add or remove items in the `steps` array.") },
      { title: t("Bước ba", "Step three"), desc: t("Mỗi bước có thể kèm link hoặc icon công cụ.", "Each step can carry a link or a tool icon.") },
    ],
  },
  {
    kind: "statement",
    kicker: t("Câu nhấn", "Statement"),
    title: t("Một câu ngắn, chữ lớn, chiếm cả slide.", "One short line, large type, filling the slide."),
    sub: t("Dùng kind \"statement\" khi cần nhấn một ý duy nhất.", "Use kind \"statement\" to land a single idea."),
  },
  {
    kind: "quote",
    quote: t(
      "Trích dẫn đặt ở đây. Ngắn thì đắt.",
      "Put a quote here. Shorter lands harder.",
    ),
    author: t("Tên người nói", "Attribution"),
  },
  {
    kind: "closing",
    title: t("Cảm ơn.", "Thank you."),
    subtitle: t("Thêm thông tin liên hệ hoặc lời kêu gọi hành động ở đây.", "Add contact details or a call to action here."),
  },
];
