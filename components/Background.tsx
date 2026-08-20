export default function Background() {
  // Style Apero: nền tối + quầng sáng gradient (khai báo ở .bg trong globals.css).
  // Không dùng video; giữ component để Deck.tsx không phải đổi cấu trúc.
  return <div className="bg" aria-hidden />;
}
