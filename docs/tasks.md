# Auth

- [ ] Nghiên cứu giải pháp mã hóa token trước khi lưu vào Keyring để tránh bị ứng dụng khác chạy cùng User đọc trộm (đặc biệt trên Windows và Linux).
  > **Lý do:** Khác với macOS (Keychain có cơ chế xác thực chữ ký ứng dụng), Windows Credential Manager và Linux Secret Service chỉ cô lập ở mức tài khoản người dùng (User Session). Mọi ứng dụng chạy dưới cùng tài khoản người dùng đều có thể truy cập và đọc được dữ liệu này nếu biết tên key.
