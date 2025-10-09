### Keys

- Nội dung của trang tài liệu cần lưu dữ là **trạng thái của yDoc được mã hoá dưới dạng byte**

# Kiến trúc hệ thống

Hệ thống kiến trúc của ứng dụng Giấy đầy đủ sẽ gồm có 3 phần:

- **Client app**: Đây là dự án hiện tại, cung cấp giao diện người dùng, trình soạn thảo và khả năng lưu trữ dữ liệu cục bộ.
- **Yjs Server**: Máy chủ quản lý dữ liệu cộng tác và người dùng theo thời gian thực.
- **Backend Server**: Máy chủ phía backend chịu trách nhiệm lưu trữ dữ liệu, xác thực quyền truy cập và quản lý người dùng.

Dự án "Giấy" vẫn có thể hoạt động hoàn toàn độc lập mà không cần hai máy chủ trên, nếu bạn chỉ muốn sử dụng mà không cần lưu trữ trực tuyến hoặc tính năng cộng tác.

Nếu bạn muốn tự triển khai **Giấy** và lưu trữ dữ liệu trên máy chủ riêng, bạn có thể sử dụng Yjs Server mà dự án đã cung cấp sẵn tại [`giay-yjs-server`](#todo). Tuy nhiên, chúng tôi không thể chia sẻ mã nguồn của Backend Server vì một số lý do. Việc xây dựng Backend Server sẽ do bạn tự thực hiện, nhưng bạn cũng đừng quá lo lắng vì backend không quá phức tạp. Phần tài liệu dưới đây có thể sẽ giúp bạn hình dung tổng quan về cách triển khai nó.

# Yjs Server

_Đọc phần [collaborate-with-yjs.md](docs/collaborate-with-yjs.md) trước khi tìm hiểu nội dung phần này_

"Giấy" sử dụng Yjs để cho phép nhiều người dùng cùng lúc chỉnh sửa một trang tài liệu. Để đạt được điều này, thay vì lưu trữ dữ liệu theo cách truyền thống, Yjs sử dụng một loại dữ liệu đặc biệt gọi là "Shared type". Shared type cho phép các thay đổi từ nhiều người dùng được đồng bộ hóa liên tục và nhất quán.

Vì vậy, để có thể lưu trữ dữ liệu xuống database, ta không lưu trữ nội dung của trang tài liệu theo cách truyền thống, mà thay vào đó, chúng ta lưu trữ các trạng thái thay đổi của yDoc _(yDoc, nơi chứa và quản lý các shared type)_.

Dưới đây là một ví dụ về cách lưu dữ liệu của trang tài liệu xuống database

```ts
// Nội dung trang tài liệu = yDoc
const db = await getDatabase();
const encodedState = Y.encodeStateAsUpdate(yDoc);
const base64Encoded = fromUint8Array(encodedState);

db.execute(
  `
  UPDATE pages
    SET content = ?
    WHERE id = ?
  `,
  [base64Encoded, pageId],
);
```

Và để phân phối, lắng nghe được những client đang thay đổi nội dung dữ liệu của yDoc, yjs provider xuất hiện với vai trò là một trung tâm phân phối dữ liệu. Mỗi khi có một client trong room này thay đổi nội dung, yjs provider sẽ phát ra sự kiện `update` và gửi dữ liệu cập nhật đến tất cả các client khác trong room.

Giấy sử dụng Hocuspocus làm provider. Với Hocuspocus, trung tâm phân phố dữ liệu này là một server websocket nhỏ, mà ở đây ta sẽ gọi chúng đơn giản với cái tên là **Yjs Server**

![Yjs Server helps clients connect with each other](todo)

Như vậy ở đây ta có luồng hoạt động của Yjs Server như sau:

1. Khi một client kết nối đến Yjs Server, server sẽ tạo ra một yDoc mới và lưu trữ nó trong bộ nhớ.
2. Khi một client thay đổi nội dung của yDoc, server sẽ phát ra sự kiện `update` và gửi dữ liệu cập nhật đến tất cả các client khác trong room.
3. Khi một client ngắt kết nối, server sẽ xóa yDoc khỏi bộ nhớ.

Như vậy, Yjs Server giúp các client kết nối với nhau và đồng bộ hóa dữ liệu trong một phòng chat.
