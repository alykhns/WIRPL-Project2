# Dokumentasi Bagian Faris

Dokumentasi ini menjelaskan cara menjalankan dan mengecek fungsionalitas bagian Faris:

- Order service
- Payment service
- Logistics service
- API Gateway
- Flow end-to-end: order -> payment -> shipment -> tracking

## 1. Struktur Service

Service Faris berada di folder:

```txt
services/order
services/payment
services/logistics
services/gateway
```

Port yang digunakan:

| Service | Port | Base URL |
| --- | ---: | --- |
| Gateway | 3000 | `http://localhost:3000` |
| Order | 3003 | `http://localhost:3003` |
| Payment | 3004 | `http://localhost:3004` |
| Logistics | 3005 | `http://localhost:3005` |

Frontend dan Postman disarankan mengakses lewat gateway:

```txt
http://localhost:3000/api
```

## 2. Prasyarat

Pastikan sudah terinstall:

- Node.js
- MySQL Server / MySQL 9.4 Command Line Client
- Postman atau Thunder Client

Pastikan file `.env` di root project berisi credential MySQL lokal:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password_mysql_kamu

DB_MAIN_NAME=lumiere_tenant_1
DB_PAYMENT_NAME=lumiere_payment
DB_LOGISTICS_NAME=lumiere_logistics
DB_SUPPLIER_NAME=lumiere_supplier
```

Catatan:

- Password MySQL setiap developer boleh berbeda.
- Jangan push password pribadi ke repository publik.
- Jika password MySQL kosong, isi `DB_PASSWORD=` saja.

## 3. Import Database

Buka **MySQL 9.4 Command Line Client**, login, lalu jalankan:

```sql
source C:/Users/FARIS/OneDrive/Dokumen/Fullstack Journey/Projects/WIRPL/WIRPL-Project2/databases/core.sql;
```

```sql
source C:/Users/FARIS/OneDrive/Dokumen/Fullstack Journey/Projects/WIRPL/WIRPL-Project2/databases/payment.sql;
```

```sql
source C:/Users/FARIS/OneDrive/Dokumen/Fullstack Journey/Projects/WIRPL/WIRPL-Project2/databases/logistics.sql;
```

Opsional untuk service supplier:

```sql
source C:/Users/FARIS/OneDrive/Dokumen/Fullstack Journey/Projects/WIRPL/WIRPL-Project2/databases/supplier.sql;
```

Cek database:

```sql
SHOW DATABASES;
```

Database yang harus ada:

```txt
lumiere_tenant_1
lumiere_payment
lumiere_logistics
```

Cek data awal payment:

```sql
USE lumiere_payment;
SELECT * FROM payment_methods;
```

Cek data awal logistics:

```sql
USE lumiere_logistics;
SELECT * FROM couriers;
```

Jika muncul `Duplicate entry` saat import, itu aman selama database dan data sudah ada. Artinya seed pernah di-import sebelumnya.

## 4. Install Dependency

Jalankan dari root project:

```powershell
cd "C:\Users\FARIS\OneDrive\Dokumen\Fullstack Journey\Projects\WIRPL\WIRPL-Project2"
```

Install dependency setiap service:

```powershell
cd services/order
npm install
```

```powershell
cd ../payment
npm install
```

```powershell
cd ../logistics
npm install
```

```powershell
cd ../gateway
npm install
```

## 5. Menjalankan Service

Gunakan 4 terminal terpisah.

Terminal 1 - Order:

```powershell
cd "C:\Users\FARIS\OneDrive\Dokumen\Fullstack Journey\Projects\WIRPL\WIRPL-Project2\services\order"
npm run dev
```

Output yang benar:

```txt
Order service running on port 3003
```

Terminal 2 - Payment:

```powershell
cd "C:\Users\FARIS\OneDrive\Dokumen\Fullstack Journey\Projects\WIRPL\WIRPL-Project2\services\payment"
npm run dev
```

Output yang benar:

```txt
Payment service running on port 3004
```

Terminal 3 - Logistics:

```powershell
cd "C:\Users\FARIS\OneDrive\Dokumen\Fullstack Journey\Projects\WIRPL\WIRPL-Project2\services\logistics"
npm run dev
```

Output yang benar:

```txt
Logistics service running on port 3005
```

Terminal 4 - Gateway:

```powershell
cd "C:\Users\FARIS\OneDrive\Dokumen\Fullstack Journey\Projects\WIRPL\WIRPL-Project2\services\gateway"
npm run dev
```

Output yang benar:

```txt
Gateway running on port 3000
```

## 6. Health Check

Gunakan Postman/Thunder Client.

### Gateway Health

Method:

```txt
GET
```

URL:

```txt
http://localhost:3000/health
```

Expected output:

```json
{
  "status": "Gateway running",
  "services": {
    "auth": "http://localhost:3001",
    "product": "http://localhost:3002",
    "order": "http://localhost:3003",
    "payment": "http://localhost:3004",
    "logistics": "http://localhost:3005",
    "supplier": "http://localhost:3006"
  }
}
```

## 7. Test Data Awal

### Payment Methods

Method:

```txt
GET
```

URL:

```txt
http://localhost:3000/api/payment/methods
```

Expected output:

```json
[
  {
    "method_id": 1,
    "method_name": "e-wallet",
    "provider": "OVO",
    "is_active": 1
  }
]
```

Data lain seperti GoPay, BCA, Mandiri, dan COD juga bisa muncul.

### Couriers

Method:

```txt
GET
```

URL:

```txt
http://localhost:3000/api/logistics/couriers
```

Expected output:

```json
[
  {
    "courier_id": 1,
    "courier_name": "JNE",
    "service_type": "Regular",
    "cost_per_km": 1500,
    "is_active": 1
  }
]
```

### Orders

Method:

```txt
GET
```

URL:

```txt
http://localhost:3000/api/orders
```

Expected output:

```json
[
  {
    "order_id": 1,
    "buyer_id": 2,
    "institution_id": 2,
    "total_amount": 100,
    "order_status": "pay"
  }
]
```

Output bisa berbeda sesuai data di database.

## 8. Test Flow End-to-End

Flow yang dicek:

```txt
checkout order -> payment pending -> payment success -> shipment update -> track resi
```

### Step 1 - Checkout

Method:

```txt
POST
```

URL:

```txt
http://localhost:3000/api/orders/checkout
```

Body -> raw -> JSON:

```json
{
  "buyer_id": 1,
  "institution_id": 1,
  "total_amount": 100,
  "items": [
    {
      "product_id": 1,
      "quantity": 1,
      "price": 100
    }
  ],
  "payment_method_id": 1,
  "courier_id": 1,
  "destination_address": "Jl. Kaliurang, Sleman, DI Yogyakarta"
}
```

Expected output:

```json
{
  "message": "Checkout berhasil!",
  "order_id": 201,
  "tracking_number": "LMR-1780573373323"
}
```

Simpan:

```txt
order_id
tracking_number
```

### Step 2 - Cek Payment By Order

Method:

```txt
GET
```

URL:

```txt
http://localhost:3000/api/payment/201
```

Ganti `201` dengan `order_id` dari checkout.

Expected output:

```json
{
  "transaction_id": 1,
  "order_id": 201,
  "method_id": 1,
  "amount": 100,
  "status": "pending",
  "external_ref": null,
  "paid_at": null,
  "method_name": "e-wallet",
  "provider": "OVO"
}
```

Simpan:

```txt
transaction_id
```

### Step 3 - Confirm Payment

Method:

```txt
PUT
```

URL:

```txt
http://localhost:3000/api/payment/1/confirm
```

Ganti `1` dengan `transaction_id`.

Body -> raw -> JSON:

```json
{
  "external_ref": "OVO-TEST-201"
}
```

Expected output:

```json
{
  "message": "Pembayaran dikonfirmasi",
  "payment": {
    "transaction_id": 1,
    "order_id": 201,
    "method_id": 1,
    "amount": 100,
    "status": "success",
    "external_ref": "OVO-TEST-201"
  }
}
```

### Step 4 - Update Shipment Status

Method:

```txt
PUT
```

URL:

```txt
http://localhost:3000/api/logistics/shipments/201/status
```

Ganti `201` dengan `order_id`.

Body -> raw -> JSON:

```json
{
  "status": "in_transit",
  "location": "Hub Yogyakarta",
  "note": "Paket sedang dalam perjalanan ke alamat tujuan"
}
```

Expected output:

```json
{
  "message": "Status pengiriman diupdate"
}
```

Status valid:

```txt
preparing
picked_up
in_transit
delivered
returned
```

### Step 5 - Track Resi

Method:

```txt
GET
```

URL:

```txt
http://localhost:3000/api/logistics/track/LMR-1780573373323
```

Ganti `LMR-1780573373323` dengan `tracking_number`.

Expected output:

```json
{
  "shipment": {
    "shipment_id": 1,
    "order_id": 201,
    "courier_id": 1,
    "tracking_number": "LMR-1780573373323",
    "destination_address": "Jl. Kaliurang, Sleman, DI Yogyakarta",
    "shipping_status": "in_transit",
    "courier_name": "JNE",
    "service_type": "Regular"
  },
  "history": [
    {
      "history_id": 2,
      "shipment_id": 1,
      "location": "Hub Yogyakarta",
      "status_note": "Paket sedang dalam perjalanan ke alamat tujuan"
    },
    {
      "history_id": 1,
      "shipment_id": 1,
      "location": "Warehouse",
      "status_note": "Pesanan sedang disiapkan"
    }
  ]
}
```

Jika output ini muncul, flow Faris sudah fungsional.

## 9. Endpoint Summary

| Feature | Method | URL |
| --- | --- | --- |
| Gateway health | GET | `/health` |
| List orders | GET | `/api/orders` |
| Order detail | GET | `/api/orders/:order_id` |
| Checkout | POST | `/api/orders/checkout` |
| Payment methods | GET | `/api/payment/methods` |
| Payment by order | GET | `/api/payment/:order_id` |
| Confirm payment | PUT | `/api/payment/:transaction_id/confirm` |
| Courier list | GET | `/api/logistics/couriers` |
| Update shipment | PUT | `/api/logistics/shipments/:order_id/status` |
| Track resi | GET | `/api/logistics/track/:tracking_number` |

## 10. Troubleshooting

### Error: `Access denied for user 'root'@'localhost'`

Penyebab:

- Password MySQL di `.env` salah.

Solusi:

```env
DB_USER=root
DB_PASSWORD=password_mysql_kamu
```

Restart service setelah mengubah `.env`.

### Error: `Unknown database 'lumiere_payment'`

Penyebab:

- File SQL belum di-import.

Solusi:

```sql
source C:/Users/FARIS/OneDrive/Dokumen/Fullstack Journey/Projects/WIRPL/WIRPL-Project2/databases/payment.sql;
```

### Error: `502 Bad Gateway`

Penyebab:

- Gateway hidup, tapi service target belum jalan.

Solusi:

Pastikan service ini hidup:

```txt
order     -> 3003
payment   -> 3004
logistics -> 3005
gateway   -> 3000
```

### Error: `EADDRINUSE`

Penyebab:

- Port sudah dipakai proses lain.

Solusi:

- Matikan proses lama dengan `Ctrl + C`.
- Pastikan order memakai `3003`, payment `3004`, logistics `3005`, gateway `3000`.

## 11. Bukti Fungsional

Bagian Faris dianggap berhasil jika semua request berikut sukses:

```txt
GET  /api/payment/methods                 200 OK
GET  /api/logistics/couriers              200 OK
GET  /api/orders                          200 OK
POST /api/orders/checkout                 201 Created
GET  /api/payment/:order_id               200 OK
PUT  /api/payment/:transaction_id/confirm 200 OK
PUT  /api/logistics/shipments/:order_id/status 200 OK
GET  /api/logistics/track/:tracking_number 200 OK
```

Flow akhir:

```txt
Order dibuat -> Payment dibuat pending -> Payment dikonfirmasi success -> Shipment diupdate -> Resi bisa dilacak
```
