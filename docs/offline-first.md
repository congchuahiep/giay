### Description

Chức năng hỗ trợ offline mang đến cho người dùng khả năng lưu trữ các dữ liệu như trang, workspace, và thông tin cá nhân trực tiếp trên thiết bị của mình. Nhờ đó, client có thể sử dụng ứng dụng một cách mượt mà mà không cần kết nối mạng liên tục. Đồng thời, chức năng này cũng đảm bảo quá trình đồng bộ dữ liệu giữa client và server diễn ra an toàn, bảo mật.

Đối với ứng dụng "Giấy", việc tích hợp cơ chế offline-first là điều kiện tiên quyết. Cơ chế này ưu tiên sử dụng dữ liệu từ bộ nhớ local trước khi truy xuất lên server, giúp người dùng trải nghiệm tốc độ phản hồi tức thì, không bị gián đoạn do mạng. Bên cạnh đó, dữ liệu vẫn được đồng bộ lên server khi cần thiết, đảm bảo tính liên tục và an toàn cho thông tin của người dùng.

> Lưu ý!: Cơ chế offline-first chỉ hỗ trợ ứng dụng desktop

Trước khi nói về chức năng hỗ trợ offline, ta cần hiểu về cơ chế lưu trữ dữ liệu offline và cách thức đồng bộ dữ liệu giữa client và server. Tìm hiểu nó trước trong [kiến trúc hệ thống](docs/architecture.md)
