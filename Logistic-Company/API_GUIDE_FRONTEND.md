# Panduan Integrasi API Backend untuk Frontend

Dokumen ini adalah panduan lengkap penggunaan endpoint API Microservices pada proyek **Logistic Company**. Semua request dari Frontend **harus diarahkan ke API Gateway (Port 8000)** yang berfungsi sebagai proxy sentral.

---

## 🚀 Konfigurasi Gateway & Base URL

* **Base URL:** `http://localhost:8000`
* **Prefix Rute:** Gateway akan memotong prefix `/api/<service>` sebelum meneruskannya ke microservice yang bersangkutan.

| Service | Deskripsi | Prefix Gateway | Port Internal | Database |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | Registrasi, Login & Profil Pengguna | `/api/auth` | `8001` | `wirpl_logistics_auth_db` |
| **Courier** | CRUD Kurir & Fleet/Armada | `/api/courier` | `8002` | `wirpl_logistics_courier_db` |
| **Shipment** | Registrasi Pengiriman Paket | `/api/shipment` | `8003` | `shipment_db` |
| **Tracking** | Lacak Status & Update Tracking | `/api/tracking` | `8004` | `tracking_db` |
| **Webhook** | Pendaftaran Callback Mitra & Notifikasi | `/api/webhook` | `8005` | `webhook_db` |

---

## 🔐 1. Service Autentikasi (Auth Service)
*Semua endpoint di bawah diakses melalui base URL gateway: `http://localhost:8000/api/auth`*

### A. Registrasi Pengguna (`POST /register`)
Digunakan untuk mendaftarkan akun baru (admin logistik atau kurir).
* **URL:** `http://localhost:8000/api/auth/register`
* **Method:** `POST`
* **Headers:** `Content-Type: application/json`
* **Request Body:**
  ```json
  {
    "name": "Budi Kurir",
    "email": "budi.kurir@logistic.com",
    "password": "securepassword123",
    "role": "kurir" // Pilihan: "admin", "kurir" (default: "kurir")
  }
  ```
* **Response Sukses (`201 Created`):**
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": 1,
      "name": "Budi Kurir",
      "email": "budi.kurir@logistic.com",
      "role": "kurir"
    }
  }
  ```

### B. Login Pengguna (`POST /login`)
Digunakan untuk autentikasi dan mendapatkan token akses JWT.
* **URL:** `http://localhost:8000/api/auth/login`
* **Method:** `POST`
* **Headers:** `Content-Type: application/json`
* **Request Body:**
  ```json
  {
    "email": "budi.kurir@logistic.com",
    "password": "securepassword123"
  }
  ```
* **Response Sukses (`200 OK`):**
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Budi Kurir",
      "email": "budi.kurir@logistic.com",
      "role": "kurir"
    }
  }
  ```

### C. Ambil Profil Pengguna (`GET /profile`)
Mengambil data detail pengguna yang sedang login berdasarkan JWT token.
* **URL:** `http://localhost:8000/api/auth/profile`
* **Method:** `GET`
* **Headers:** 
  - `Content-Type: application/json`
  - `Authorization: Bearer <TOKEN_JWT_HASIL_LOGIN>`
* **Response Sukses (`200 OK`):**
  ```json
  {
    "message": "Profile fetched successfully",
    "user": {
      "id": 1,
      "name": "Budi Kurir",
      "email": "budi.kurir@logistic.com",
      "role": "kurir"
    }
  }
  ```

---

## 🚚 2. Service Kurir & Armada (Courier Service)
*Semua endpoint di bawah diakses melalui base URL gateway: `http://localhost:8000/api/courier`*

### A. Kurir (Courier CRUD)

#### 1. Dapatkan Semua Kurir (`GET /couriers`)
* **URL:** `http://localhost:8000/api/courier/couriers`
* **Method:** `GET`
* **Response Sukses (`200 OK`):**
  ```json
  [
    {
      "id": 1,
      "name": "Budi Santoso",
      "phone": "081234567890",
      "vehicleId": 101,
      "status": "available", // Pilihan: "available", "on_delivery", "off"
      "createdAt": "2026-06-25T15:12:07.000Z",
      "updatedAt": "2026-06-25T15:12:07.000Z"
    }
  ]
  ```

#### 2. Dapatkan Kurir Berdasarkan ID (`GET /couriers/:id`)
* **URL:** `http://localhost:8000/api/courier/couriers/1`
* **Method:** `GET`

#### 3. Tambah Kurir Baru (`POST /couriers`)
* **URL:** `http://localhost:8000/api/courier/couriers`
* **Method:** `POST`
* **Request Body:**
  ```json
  {
    "name": "Ahmad Dani",
    "phone": "089876543210",
    "vehicleId": 102,
    "status": "available"
  }
  ```
* **Response Sukses (`201 Created`):**
  ```json
  {
    "message": "Courier created successfully",
    "courier": {
      "id": 2,
      "name": "Ahmad Dani",
      "phone": "089876543210",
      "vehicleId": 102,
      "status": "available"
    }
  }
  ```

#### 4. Update Data Kurir (`PUT /couriers/:id`)
* **URL:** `http://localhost:8000/api/courier/couriers/1`
* **Method:** `PUT`
* **Request Body (Kirim field yang ingin diubah saja):**
  ```json
  {
    "status": "on_delivery"
  }
  ```

#### 5. Hapus Kurir (`DELETE /couriers/:id`)
* **URL:** `http://localhost:8000/api/courier/couriers/1`
* **Method:** `DELETE`

---

### B. Armada (Fleet CRUD)

#### 1. Dapatkan Semua Fleet/Armada (`GET /fleets`)
* **URL:** `http://localhost:8000/api/courier/fleets`
* **Method:** `GET`
* **Response Sukses (`200 OK`):**
  ```json
  [
    {
      "id": 1,
      "plateNumber": "AB 1234 CD",
      "type": "Motorcycle",
      "status": "available", // Pilihan: "available", "in_use"
      "createdAt": "2026-06-25T15:12:07.000Z",
      "updatedAt": "2026-06-25T15:12:07.000Z"
    }
  ]
  ```

#### 2. Dapatkan Fleet Berdasarkan ID (`GET /fleets/:id`)
* **URL:** `http://localhost:8000/api/courier/fleets/1`
* **Method:** `GET`

#### 3. Tambah Fleet Baru (`POST /fleets`)
* **URL:** `http://localhost:8000/api/courier/fleets`
* **Method:** `POST`
* **Request Body:**
  ```json
  {
    "plateNumber": "AD 9876 EF",
    "type": "Truck",
    "status": "available"
  }
  ```

#### 4. Update Data Fleet (`PUT /fleets/:id`)
* **URL:** `http://localhost:8000/api/courier/fleets/1`
* **Method:** `PUT`

#### 5. Hapus Fleet (`DELETE /fleets/:id`)
* **URL:** `http://localhost:8000/api/courier/fleets/1`
* **Method:** `DELETE`

---

## 📦 3. Service Pengiriman (Shipment Service)
*Semua endpoint di bawah diakses melalui base URL gateway: `http://localhost:8000/api/shipment`*

### A. Buat Pengiriman Baru (`POST /`)
Digunakan oleh ecommerce/mitra untuk mendaftarkan pengiriman barang baru.
* **URL:** `http://localhost:8000/api/shipment`
* **Method:** `POST`
* **Headers:** 
  - `Content-Type: application/json`
  - `x-api-key: <API_KEY_MITRA>` (Diperlukan untuk otentikasi integrasi luar)
* **Request Body:**
  ```json
  {
    "orderId": 505,
    "senderName": "Toko Sebelah",
    "senderAddress": "Sleman, Yogyakarta",
    "receiverName": "Dina Amanda",
    "receiverAddress": "Kemang, Jakarta Selatan",
    "weight": 2.5,
    "serviceType": "EXPRESS" // Pilihan: "REGULAR", "EXPRESS"
  }
  ```
* **Response Sukses (`201 Created`):**
  ```json
  {
    "message": "Shipment created successfully",
    "shipment": {
      "id": 12,
      "resi": "AWB-8F9D7C2E", // Nomor Resi Otomatis dibuat backend
      "orderId": 505,
      "senderName": "Toko Sebelah",
      "senderAddress": "Sleman, Yogyakarta",
      "receiverName": "Dina Amanda",
      "receiverAddress": "Kemang, Jakarta Selatan",
      "weight": 2.5,
      "serviceType": "EXPRESS",
      "status": "WAITING_PICKUP"
    }
  }
  ```

### B. Ambil Semua Pengiriman (`GET /`)
* **URL:** `http://localhost:8000/api/shipment`
* **Method:** `GET`

### C. Ambil Pengiriman Berdasarkan ID (`GET /:id`)
* **URL:** `http://localhost:8000/api/shipment/12`
* **Method:** `GET`

### D. Tugaskan Kurir ke Pengiriman (`PATCH /:id/assign-courier`)
* **URL:** `http://localhost:8000/api/shipment/12/assign-courier`
* **Method:** `PATCH`
* **Request Body:**
  ```json
  {
    "courierId": 2
  }
  ```
* **Response Sukses (`200 OK`):**
  ```json
  {
    "message": "Courier assigned successfully",
    "shipment": {
      "id": 12,
      "resi": "AWB-8F9D7C2E",
      "courierId": 2,
      "status": "PICKED_UP" // Status otomatis berubah ke PICKED_UP
    }
  }
  ```

---

## 📍 4. Service Pelacakan (Tracking Service)
*Semua endpoint di bawah diakses melalui base URL gateway: `http://localhost:8000/api/tracking`*

### A. Lacak Pengiriman berdasarkan Resi (`GET /:resi`)
Digunakan oleh customer untuk melacak status dan history perjalanan paket mereka.
* **URL:** `http://localhost:8000/api/tracking/AWB-8F9D7C2E`
* **Method:** `GET`
* **Response Sukses (`200 OK` - sorted by newest log first):**
  ```json
  [
    {
      "id": 2,
      "resi": "AWB-8F9D7C2E",
      "status": "IN_TRANSIT",
      "description": "Paket sedang dalam perjalanan menuju Jakarta",
      "timestamp": "2026-06-25T15:20:00.000Z"
    },
    {
      "id": 1,
      "resi": "AWB-8F9D7C2E",
      "status": "PICKED_UP",
      "description": "Paket telah diambil oleh kurir",
      "timestamp": "2026-06-25T15:15:00.000Z"
    }
  ]
  ```

### B. Update Status Pelacakan (`POST /:resi/status`)
Digunakan oleh kurir/admin untuk menambahkan log status perjalanan paket yang baru.
* **URL:** `http://localhost:8000/api/tracking/AWB-8F9D7C2E/status`
* **Method:** `POST`
* **Request Body:**
  ```json
  {
    "status": "IN_TRANSIT", // Pilihan: "WAITING_PICKUP", "PICKED_UP", "IN_TRANSIT", "DELIVERED"
    "description": "Paket sedang dalam perjalanan menuju Jakarta"
  }
  ```
* **Response Sukses (`201 Created`):**
  ```json
  {
    "message": "Tracking status updated successfully",
    "log": {
      "id": 2,
      "resi": "AWB-8F9D7C2E",
      "status": "IN_TRANSIT",
      "description": "Paket sedang dalam perjalanan menuju Jakarta",
      "timestamp": "2026-06-25T15:20:00.000Z"
    }
  }
  ```

---

## 🔗 5. Service Webhook & Integrasi (Webhook Service)
*Semua endpoint di bawah diakses melalui base URL gateway: `http://localhost:8000/api/webhook`*

### A. Registrasi Webhook Mitra (`POST /register`)
Digunakan oleh perusahaan mitra/ecommerce untuk mendaftarkan URL callback mereka agar mendapatkan notifikasi status pengiriman real-time.
* **URL:** `http://localhost:8000/api/webhook/register`
* **Method:** `POST`
* **Request Body:**
  ```json
  {
    "companyName": "Shopee Indon",
    "callbackUrl": "https://shopee-indon.com/api/shipping-webhook"
  }
  ```
* **Response Sukses (`201 Created`):**
  ```json
  {
    "message": "Webhook registered successfully",
    "apiKey": "6b3c9f28d84a7e91...5ac89f2d", // API Key ini digunakan di header x-api-key saat POST /api/shipment
    "subscriber": {
      "id": 1,
      "companyName": "Shopee Indon",
      "callbackUrl": "https://shopee-indon.com/api/shipping-webhook"
    }
  }
  ```

### B. List Mitra Terdaftar (`GET /list`)
* **URL:** `http://localhost:8000/api/webhook/list`
* **Method:** `GET`
