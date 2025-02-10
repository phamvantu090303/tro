# Sử dụng Node.js 20
FROM node:20

WORKDIR /var/www/html/TESTNE_MASTER/BE

# Copy và cài đặt dependencies
COPY package*.json ./
RUN npm install

# Copy mã nguồn vào container
COPY . .

# Cài đặt Vite để chạy trong chế độ phát triển
EXPOSE 5000

# Sử dụng lệnh dev của Vite để chạy trong chế độ phát triển
CMD ["npm", "run", "dev"]
