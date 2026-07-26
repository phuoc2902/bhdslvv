# Hướng Dẫn Dành Cho Agent: Quy Trình Thay Đổi Giao Diện Sự Kiện Tạm Thời (Event UI)

**Mục đích:** Document này ghi chú lại chiến lược (strategy) thay đổi giao diện và nội dung trang web cho các sự kiện tạm thời (ví dụ: Sự kiện Hộ Linh Tráng Sĩ) mà **KHÔNG** làm ảnh hưởng đến cơ sở dữ liệu gốc trên Firebase, giúp việc "Undo/Revert" sau sự kiện diễn ra nhanh chóng, an toàn 100%.

---

## 1. Nguyên Tắc Cốt Lõi (Core Principle)
- **Không đụng chạm vào Firebase:** Giữ nguyên toàn bộ dữ liệu thật đang lưu trên Firebase (bao gồm `id`, `name`, `price`, `description` gốc như "Bắp Rang", "Single Combo").
- **Ghi đè hiển thị ở lớp Frontend (Override at Render):** Bất cứ lúc nào cần thay đổi tên món ăn hay mô tả cho phù hợp với Theme sự kiện, hãy can thiệp trực tiếp vào hàm Render HTML (`renderFoodCatalog` trong `index.html`).

## 2. Cách Thực Hiện (Cho các Event trong tương lai)
Khi cần tạo giao diện cho một Event mới, Agent cần làm các bước sau:

1. **CSS/Theme:** Thay đổi các biến CSS (Màu sắc, Font chữ) trong `index.html`.
2. **Form Text:** Tìm các placeholder, nhãn (label) của form thanh toán trong HTML và sửa trực tiếp (Ví dụ: "Tên khách hàng" -> "Danh tính lữ khách").
3. **Data Override:** Trong hàm `renderFoodCatalog()` ở file `index.html`, ngay sau khi fetch hoặc filter dữ liệu, hãy thêm một đoạn lệnh map/override các thuộc tính của `food` dựa trên `food.id` trước khi đưa vào template string. 
   
   *Ví dụ đoạn code Agent đã dùng để ép buộc (force) đổi tên không cần Database:*
   ```javascript
   // Force override names to Event theme ignoring Firebase data
   if (food.id === 1) { food.name = "Kim Ngọc Hạt (Bắp Rang)"; }
   else if (food.id === 5) { food.name = "Hành Trang Tráng Sĩ (Single)"; }
   // ... (tương tự cho các id khác)
   ```

## 3. Cách Kết Thúc Sự Kiện (Revert)
Vì lớp Database không hề thay đổi, khi Event kết thúc, Agent hoặc User chỉ cần thao tác rất đơn giản:
- Dùng **Git** để quay lại (revert/checkout) commit trước khi diễn ra sự kiện.
- **KHÔNG CẦN** chạy script khôi phục cơ sở dữ liệu.
- Trang web sẽ lập tức tải lại dữ liệu gốc từ Firebase (như Single Combo, Bắp rang) và giao diện cũ tự động hoạt động bình thường trở lại.

---
*Note: Đưa tệp này cho bất kỳ AI Agent nào trong tương lai để chúng hiểu ngay kiến trúc tách biệt giữa Render UI và Database Firebase của dự án.*


## LƯU Ý KHI KẾT THÚC SỰ KIỆN HỘ LINH TRÁNG SĨ (HLTS)
- **KHÔNG BẤM NÚT "KHÔI PHỤC MẶC ĐỊNH"** trong trang Admin Firebase.
- Để tắt giao diện HLTS và về lại BHD Star cũ, CHỈ CẦN dùng Git để revert commit sự kiện này hoặc checkout về mã code cũ.
- Nếu lỡ bấm cập nhật CSDL bằng tên mới trên Admin, thì sau khi revert code Frontend, hãy vào Admin và bấm "Khôi phục mặc định" để reset tên lại thành tiếng Anh.
