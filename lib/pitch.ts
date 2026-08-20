// ===========================================================================
//  PITCH DECK APERO — MODEL & NỘI DUNG
//  Đây là nơi bạn "làm slide" cho bộ pitch. Thêm/sửa/xoá object trong mảng
//  `pitchDeck` bên dưới. Mỗi slide có 1 `kind` quyết định layout.
//
//  Cấu trúc bám đúng bản gốc "Material/Present Apero.pptx" (11 trang):
//    cover · numbers · story · cards · rows · product · chart · team
//    · roadmap · audience · closing
//
//  Song ngữ: bọc chuỗi bằng t("tiếng Việt", "English"). Chuỗi không bọc thì
//  hiện giống nhau ở cả 2 ngôn ngữ (tên riêng, số liệu, URL…).
// ===========================================================================

import { t, type Lang } from "./deck";

// --- Ảnh: đường dẫn trong /public. placeholder = khung ảnh tạm có mô tả. ---
type Img = { image?: string; placeholder?: string };

/** Trang bìa: logo + tiêu đề lớn. Nền là ảnh cả slide, khai báo ở
 *  .pd-cover trong pitch.css — không cần trường ảnh riêng. */
export interface PitchCover extends Img {
  kind: "cover";
  title: string;
  subtitle?: string;
  chips?: string[];
}

/** Tiêu đề 2 dòng (dòng 2 màu tím) + đoạn dẫn + danh sách đánh số bên phải. */
export interface PitchNumbers {
  kind: "numbers";
  titleTop: string;
  titleAccent: string;
  lead?: string;
  items: { text: string }[];
}

/** Tiêu đề 2 dòng + các đoạn văn + ảnh dọc trong khung bên phải. */
export interface PitchStory extends Img {
  kind: "story";
  titleTop: string;
  titleAccent?: string;
  paragraphs: string[];
}

/** 3 thẻ dọc: quả cầu số + tiêu đề cam + nội dung. */
export interface PitchCards {
  kind: "cards";
  title: string;
  lead?: string;
  cards: { heading: string; body: string }[];
}

/** 4 thẻ ngang (2×2): quả cầu số bên trái + tiêu đề cam + nội dung. */
export interface PitchRows {
  kind: "rows";
  title: string;
  rows: { heading: string; body: string }[];
}

/** Tiêu đề + heading cam + đoạn văn bên trái, ảnh ngang trong khung bên phải. */
export interface PitchProduct extends Img {
  kind: "product";
  title: string;
  heading: string;
  paragraphs: string[];
}

/** Biểu đồ cột + heading cam + đoạn văn + thẻ chú giải. */
export interface PitchChart {
  kind: "chart";
  title: string;
  heading: string;
  body: string;
  /** Trục dọc chạy từ 0 tới max. */
  max: number;
  unit?: string;
  bars: { label: string; value: number; legend: string }[];
}

/** Thẻ thành viên: ảnh tròn + tên cam + chức danh. */
export interface PitchTeam extends Object {
  kind: "team";
  title: string;
  members: { name: string; role: string; photo?: string }[];
  caption?: string;
  /** Ghi chú nội bộ, KHÔNG hiển thị — nhắc điểm cần approve. */
  note?: string;
}

/** Lộ trình ngang: các mốc trên 1 đường, nhãn xen kẽ trên/dưới. */
export interface PitchRoadmap {
  kind: "roadmap";
  title: string;
  milestones: { tag: string; heading: string; body: string }[];
}

/** Đoạn dẫn rộng + 3 thẻ. */
export interface PitchAudience {
  kind: "audience";
  title: string;
  lead?: string;
  cards: { heading: string; body: string }[];
}

/** Trang cuối: logo + lời cảm ơn. */
export interface PitchClosing {
  kind: "closing";
  title: string;
  subtitle?: string;
}

// ===========================================================================
//  LAYOUT THÊM — báo cáo, review, all-hands
// ===========================================================================

/** Một câu lớn chiếm cả slide. Dùng cho transition và câu chốt. */
export interface PitchStatement {
  kind: "statement";
  kicker?: string;      // nhãn nhỏ phía trên
  title: string;        // câu lớn
  sub?: string;         // dòng nhỏ dưới
  /** true = nền tối trơn, bỏ mọi hoạ tiết (dùng cho slide transition). */
  bare?: boolean;
}

/** 1–3 con số rất lớn kèm nhãn. Dùng cho doanh thu, mục tiêu. */
export interface PitchBigNum {
  kind: "bignum";
  title?: string;
  lead?: string;
  figures: { value: string; label: string; note?: string }[];
  footnote?: string;
}

/** 4 khối số nhỏ hơn, xếp lưới. Dùng cho chỉ số nhân sự. */
export interface PitchStats {
  kind: "stats";
  title: string;
  lead?: string;
  items: { value: string; label: string }[];
  footnote?: string;
}

/** Bảng đơn giản. */
export interface PitchTable {
  kind: "table";
  title: string;
  lead?: string;
  columns: string[];
  rows: string[][];
  footnote?: string;
}

/** Hai cột đối nhau. Dùng cho so sánh / "làm gì – không làm gì". */
export interface PitchCompare {
  kind: "compare";
  title: string;
  lead?: string;
  left: { heading: string; items: string[] };
  right: { heading: string; items: string[] };
}

/** Sơ đồ tổ chức: các nhánh, mỗi nhánh vài đơn vị. */
export interface PitchOrgChart {
  kind: "orgchart";
  title: string;
  root: string;
  branches: { name: string; note?: string; units: string[]; highlight?: boolean }[];
  footnote?: string;
}

/** Vòng khép kín: các mắt xích nối nhau thành chu trình. */
export interface PitchLoop {
  kind: "loop";
  title: string;
  lead?: string;
  nodes: { name: string; role: string }[];
  center?: string;
  footnote?: string;
}

/** Lưới ảnh (photo collage). Ảnh chưa có thì hiện khung mô tả. */
export interface PitchGallery {
  kind: "gallery";
  title: string;
  lead?: string;
  photos: { image?: string; caption?: string }[];
}

export type PitchSlide =
  | PitchCover
  | PitchNumbers
  | PitchStory
  | PitchCards
  | PitchRows
  | PitchProduct
  | PitchChart
  | PitchTeam
  | PitchRoadmap
  | PitchAudience
  | PitchClosing
  | PitchStatement
  | PitchBigNum
  | PitchStats
  | PitchTable
  | PitchCompare
  | PitchOrgChart
  | PitchLoop
  | PitchGallery;

// ===========================================================================
//  NỘI DUNG
//  Số liệu CHỈ dùng loại đã được phép public (nguồn: Apero - Memory/brand-apero.md):
//    1B+ downloads (2025) · ~1.5B+ / 6 năm · 130M+ MAU · 150+ quốc gia
//    Top 20 Google Play Non-Game · Top 3 ĐNA · 300+ sản phẩm
//  KHÔNG đưa doanh thu / số liệu kinh doanh nội bộ vào đây.
// ===========================================================================

export const pitchDeck: PitchSlide[] = [
  // ---------------------------------------------------------------- 01 bìa
  {
    kind: "cover",
    title: "Pitch Deck",
    subtitle: t(
      "Apero Technologies Group — sản phẩm công nghệ cho hàng tỷ người dùng.",
      "Apero Technologies Group — tech products for billions of users.",
    ),
    chips: ["Creations for Billions", "Build global, from Vietnam"],
  },

  // ------------------------------------------------- 02 vì sao chọn Apero
  {
    kind: "numbers",
    titleTop: t("Vì sao", "Why"),
    titleAccent: "Apero",
    lead: t(
      "Chúng tôi tự làm sản phẩm và tự đưa ra thị trường toàn cầu — không outsourcing. " +
        "Sáu năm, hơn 300 sản phẩm, và một cỗ máy phân phối đã được kiểm chứng.",
      "We build our own products and take them global ourselves — no outsourcing. " +
        "Six years, 300+ products, and a distribution engine that has been proven.",
    ),
    items: [
      { text: t("1B+ lượt tải trong năm 2025, ~1.5B+ tính trong 6 năm", "1B+ downloads in 2025, ~1.5B+ over six years") },
      { text: t("130M+ người dùng hoạt động hàng tháng, 150+ quốc gia", "130M+ monthly active users across 150+ countries") },
      { text: t("Top 20 Google Play Non-Game toàn cầu, Top 3 Đông Nam Á", "Top 20 Google Play Non-Game globally, Top 3 in Southeast Asia") },
      { text: t("Từ ý tưởng tới lên store: 3–4 tuần", "Idea to store launch: 3–4 weeks") },
    ],
  },

  // ------------------------------------------------------ 03 câu chuyện
  {
    kind: "story",
    titleTop: t("Chúng tôi", "Who we"),
    titleAccent: t("là ai", "are"),
    paragraphs: [
      t(
        "Apero Technologies Group đầu tư và phát triển Mobile App, Game và AI App cho thị trường " +
          "toàn cầu. Thành lập tháng 6 năm 2020 tại Hà Nội, chúng tôi là một startup product: " +
          "tự làm sản phẩm, tự đưa ra thế giới.",
        "Apero Technologies Group invests in and builds mobile apps, games and AI apps for the " +
          "global market. Founded in June 2020 in Hanoi, we are a product startup: we build our " +
          "own products and take them worldwide ourselves.",
      ),
      t(
        "Từ 15 triệu lượt tải năm đầu tiên, đến hơn 1 tỷ lượt tải và 130 triệu người dùng hoạt " +
          "động hàng tháng vào năm 2025. Người Việt làm thứ cả thế giới dùng.",
        "From 15 million downloads in the first year to over 1 billion downloads and 130 million " +
          "monthly active users by 2025. Vietnamese people building what the world uses.",
      ),
    ],
    image: "/pitch/img-portrait.jpg",
  },

  // ---------------------------------------------------------- 04 vấn đề
  {
    kind: "cards",
    title: "Problems",
    cards: [
      {
        heading: t("Chi phí AI quá cao", "AI costs too much"),
        body: t(
          "Sinh một ảnh bằng API sẵn có tốn khoảng 0.03 USD. Ở quy mô hàng trăm triệu người " +
            "dùng, con số đó khiến sản phẩm không thể có lãi.",
          "Generating one image through off-the-shelf APIs costs around USD 0.03. At a scale of " +
            "hundreds of millions of users, that makes a product impossible to run profitably.",
        ),
      },
      {
        heading: t("Sản phẩm chờ quá lâu", "Products ship too slowly"),
        body: t(
          "Chu kỳ 6–12 tháng mới ra được một sản phẩm là quá chậm cho thị trường AI, nơi nhu " +
            "cầu người dùng đổi theo từng quý.",
          "A 6–12 month cycle to ship one product is far too slow for the AI market, where user " +
            "demand shifts every quarter.",
        ),
      },
      {
        heading: t("Làm được nhưng không tới tay ai", "Built, but never distributed"),
        body: t(
          "Phần lớn sản phẩm tốt chết vì không có năng lực phân phối ở nhiều thị trường cùng lúc. " +
            "Sản phẩm tốt mà không ai biết thì vô nghĩa.",
          "Most good products die for lack of distribution across many markets at once. A good " +
            "product nobody knows about is meaningless.",
        ),
      },
    ],
  },

  // -------------------------------------------------------- 05 giải pháp
  {
    kind: "rows",
    title: "Solutions",
    rows: [
      {
        heading: t("Làm chủ công nghệ lõi", "Own the core technology"),
        body: t(
          "AI Lab riêng, tự tối ưu thay vì chỉ gọi API: chi phí sinh ảnh ~0.006 USD, rẻ hơn 5–8 lần.",
          "Our own AI Lab, optimising in-house instead of just calling APIs: ~USD 0.006 per image, 5–8× cheaper.",
        ),
      },
      {
        heading: t("Tối ưu tới từng giây", "Optimise down to the second"),
        body: t(
          "Thời gian render ảnh rút từ 60–90 giây xuống còn khoảng 6 giây.",
          "Image render time cut from 60–90 seconds down to about 6 seconds.",
        ),
      },
      {
        heading: t("Nhà máy sản phẩm", "A product factory"),
        body: t(
          "300+ sản phẩm đã ra thị trường. Ý tưởng tới launch 3–4 tuần: fail fast, kill fast.",
          "300+ products shipped. Idea to launch in 3–4 weeks: fail fast, kill fast.",
        ),
      },
      {
        heading: t("Cỗ máy phân phối", "A distribution engine"),
        body: t(
          "Chạy UA trên Meta, Google UAC, Apple Search Ads ở hàng chục thị trường, đọc ROAS và LTV theo từng geo.",
          "Running UA across Meta, Google UAC and Apple Search Ads in dozens of markets, reading ROAS and LTV per geo.",
        ),
      },
    ],
  },

  // -------------------------------------------------------- 06 sản phẩm
  {
    kind: "product",
    title: "Our Product",
    heading: "Artimind · ReelMe · Genius",
    paragraphs: [
      t(
        "Artimind là sản phẩm AI Photo & Video của VisionLab. ReelMe là sản phẩm video ngắn. " +
          "Genius là AI Art Photo Editor, nằm trong Top 10 ứng dụng AI được tải nhiều nhất thế giới.",
        "Artimind is VisionLab's AI photo and video product. ReelMe is our short-video product. " +
          "Genius is an AI art photo editor, ranked in the world's top 10 most-downloaded AI apps.",
      ),
      t(
        "Cả ba đều chạy trên hạ tầng AI do chính chúng tôi tối ưu — cùng phần lõi đã đưa chi phí " +
          "sinh ảnh xuống mức mà sản phẩm quy mô lớn có thể có lãi.",
        "All three run on AI infrastructure we optimised ourselves — the same core that brought " +
          "image generation cost down to a level where products at scale can be profitable.",
      ),
    ],
    image: "/pitch/img-chip.jpg",
  },

  // ------------------------------------------------------------ 07 số liệu
  {
    kind: "chart",
    title: "Data",
    heading: t("Sáu năm tăng trưởng", "Six years of growth"),
    body: t(
      "Lượt tải tích lũy theo từng mốc, đơn vị triệu. Từ 15 triệu lượt tải cuối năm 2020 lên " +
        "hơn 1 tỷ trong năm 2025 — và đang tiến tới 2 tỷ.",
      "Cumulative downloads by milestone, in millions. From 15 million at the end of 2020 to over " +
        "1 billion in 2025 — and heading towards 2 billion.",
    ),
    max: 1000,
    unit: "M",
    bars: [
      { label: "2020", value: 15, legend: t("15M lượt tải, 3M+ MAU", "15M downloads, 3M+ MAU") },
      { label: "2022", value: 300, legend: t("300M+ lượt tải, Top 20 Global", "300M+ downloads, Top 20 global") },
      { label: "2024", value: 650, legend: t("650M+ lượt tải, 60M+ MAU", "650M+ downloads, 60M+ MAU") },
      { label: "2025", value: 1000, legend: t("1B+ lượt tải, 130M+ MAU", "1B+ downloads, 130M+ MAU") },
    ],
  },

  // -------------------------------------------------------------- 08 đội ngũ
  {
    kind: "team",
    title: "The team",
    // ⚠️ CHƯA ĐIỀN TÊN: theo luật nội bộ, không nhắc tên founder trong bản PR
    // công khai khi chưa có approve, và "ai được lên bài" vẫn chưa chốt.
    note: "Cần người phụ trách truyền thông approve tên + ảnh trước khi điền vào 3 thẻ này.",
    members: [
      { name: t("[Chờ approve]", "[Pending approval]"), role: "Founder & CEO" },
      { name: t("[Chờ approve]", "[Pending approval]"), role: "Co-Founder & COO" },
      { name: t("[Chờ approve]", "[Pending approval]"), role: "Group CTO" },
    ],
    caption: t(
      "10+ cựu nhân sự Apero hiện là CxO tại các công ty Top 50 trong ngành.",
      "10+ Apero alumni are now CxOs at top-50 companies in the industry.",
    ),
  },

  // ------------------------------------------------------------- 09 lộ trình
  {
    kind: "roadmap",
    title: "Roadmap",
    milestones: [
      {
        tag: "2020",
        heading: t("Khởi đầu", "Founded"),
        body: t("Thành lập tháng 6. Cuối năm đạt 15M lượt tải và 3M+ MAU.", "Founded in June. 15M downloads and 3M+ MAU by year end."),
      },
      {
        tag: "2022",
        heading: t("Ra toàn cầu", "Going global"),
        body: t("300M+ lượt tải. Top 20 Google Play Non-Game, Top 3 Đông Nam Á.", "300M+ downloads. Top 20 Google Play Non-Game, Top 3 Southeast Asia."),
      },
      {
        tag: "2025",
        heading: t("Làm chủ AI", "Owning AI"),
        body: t("Lập AI Lab. Vượt 1B lượt tải và 130M+ MAU.", "AI Lab established. Past 1B downloads and 130M+ MAU."),
      },
      {
        tag: "2026",
        heading: t("Chuyển sang subscription", "Shift to subscription"),
        body: t("Trọng tâm sang sản phẩm chất lượng và doanh thu subscription.", "Focus shifts to quality products and subscription revenue."),
      },
    ],
  },

  // --------------------------------------------------------- 10 nhóm mục tiêu
  {
    kind: "audience",
    title: "Target Audience",
    lead: t(
      "Sản phẩm của chúng tôi phục vụ người dùng phổ thông ở các thị trường phát triển — nơi họ " +
        "sẵn sàng trả tiền cho công cụ giúp họ tạo ra thứ gì đó.",
      "Our products serve mainstream users in developed markets — people willing to pay for tools " +
        "that help them create something.",
    ),
    cards: [
      {
        heading: t("Người sáng tạo nội dung", "Content creators"),
        body: t("Cần công cụ AI tạo ảnh và video nhanh, chất lượng đủ dùng, giá phải chăng.", "Need fast AI photo and video tools, good enough quality, at an affordable price."),
      },
      {
        heading: t("Người dùng phổ thông", "Everyday users"),
        body: t("Muốn làm được thứ trước đây phải nhờ chuyên gia, ngay trên điện thoại.", "Want to make things that used to require a professional, right on their phone."),
      },
      {
        heading: t("Người học và làm việc", "Learners and workers"),
        body: t("Cần công cụ tài liệu, dịch thuật và trợ lý AI dùng được hằng ngày.", "Need document, translation and AI assistant tools they can use every day."),
      },
    ],
  },

  // -------------------------------------------------------------- 11 kết
  // ═══════════════════════════════════════════════════════════════════════
  //  DEMO 8 LAYOUT THÊM
  //  Phần này chỉ để cho thấy 8 layout còn lại trông thế nào. Xoá cả khối
  //  nếu bạn không cần — bộ pitch 11 slide phía trên vẫn chạy bình thường.
  //  Nội dung ở đây là trung tính, thay bằng nội dung của bạn.
  // ═══════════════════════════════════════════════════════════════════════
  {
    kind: "statement",
    title: "Còn 8 layout nữa cho báo cáo và review.",
    sub: "Các slide sau minh hoạ từng layout. Xem interface trong lib/pitch.ts.",
    bare: true,
  },
  {
    kind: "bignum",
    title: "bignum — số rất lớn",
    lead: "Một tới ba con số chiếm cả slide. Dùng cho doanh thu, tăng trưởng, mục tiêu.",
    figures: [
      { value: "1B+", label: "lượt tải", note: "trong năm 2025" },
      { value: "130M+", label: "người dùng hoạt động hàng tháng", note: "trên 150+ quốc gia" },
      { value: "300+", label: "sản phẩm đã ra thị trường", note: "trong 6 năm" },
    ],
    footnote: "Trường footnote hiện ở đáy slide, dùng cho nguồn số liệu hoặc ghi chú.",
  },
  {
    kind: "stats",
    title: "stats — lưới bốn khối số",
    lead: "Nhỏ hơn bignum, dùng khi cần trưng nhiều chỉ số cùng lúc.",
    items: [
      { value: "Top 20", label: "Google Play Non-Game toàn cầu" },
      { value: "Top 3", label: "Đông Nam Á" },
      { value: "150+", label: "quốc gia có người dùng" },
      { value: "6", label: "năm hoạt động" },
    ],
  },
  {
    kind: "table",
    title: "table — bảng",
    lead: "Bảng đơn giản, tự động kẻ dòng chẵn/lẻ. Cột đầu in đậm.",
    columns: ["Hạng mục", "Chỉ tiêu", "Thực hiện", "Ghi chú"],
    rows: [
      ["Hạng mục thứ nhất", "100", "112", "Vượt chỉ tiêu"],
      ["Hạng mục thứ hai", "100", "96", "Gần đạt"],
      ["Hạng mục thứ ba", "100", "104", "Đạt"],
    ],
    footnote: "Giữ bảng tối đa 5–6 dòng. Dài hơn thì tách thành hai slide.",
  },
  {
    kind: "compare",
    title: "compare — hai cột đối nhau",
    lead: "Dùng khi cần đặt hai thứ cạnh nhau: trước/sau, làm/không làm, ta/thị trường.",
    left: {
      heading: "Cột bên trái",
      items: ["Ý thứ nhất", "Ý thứ hai", "Ý thứ ba"],
    },
    right: {
      heading: "Cột bên phải",
      items: ["Ý đối lại thứ nhất", "Ý đối lại thứ hai"],
    },
  },
  {
    kind: "orgchart",
    title: "orgchart — sơ đồ tổ chức",
    root: "Tên tổ chức",
    branches: [
      { name: "Nhánh một", note: "Mô tả ngắn về nhánh", units: ["Đơn vị A", "Đơn vị B", "Đơn vị C"] },
      { name: "Nhánh hai", note: "Mô tả ngắn về nhánh", units: ["Đơn vị D", "Đơn vị E"] },
      { name: "Nhánh ba", note: "Đặt highlight: true để làm nổi", units: ["Đơn vị F"], highlight: true },
    ],
    footnote: "Ba nhánh là vừa khung. Nhiều hơn thì chữ bị nhỏ.",
  },
  {
    kind: "loop",
    title: "loop — vòng khép kín",
    lead: "Ba mắt xích nối nhau thành chu trình, có mũi tên chỉ chiều.",
    nodes: [
      { name: "Mắt xích một", role: "Vai trò của mắt xích này trong vòng" },
      { name: "Mắt xích hai", role: "Vai trò của mắt xích này trong vòng" },
      { name: "Mắt xích ba", role: "Vai trò của mắt xích này trong vòng" },
    ],
    center: "Chữ ở giữa vòng — dùng để nói vòng lặp này tạo ra giá trị gì.",
  },
  {
    kind: "gallery",
    title: "gallery — lưới ảnh",
    lead: "Tám ô ảnh xếp 4×2. Chưa có ảnh thì hiện khung mô tả như dưới đây.",
    photos: [
      { caption: "Ảnh 1" }, { caption: "Ảnh 2" }, { caption: "Ảnh 3" }, { caption: "Ảnh 4" },
      { caption: "Ảnh 5" }, { caption: "Ảnh 6" }, { caption: "Ảnh 7" }, { caption: "Ảnh 8" },
    ],
  },

  {
    kind: "closing",
    title: "Thank You!",
    subtitle: "Creations for Billions",
  },
];

/** Trả về bộ slide đã chọn ngôn ngữ. */
export function getPitchDeck(lang: Lang): PitchSlide[] {
  return localize(pitchDeck, lang);
}

// localize dùng chung cơ chế t() của deck.ts (xem chú thích ở đó).
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
