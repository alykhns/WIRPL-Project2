# Panduan Microservices Logistik untuk Dhimas (Auth & Courier)

Halo Dhimas, repository ini menggunakan arsitektur **microservices** murni dengan sebuah API Gateway. Bagian Faris (Shipment, Tracking, Webhook) sudah selesai di-setup. Dokumen ini menjelaskan apa yang perlu kamu ketahui untuk melanjutkan pekerjaanmu di service `auth` dan `courier` pada folder `Logistic-Company/backend/`.

## 1. Struktur Folder Kamu
Pekerjaanmu berada di:
- `Logistic-Company/backend/auth/` (Port 8001)
- `Logistic-Company/backend/courier/` (Port 8002)

Kedua folder tersebut **sudah ada** dan sudah berisi template awal (Server, Model, Controller, Routes). Tugasmu adalah melengkapi logika di dalam controller dan routes tersebut.

## 2. Aturan API Gateway & Routing
Gateway kita berjalan di Port `8000`. Konfigurasinya sudah ada di `Logistic-Company/backend/gateway/routes/index.js`. 

**Sangat Penting:**
Gateway menggunakan konfigurasi `pathRewrite: { '^/api/<service>': '' }`. Ini berarti gateway akan membuang prefix `/api/auth` sebelum meneruskannya ke service milikmu.

Karena itu, di dalam `auth/server.js` dan `courier/server.js`, kamu **harus menggunakan prefix root (`/`)**, BUKAN `/api/auth` atau `/auth`.

**Contoh yang Benar (di `auth/server.js`):**
```javascript
const authRoutes = require("./routes/authRoutes");
// GUNAKAN "/" KARENA GATEWAY SUDAH MEMBUANG PREFIX "/api/auth"
app.use("/", authRoutes); 
```

**Maka di `authRoutes.js` kamu:**
```javascript
router.post("/login", authController.login);
```

**Cara Mengakses via Postman:**
Kamu tetap menembak ke Gateway: `POST http://localhost:8000/api/auth/login`
Gateway akan meneruskannya ke: `POST http://localhost:8001/login`

Lakukan hal yang persis sama untuk service `courier` (gunakan `app.use("/", courierRoutes)`).

## 3. Database dan Dependencies
Setiap service berjalan secara independen:
1. Masuk ke `auth/` dan jalankan `npm install`.
2. Masuk ke `courier/` dan jalankan `npm install`.
3. Buat file `.env` di masing-masing folder dengan credential database lokalmu.

Service `auth` disarankan menggunakan database `wirpl_logistics_auth_db`, dan service `courier` menggunakan `wirpl_logistics_courier_db`. Pastikan koneksi Sequelize di `config/database.js` sudah mengarah ke nama database yang benar.

## 4. Cara Menjalankan
Karena ini microservices, kamu perlu membuka terminal terpisah untuk menjalankan service-service ini secara bersamaan:
1. Terminal 1: `cd Logistic-Company/backend/gateway` -> `npm run dev` (Port 8000)
2. Terminal 2: `cd Logistic-Company/backend/auth` -> `npm run dev` (Port 8001)
3. Terminal 3: `cd Logistic-Company/backend/courier` -> `npm run dev` (Port 8002)

Selamat mengerjakan!
