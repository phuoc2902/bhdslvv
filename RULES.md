# 📋 BHDSLVV — QUY TẮC PHÁT TRIỂN & CẬP NHẬT

> Tài liệu này tổng hợp các lỗi thực tế đã gặp phải và quy tắc để tránh lặp lại trong tương lai.
> Mỗi quy tắc đều có: mô tả vấn đề, nguyên nhân, và cách làm đúng.

---

## 🔥 QUY TẮC 1 — Firebase: `.on()` + Auto-sync ghi đè = Vòng lặp vô hạn

### ❌ Vấn đề đã gặp
`loadFoodCatalog()` dùng `.on('value')` (realtime) **VÀ** đồng thời có code tự ghi đè lại Firebase khi nhận dữ liệu (auto-sync). Khi 2 bên (`index.js` và `admin.js`) có catalog mặc định khác nhau, mỗi bên nhận event → tự sửa → ghi lên Firebase → bên kia nhận event mới → lại sửa → vòng lặp vô hạn → Firebase nhấp nháy hàng trăm lần/giây → `renderFoodCatalog()` bị gọi liên tục → toàn bộ DOM card bị rebuild → mất trạng thái người dùng đang chọn.

### ✅ Quy tắc
- **`.on()` hoàn toàn an toàn** để dùng realtime cho `foodCatalog`, `categories` — miễn là callback **KHÔNG tự ghi đè lại Firebase**.
- **Cấm tuyệt đối** pattern: nhận dữ liệu từ Firebase → sửa → ghi trả lại Firebase trong cùng một `.on()` listener.
- Nếu cần cập nhật dữ liệu mặc định/migration → làm thủ công 1 lần từ Admin panel, sau đó **xóa code migration đi**.

| Tình huống | Dùng |
|---|---|
| Trang khách cần nhận ngay khi admin ẩn/hiện món | ✅ `.on('value')` — **không ghi lại Firebase** |
| Trang Admin xem đơn hàng mới theo realtime | ✅ `.on('value')` |
| Bất kỳ listener nào tự ghi đè lại Firebase sau khi nhận | ❌ Xóa code ghi đè đi, dùng `.on()` vẫn được |

### 📌 Kiểm tra nhanh
Sau khi viết một `.on()` listener, hỏi: *"Callback này có gọi `.set()` hay `.update()` lên Firebase không?"*
Nếu có → **đó là nguyên nhân vòng lặp vô hạn, xóa code ghi đó đi**.

---

## 🔥 QUY TẮC 2 — Firebase: Tuyệt đối không để client tự ghi đè dữ liệu

### ❌ Vấn đề đã gặp
Cả `index.js` (trang khách) và `admin.js` đều có đoạn code "auto-sync":
```js
// Nguy hiểm!
DEFAULT_FOOD_CATALOG.forEach(defaultItem => {
    if (!foodCatalog.find(item => item.id == defaultItem.id)) {
        foodCatalog.push(defaultItem);
        hasChanges = true;
    }
});
if (hasChanges) {
    database.ref('foodCatalog').set(foodCatalog); // Ghi đè lên Firebase
}
```
`index.js` có DEFAULT_FOOD_CATALOG khác với `admin.js` → 2 bên liên tục ghi đè lẫn nhau
→ **Vòng lặp vô hạn (Infinite Loop)**: Firebase nhấp nháy hàng trăm lần/giây.

### ✅ Quy tắc
- **Trang khách (`index.js`)**: chỉ được **ĐỌC** từ Firebase. **KHÔNG BAO GIỜ GHI** dữ liệu catalog.
- **Trang Admin (`admin.js`)**: là nơi DUY NHẤT được phép ghi `foodCatalog` lên Firebase.
- Không được có code "auto-sync/self-heal" trên client phía người dùng.
- Nếu cần migration dữ liệu (ví dụ: gộp 2 món thành 1), hãy làm **một lần duy nhất từ trang Admin**, sau đó xóa code đó đi.

---

## 🔥 QUY TẮC 3 — CSS: Không dùng `transform: scale()` trên thẻ bọc có element con tương tác

### ❌ Vấn đề đã gặp
`.food-card:hover { transform: scale(1.02); }` làm thẻ phình ra, đè lên thẻ kế bên.
Thẻ kế bên nằm cao hơn trong z-order → cướp mất sự kiện hover → thẻ hiện tại thu nhỏ lại
→ thẻ hiện tại lại "thắng" hover → phình ra → lặp lại → **giật liên tục không dừng được**.

Ngoài ra, `transform: scale()` trên thẻ bọc `<select>` khiến trình duyệt tính sai tọa độ
→ dropdown mở ra nhưng click không trúng vùng chọn → vô tình đóng ngay.

### ✅ Quy tắc
- **Không** dùng `transform: scale()` trên thẻ card bọc chứa `<select>`, `<input>`, hay button bên trong.
- Thay thế bằng: `box-shadow`, `border-color`, `background`, hoặc chỉ scale phần tử con cụ thể (ví dụ: chỉ scale ảnh bên trong `.food-img:hover`).
- Nếu vẫn muốn dùng scale, thêm `position: relative; z-index: 10;` vào `:hover` để tránh bị thẻ kế bên đè lên.

---

## 🔥 QUY TẮC 4 — DEFAULT_FOOD_CATALOG phải đồng nhất giữa các file

### ❌ Vấn đề đã gặp
`js/index.js` và `js/admin.js` có hai bản `DEFAULT_FOOD_CATALOG` khác nhau:
- `index.js`: item 15 = "Mojito Trái Cây", không có item 16.
- `admin.js`: item 15 = "Strawberry Mojito", item 16 = "Blue Ocean Mojito".

Khi cả hai cùng kết nối Firebase và cùng có logic auto-sync → chúng liên tục "sửa" lại
dữ liệu của nhau → Firebase database nhấp nháy liên tục.

### ✅ Quy tắc
- `DEFAULT_FOOD_CATALOG` trong `index.js` và `admin.js` **phải luôn giống hệt nhau** về: `id`, `name`, `image`, `description`, `price`.
- Mỗi khi thêm/sửa/xóa món trong DEFAULT, phải cập nhật **cả hai file** cùng lúc.
- Cân nhắc tách `DEFAULT_FOOD_CATALOG` ra một file riêng (`js/catalog.js`) và import vào cả hai để tránh lệch nhau.

---

## 🔥 QUY TẮC 5 — Không dùng `innerHTML` rebuild để cập nhật dữ liệu realtime

### ❌ Vấn đề đã gặp
`renderFoodCatalog()` dùng `container.innerHTML = ...` để render lại toàn bộ lưới.
Nếu hàm này được gọi trong listener `.on()` của Firebase, mỗi thay đổi nhỏ trên Firebase
sẽ xóa sạch DOM và tạo lại → mất toàn bộ trạng thái người dùng đang chọn.

### ✅ Quy tắc
- Các hàm `render*()` rebuild toàn bộ DOM → **chỉ được gọi 1 lần khi khởi tạo trang**, hoặc khi người dùng chủ động thao tác (bấm filter, reload trang).
- Nếu cần cập nhật realtime, chỉ cập nhật **đúng phần tử cụ thể** bị thay đổi (ví dụ: chỉ đổi text giá của 1 card, không rebuild lại cả grid).
- Trang khách hàng: dùng `.once()` cho tất cả dữ liệu catalog/menu.

---

## 🔥 QUY TẮC 6 — Phân biệt vai trò: Client vs Admin

### Nguyên tắc cốt lõi

| | Trang Khách (`trangchu.html`) | Trang Admin (`admin.html`) |
|---|---|---|
| Đọc `foodCatalog` | ✅ `.once()` | ✅ `.on()` |
| Ghi `foodCatalog` | ❌ KHÔNG BAO GIỜ | ✅ Chỉ khi Admin thao tác |
| Đọc `orders` | ❌ Không cần | ✅ `.on()` để xem đơn mới |
| Ghi `orders` | ✅ Khi khách đặt hàng | ❌ Không cần |
| Đọc `config/*` | ✅ `.on()` (storeStatus, cinemaName) | ✅ `.on()` |
| Ghi `config/*` | ❌ KHÔNG | ✅ Chỉ Admin |

---

## 🔥 QUY TẮC 7 — Kiểm tra trước khi Push lên Production

Trước mỗi lần `git push`, hãy kiểm tra checklist sau:

- [ ] Không có `.on('value')` nào trong `index.js` mà callback gọi hàm rebuild DOM toàn bộ
- [ ] `DEFAULT_FOOD_CATALOG` trong `index.js` và `admin.js` giống hệt nhau
- [ ] Không có code tự động ghi `database.ref('foodCatalog').set(...)` trong `index.js`
- [ ] Không có `transform: scale()` trên thẻ card bọc chứa form element
- [ ] Mở trang local, hover vào card món ăn, thử mở dropdown → không bị giật/reset
- [ ] Mở Firebase console, quan sát mục `foodCatalog` → không nhấp nháy liên tục

---

## 📝 Lịch sử lỗi

| Ngày | Lỗi | File | Quy tắc liên quan |
|---|---|---|---|
| 07/08/2026 | Giật khi hover card món ăn (CSS scale) | `trangchu.html` | QT #3 |
| 07/08/2026 | Firebase nhấp nháy hàng trăm lần/giây (vòng lặp vô hạn) | `index.js`, `admin.js` | QT #2, #4 |
| 07/08/2026 | Không chọn được dropdown (realtime rebuild DOM) | `index.js` | QT #1, #5 |

---

## 🔥 QUY TẮC 8 — Khi thêm/xóa món ăn, nhớ cập nhật bảng `SHORT_NAMES`

### Vị trí
File: `js/index.js` — hàm `buildOrderDiscordPayload()` — khoảng dòng 880–888.

```js
const SHORT_NAMES = {
    1:  'Bắp Rang',    5:  'Single Combo',  6:  'Couple Combo',
    8:  'Refresh CB',  9:  'Nước Ngọt',     10: 'Aquafina',
    11: 'Nước Chai',   15: 'Mojito',         20: 'Combo Food',
    21: 'Sweet Zip',   22: 'Single Zip',     23: 'Ly Đổi Màu',
    24: 'Couple Zip',  25: 'Xô Đơn',         26: 'CB Đổi Màu',
    27: 'Xô Đôi',     28: 'Bucket'
};
```

### ✅ Quy tắc

**Khi THÊM món mới:**
- Bảng có **fallback tự động**: nếu ID chưa có trong `SHORT_NAMES`, hệ thống tự lấy phần tên trước dấu `(` đầu tiên.
  - Ví dụ: `"Gà Rán Giòn (Spicy)"` → tự hiển thị `Gà Rán Giòn` trong thông báo Discord.
- Nếu tên fallback **quá dài hoặc không rõ ràng**, hãy thêm thủ công vào bảng:
  ```js
  29: 'Gà Rán'   // thêm dòng mới với ID mới
  ```
- Quy tắc đặt tên ngắn: **tối đa 12 ký tự**, đủ để phân biệt với các món khác.

**Khi XÓA món:**
- Không cần xóa khỏi `SHORT_NAMES` (entry thừa không gây lỗi, chỉ tốn vài byte).
- Tuy nhiên, nên dọn dẹp định kỳ để tránh nhầm lẫn.

**Khi SỬA ID của món (hiếm):**
- Phải cập nhật key trong `SHORT_NAMES` theo ID mới.

### 📌 Checklist khi thêm món mới vào `DEFAULT_FOOD_CATALOG`

- [ ] Thêm món vào `DEFAULT_FOOD_CATALOG` trong **cả** `index.js` và `admin.js` (xem QT #4)
- [ ] Kiểm tra tên món: nếu có dấu `(` trong tên → fallback vẫn hoạt động tốt
- [ ] Nếu tên quá dài hoặc dễ lẫn → thêm vào `SHORT_NAMES` với tên ngắn phù hợp
- [ ] Nếu món có các tùy chọn (vị, loại nước...) → kiểm tra hàm `renderFoodCard()` để đảm bảo option đúng ID
