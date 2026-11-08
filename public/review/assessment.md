# Bản sửa và kết quả kiểm tra

Giữ nguyên toàn bộ nội dung của sáu slide nguồn, ngoại trừ thêm action dẫn về trang so sánh vào closing. Ba thẻ dài chuyển thành ba trang; bảng tám hàng chuyển thành hai trang, lặp header. Tổng cộng chín trang.

## Thay đổi

- Bìa dài dùng cỡ tiêu đề 7,5cqh, cân dòng, giữ logo và mô tả trong vùng nhìn thấy. Không xóa hay rút gọn tiêu đề.
- Thẻ dài dùng layout chi tiết và chữ 3,1cqh / weight 400, khoảng 28,8px tại 1920×1080.
- Bảng tối đa bốn hàng/trang; toàn bộ 8 hàng và 4 tiêu đề cột giữ nguyên theo thứ tự.
- Roadmap: số 01–04 trong orb; nhãn TUẦN tách riêng.
- Statement giữ ký tự xuống dòng. Ảnh trước vốn tự wrap tương tự nên trang này ít khác về hình thức.
- Closing cân dòng và thêm nút Xem bản so sánh dẫn tới /review/compare.html.

## Xác minh

- 3/3 kiểm tra dữ liệu đạt: toàn bộ copy giống bản trước; thẻ/hàng không mất hoặc đổi thứ tự; trường hợp thẻ ngắn giữ layout.
- TypeScript đạt. Build production đạt trên Node 26.5.0 sau khi có lần lỗi Next.js metadata prerender ở /_not-found. Chưa xác định nguyên nhân lỗi không ổn định; không khẳng định lỗi do phiên bản Node. .nvmrc chọn Node 24 và tests cần Node 24+.
- Đã xem 9 ảnh tại 1920×1080. Kiểm tra vùng chữ và ảnh trên 9/9 trang ở cả 1920×1080 và 1440×900: không phát hiện chữ bị cắt hoặc ảnh hỏng. Đây không phải chứng nhận toàn bộ khả năng tiếp cận hay mọi nội dung đều vừa khung.
- Bản chạy production local: /stress. Không push hay sửa repo GitHub.

## Giới hạn

Phân trang dùng ngân sách nội dung bảo thủ, chưa xử lý mọi trường hợp cực dài trong một thẻ hay một ô bảng. Chưa xây chế độ đọc trên điện thoại dọc, xuất PDF/PPTX hoặc kiểm tra tất cả layout.

## Tái tạo

Dùng Node 24, npm ci, npm test, npm run build, npm start. Xem scripts/capture-review.mjs để chụp lại ảnh và báo cáo kiểm tra. Trang so sánh đi kèm là ảnh chụp trước–sau của bài thử.

Đã bấm thử nút CTA và chuyển đúng sang /review/compare.html. Kiểm tra ký tự xuống dòng còn nguyên trong DOM và computed white-space là pre-line. Nút chuyển phần trong trang so sánh đã đổi đúng sang ảnh phần hai của bảng; không có ảnh hỏng.
