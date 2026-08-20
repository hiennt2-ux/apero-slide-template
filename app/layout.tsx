import type { Metadata } from "next";
import "./globals.css";
// Font: Clash Display (tiêu đề) + Montserrat (nội dung).
// Khai báo @font-face trong globals.css, file .ttf/.otf nằm ở /public/fonts.

// TODO: thêm /public/og.png (1200×630) rồi bỏ comment phần images bên dưới
// để link có ảnh preview khi chia sẻ.
const SITE_URL = "https://apero-pitch.vercel.app";
const SITE_TITLE = "Apero Pitch Deck · Creations for Billions";
const SITE_DESC =
  "Apero Technologies Group — sản phẩm công nghệ cho hàng tỷ người dùng. 1B+ lượt tải, 130M+ MAU, 150+ quốc gia.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESC,
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_TITLE,
    title: SITE_TITLE,
    description: SITE_DESC,
    locale: "vi_VN",
    // images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
    // images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
