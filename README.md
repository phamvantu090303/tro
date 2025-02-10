# Hướng Dẫn Cài Đặt và Chạy Dự Án

## Bước 1: Cài Đặt Dependencies

### Backend (BE):
```bash
cd be
npm install
```

### Frontend (FE):
```bash
cd ../fe
cd be
npm install
```

## Bước 2: Build và Chạy Docker Image

### Dừng Các Container Hiện Tại:
```bash
docker-compose down
```

### Xây Dựng Lại Image:
```bash
docker-compose build
```

### Khởi Chạy Container:
```bash
docker-compose up -d
```

## Lưu Ý Quan Trọng
- **Khi cài thêm các package mới**, bạn cần build lại dự án để cập nhật `node_modules` trong container. Thực hiện như sau:

```bash
docker-compose down
docker-compose build
docker-compose up -d
```
