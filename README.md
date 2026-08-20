# Apero Slide Template

Bộ slide thuyết trình **chạy trên web** (Next.js + React) thay cho PowerPoint. Clone về, sửa
nội dung trong một file, là có bộ slide của bạn — không phải canh lại thiết kế.

Giao diện theo **Apero Brand Guideline 4.0**: tím `#4E018F`, cam `#F07D33`, tiêu đề font Clash,
nội dung Montserrat. Có sẵn **11 layout pitch deck** và **21 layout cho bài nói / workshop**.

Song ngữ Việt – English sẵn trong máy: một nút bấm là đổi toàn bộ slide.

---

## Chạy trong 30 giây

```bash
git clone <URL-repo-này>
cd apero-slide-template
npm install
npm run dev          # mở http://localhost:3000
```

Khi trình bày: `←` `→` chuyển slide · `F` toàn màn hình · nút 🌐 góc trên phải đổi ngôn ngữ.
Bấm vào ảnh để phóng to.

Build bản chạy thật:

```bash
npm run build && npm start
```

---

## Sửa nội dung — chỉ cần mở 1 file

| Bạn muốn làm gì | Mở file nào |
|---|---|
| **Sửa nội dung pitch deck** (11 slide) | `lib/pitch.ts` — mảng `pitchDeck` |
| Sửa nội dung bài nói / workshop | `lib/deck.ts` — mảng `deck` |
| Đổi màu, đổi font | `app/theme.css` |
| Đổi tiêu đề trang, ảnh preview khi share link | `app/layout.tsx` |
| Thêm ảnh của bạn | bỏ file vào `public/`, rồi trỏ `image: "/ten-file.jpg"` |

Mỗi slide là **một object trong mảng**. Trường `kind` quyết định layout:

```ts
{
  kind: "cards",                    // ← layout: 3 thẻ dọc
  title: "Problems",
  cards: [
    { heading: "Vấn đề thứ nhất", body: "Mô tả ngắn." },
    { heading: "Vấn đề thứ hai",  body: "Mô tả ngắn." },
    { heading: "Vấn đề thứ ba",   body: "Mô tả ngắn." },
  ],
}
```

Thêm slide = thêm object. Bớt slide = xoá object. Đổi thứ tự = kéo object lên xuống.
TypeScript sẽ báo ngay nếu bạn thiếu trường bắt buộc, nên khó làm sai.

### Song ngữ

Bọc chuỗi bằng `t("tiếng Việt", "English")`:

```ts
title: t("Vì sao chọn chúng tôi", "Why choose us"),
```

Chuỗi **không** bọc thì hiện giống nhau ở cả hai ngôn ngữ — dùng cho tên riêng, số liệu, URL.

### Ảnh

Slide nào có ảnh thì nhận một trong hai trường:

```ts
image: "/pitch/anh-cua-ban.jpg",        // ảnh thật
placeholder: "Ảnh sản phẩm, chụp ngang", // khung tạm, hiện mô tả cho tới khi có ảnh
```

---

## 11 layout của pitch deck

| `kind` | Layout |
|---|---|
| `cover` | Logo + tiêu đề lớn, nền là ảnh cả slide |
| `numbers` | Tiêu đề 2 dòng + danh sách đánh số, nền vòng cung phát sáng |
| `story` | Tiêu đề 2 dòng + đoạn văn + ảnh dọc trong khung |
| `cards` | 3 thẻ dọc, mỗi thẻ có quả cầu số |
| `rows` | 4 thẻ ngang xếp 2×2 |
| `product` | Heading nhấn + đoạn văn + ảnh ngang trong khung |
| `chart` | Biểu đồ cột + chú giải (tự vẽ từ số bạn nhập, không cần ảnh) |
| `team` | 3 thẻ thành viên: ảnh tròn + tên + chức danh |
| `roadmap` | Lộ trình ngang, nhãn xen kẽ trên/dưới đường kẻ |
| `audience` | Đoạn dẫn rộng + 3 thẻ |
| `closing` | Logo + lời cảm ơn |

Bộ layout thứ hai (cho bài nói, workshop, bài giảng) có thêm 21 `kind`: `section` `bullets`
`steps` `stats` `columns` `tools` `gitflow` `compare` `image` `split` `quote` `gallery`
`resources` `profile` `exercise` `quiz` `timeline` `statement` `lessons`… Xem interface trong
`lib/deck.ts`.

---

## Đổi theme — sửa 1 dòng

`lib/theme.ts`:

```ts
export const ACTIVE_THEME: ThemeName = "brand";   // "brand" | "pitch" | "apero"
```

| Theme | Màu | Bộ slide |
|---|---|---|
| **`brand`** | Đúng Brand Guideline 4.0 — tím `#4E018F` + cam `#F07D33`, tiêu đề Clash | 11 slide pitch |
| `pitch` | Biến thể tím `#AA61FF` + cam đất `#E08245`, tiêu đề Be Vietnam Pro | 11 slide pitch |
| `apero` | Tím `#7C3AED` + cam `#E8661A` | Bộ layout bài nói |

**Tất cả màu nằm trong `app/theme.css`.** Các file CSS khác chỉ mô tả bố cục, không chứa mã màu
— nên đổi theme không bao giờ phải sửa layout. Muốn theme của riêng bạn: copy một block
`.theme-*`, đổi giá trị, thêm tên vào `ThemeName`.

Màu khai báo dạng kênh RGB (`170 97 255`) thay vì hex, để dùng được với mọi độ trong suốt:

```css
--c-accent: 170 97 255;
/* dùng: */ rgb(var(--c-accent) / 0.3)
```

---

## Font và tiếng Việt

| Vai trò | Font | Ghi chú |
|---|---|---|
| Tiêu đề | **Clash Display** | Font Brand Guideline chỉ định. Đủ 69/69 ký tự dấu tiếng Việt. |
| Nội dung | **Montserrat** | Có subset `vietnamese`. |
| Tiêu đề (theme `pitch`) | **Be Vietnam Pro** | Dùng khi cần dáng chữ gần Poppins. |

⚠️ **Nếu bạn định thay font, kiểm tra dấu tiếng Việt trước.** Nhiều font hình học phổ biến
(ví dụ **Poppins**) **không có** subset `vietnamese` — thiếu dải `U+1EA0–1EF1`, nên các chữ
`ạ ả ấ ầ ậ ắ ế ệ ộ ớ ợ ứ ự` bị nhảy sang font khác **ngay giữa một từ**. Lỗi này không lộ ra
nếu nội dung mẫu là tiếng Anh.

Cách kiểm tra nhanh một font trên Google Fonts:

```bash
curl -s "https://fonts.googleapis.com/css2?family=TEN+FONT:wght@400" \
  -H "User-Agent: Mozilla/5.0 ... Chrome/120 ..." | grep -E '^/\*'
```

Có dòng `/* vietnamese */` thì mới dùng được cho tiếng Việt.

---

## Ba ảnh nền

Ba slide có nền riêng là **ảnh**, không phải gradient CSS — nên khớp đúng bản thiết kế gốc:

| Slide | Ảnh | Khai báo ở |
|---|---|---|
| 1 (bìa) | `bg-cover.jpg` — nửa trái tím trơn để đặt chữ, nửa phải khối kính | `.pd-cover` |
| 2 (`numbers`) | `bg-arc.jpg` — vòng cung phát sáng | `.pd-numbers` |
| 3 trở đi | `bg-content.jpg` — nền dùng chung, quầng tím trên + cam dưới | `.theme-*  .bg` |

⚠️ Ba ảnh này **màu cố định**, không đổi theo theme. Đổi `ACTIVE_THEME` thì nền giữ nguyên,
chỉ chữ và số đổi màu. Đây là đánh đổi có ý thức: khớp bản mẫu 100% thay vì vẽ bằng token màu.

Thay ảnh của bạn: ghi đè file trong `public/pitch/` (giữ nguyên tên), hoặc sửa đường dẫn trong
`app/pitch.css`.

## Slide tràn màn hình

Trang bìa và trang `numbers` chiếm **trọn màn hình**, không có lề. Các trang còn lại nằm trong
khung tỉ lệ 16:9.

Lý do: hai slide đó **tự vẽ nền riêng**. Nếu bó chúng trong khung 16:9 thì nền riêng chỉ phủ
trong khung, quanh khung là nền chung khác màu → nhìn thành "một tấm ảnh dán lên nền". Các slide
khác dùng nền chung nên nằm trong khung vẫn liền mạch, và giữ khung giúp không bị méo tỉ lệ ở
màn hình không phải 16:9.

Bật/tắt cho slide nào: sửa `FULL_BLEED_KINDS` trong `components/Deck.tsx`.

---

## Cấu trúc thư mục

```
app/
  layout.tsx     tiêu đề trang, mô tả, ảnh OG khi share link
  theme.css      ★ TOÀN BỘ màu + khai báo font
  pitch.css      bố cục 11 layout pitch (không chứa màu)
  globals.css    bố cục các layout còn lại (không chứa màu)
components/
  Deck.tsx       điều hướng, đổi ngôn ngữ, phóng to ảnh, preload ảnh
  PitchSlide.tsx render 11 layout pitch
  Slide.tsx      render các layout bài nói
lib/
  pitch.ts       ★ NỘI DUNG pitch deck
  deck.ts        ★ NỘI DUNG bài nói + định nghĩa layout
  theme.ts       ★ chọn theme
  i18n.ts        nhãn cố định trên khung trình chiếu (nút, tooltip)
public/
  pitch/         ảnh nền, logo, motif
  fonts/         font (tách theo subset để chỉ tải phần cần dùng)
  icons/         logo các công cụ (dùng cho layout `tools`)
```

---

## Yêu cầu

Node.js 18 trở lên. Không cần cài gì khác.

## Giấy phép

Mã nguồn: MIT — xem [LICENSE](LICENSE).

**Lưu ý riêng về asset trong `public/pitch/`:**

| File | Giấy phép |
|---|---|
| `apero-logo.png`, `bg-cover.jpg`, `bg-arc.jpg`, `bg-content.jpg`, `motif-orbs.png` | Tài sản thương hiệu Apero Technologies Group — **không** thuộc MIT. Dùng cho tổ chức khác thì thay bằng asset của bạn. |
| `img-chip.jpg`, `img-portrait.jpg` | Đồ hoạ trừu tượng sinh từ SVG theo bảng màu brand — **thuộc MIT**, dùng/sửa/thay tự do. |

Font đi kèm giữ giấy phép gốc: Clash Display (ITF Free Font License), Montserrat và
Be Vietnam Pro (SIL Open Font License 1.1).
