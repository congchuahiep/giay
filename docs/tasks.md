# Auth

- [ ] **PIORITY**: Phân tích lại luồng khởi động dự án, luồng đăng nhập để quản lý trạng thái xác thực đúng hơn, đọc [architecture-auth.md](architecture-auth.md) ở khúc cuối có đề xuất (cần cải thiện lại)

- [ ] Nghiên cứu giải pháp mã hóa token trước khi lưu vào Keyring để tránh bị ứng dụng khác chạy cùng User đọc trộm (đặc biệt trên Windows và Linux).
  > **Lý do:** Khác với macOS (Keychain có cơ chế xác thực chữ ký ứng dụng), Windows Credential Manager và Linux Secret Service chỉ cô lập ở mức tài khoản người dùng (User Session). Mọi ứng dụng chạy dưới cùng tài khoản người dùng đều có thể truy cập và đọc được dữ liệu này nếu biết tên key.

# Form

- [ ] Mapping case tại tầng service là tốt nhất, schema hay `usePost`/`usePartialUpdate` không cần quan tâm làm gì cả

# Proxy

- [ ] **Test kỹ trên macOS với AbortController** - Bug #9177: App crash 100% khi web abort request (timeout axios, AbortController) trước khi Rust respond. Cần verify spawn task có catch panic đúng cách.

  > **File liên quan:** `src-tauri/src/http/protocol_handler.rs`
  > **Reference:** https://github.com/tauri-apps/tauri/issues/9177

- [ ] **Kiểm tra app có dùng iframe không** - Bug #11505: Trên Windows, iframe không gọi được custom protocol (Connection Refused). Nếu Yjs hoặc lib nào render iframe (preview, embed), sẽ bị lỗi.

  > **Reference:** https://github.com/tauri-apps/tauri/issues/11505

- [ ] **Đánh giá rủi ro WebView2 unsafe Rc clone** - Bug #15408: Trên Windows/WebView2, custom protocol handler có thể chạy off main thread, clone state unsafe. Code hiện tại dùng `ctx.app_handle().clone()` an toàn, nhưng cần lưu ý nếu sau này clone Webview trong handler.

  > **Reference:** https://github.com/tauri-apps/tauri/issues/15408

- [ ] **Benchmark overhead proxy vs invoke** - Đã verify lý thuyết: proxy nhanh hơn invoke ~4-7ms (không cần JSON serialize 2 chiều). Cần đo thực tế bằng DevTools Network trên app để confirm.
  > **Kết quả kỳ vọng:** Mỗi request authenticated có overhead < 10ms so với fetch thẳng (đã loại trừ network latency)
