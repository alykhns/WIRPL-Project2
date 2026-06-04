# Dokumentasi Bagian Dhimas

Dokumentasi ini menjelaskan cara menjalankan dan mengecek fungsionalitas bagian Dhimas:

- Auth service
- Product service
- Supplier service
- Integrasi lewat API Gateway

## 1. Struktur Service

Service Dhimas berada di folder:

```txt
services/auth
services/product
services/supplier
services/gateway
```

Port yang digunakan:

| Service | Port | Base URL |
| --- | ---: | --- |
| Gateway | 3000 | `http://localhost:3000` |
| Auth | 3001 | `http://localhost:3001` |
| Product | 3002 | `http://localhost:3002` |
| Supplier | 3006 | `http://localhost:3006` |

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
DB_SUPPLIER_NAME=lumiere_supplier
JWT_SECRET=rahasia_apapun_bebas
```

Catatan:

- Password MySQL setiap developer boleh berbeda.
- Jangan push password pribadi ke repository publik.
- Jika password MySQL kosong, isi `DB_PASSWORD=` saja.

## 3. Import Database

Buka **MySQL 9.4 Command Line Client**, login, lalu jalankan:

```sql
source D:/UGM/smt_4/WIRPL/WIRPL-Project2/databases/core.sql;
```

```sql
source D:/UGM/smt_4/WIRPL/WIRPL-Project2/databases/supplier.sql;
```

Cek database:

```sql
SHOW DATABASES;
```

Database yang harus ada:

```txt
lumiere_tenant_1
lumiere_supplier
```

Cek data awal product:

```sql
USE lumiere_tenant_1;
SELECT * FROM products LIMIT 5;
```

Cek data awal supplier:

```sql
USE lumiere_supplier;
SELECT * FROM suppliers;
```

Jika muncul `Duplicate entry` saat import, itu aman selama database dan data sudah ada. Artinya seed pernah di-import sebelumnya.

## 4. Install Dependency

Jalankan dari root project:

```powershell
cd "D:\UGM\smt_4\WIRPL\WIRPL-Project2"
```

Install dependency setiap service:

```powershell
cd services/auth
npm install
```

```powershell
cd ../product
npm install
```

```powershell
cd ../supplier
npm install
```

```powershell
cd ../gateway
npm install
```

## 5. Menjalankan Service

Gunakan 4 terminal terpisah.

Terminal 1 - Auth:

```powershell
cd "D:\UGM\smt_4\WIRPL\WIRPL-Project2\services\auth"
npm run dev
```

Output yang benar:

```txt
Auth service running on port 3001
```

Terminal 2 - Product:

```powershell
cd "D:\UGM\smt_4\WIRPL\WIRPL-Project2\services\product"
npm run dev
```

Output yang benar:

```txt
Product service running on port 3002
```

Terminal 3 - Supplier:

```powershell
cd "D:\UGM\smt_4\WIRPL\WIRPL-Project2\services\supplier"
npm run dev
```

Output yang benar:

```txt
Supplier service running on port 3006
```

Terminal 4 - Gateway:

```powershell
cd "D:\UGM\smt_4\WIRPL\WIRPL-Project2\services\gateway"
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

## 7. Test Auth

### Register

Method:

```txt
POST
```

URL:

```txt
http://localhost:3000/api/auth/register
```

Body -> raw -> JSON:

```json
{
  "username": "dhimas_test",
  "email": "dhimas_test@mail.com",
  "password": "password123",
  "first_name": "Dhimas",
  "last_name": "Tester"
}
```

Expected output:

```json
{
  "message": "Registrasi berhasil",
  "user_id": 11
}
```

### Login

Method:

```txt
POST
```

URL:

```txt
http://localhost:3000/api/auth/login
```

Body -> raw -> JSON:

```json
{
  "email": "dhimas_test@mail.com",
  "password": "password123"
}
```

Expected output:

```json
{
  "token": "jwt_token",
  "user": {
    "user_id": 11,
    "username": "dhimas_test",
    "email": "dhimas_test@mail.com"
  }
}
```

Simpan `token`, lalu gunakan di endpoint user:

```txt
Authorization: Bearer jwt_token
```

### Verify Token

Method:

```txt
GET
```

URL:

```txt
http://localhost:3000/api/auth/verify
```

Header:

```txt
Authorization: Bearer jwt_token
```

Expected output:

```json
{
  "valid": true,
  "user": {
    "user_id": 11,
    "email": "dhimas_test@mail.com"
  }
}
```

## 8. Test User Feature

### Profile

Method:

```txt
GET
```

URL:

```txt
http://localhost:3000/api/users/profile
```

Header:

```txt
Authorization: Bearer jwt_token
```

Expected output:

```json
{
  "user_id": 11,
  "username": "dhimas_test",
  "email": "dhimas_test@mail.com",
  "first_name": "Dhimas",
  "last_name": "Tester"
}
```

### Add Address

Method:

```txt
POST
```

URL:

```txt
http://localhost:3000/api/users/addresses
```

Header:

```txt
Authorization: Bearer jwt_token
```

Body -> raw -> JSON:

```json
{
  "label": "Rumah",
  "street": "Jl. Kaliurang, Sleman",
  "city": "Yogyakarta",
  "province": "DI Yogyakarta",
  "postal_code": "55281",
  "is_default": true
}
```

Expected output:

```json
{
  "message": "Alamat ditambahkan",
  "address_id": 1
}
```

## 9. Test Product

### Product List

Method:

```txt
GET
```

URL:

```txt
http://localhost:3000/api/products
```

Expected output:

```json
[
  {
    "product_id": 1,
    "product_name": "Isolated Item 1",
    "price": 100,
    "stock": 50
  }
]
```

### Product Search

Method:

```txt
GET
```

URL:

```txt
http://localhost:3000/api/products?search=Item&in_stock=true
```

Expected output:

```json
[
  {
    "product_id": 1,
    "product_name": "Isolated Item 1"
  }
]
```

### Product Detail

Method:

```txt
GET
```

URL:

```txt
http://localhost:3000/api/products/1
```

Expected output:

```json
{
  "product_id": 1,
  "product_name": "Isolated Item 1",
  "description": "Premium quality for Version A",
  "price": 100,
  "stock": 50
}
```

## 10. Test Supplier

### Supplier List

Method:

```txt
GET
```

URL:

```txt
http://localhost:3000/api/supplier
```

Expected output:

```json
[
  {
    "supplier_id": 1,
    "supplier_name": "Global Components Inc.",
    "category": "Electronics",
    "is_active": 1
  }
]
```

### Supplier Detail

Method:

```txt
GET
```

URL:

```txt
http://localhost:3000/api/supplier/1
```

Expected output:

```json
{
  "supplier_id": 1,
  "supplier_name": "Global Components Inc.",
  "category": "Electronics"
}
```

### Supplier Products

Method:

```txt
GET
```

URL:

```txt
http://localhost:3000/api/supplier/1/products
```

Expected output:

```json
[]
```

Output bisa kosong jika `supplier_products` belum diisi.

### Create Purchase Order

Method:

```txt
POST
```

URL:

```txt
http://localhost:3000/api/supplier/purchase-order
```

Body -> raw -> JSON:

```json
{
  "supplier_id": 1,
  "expected_delivery": "2026-06-10",
  "notes": "Restock produk katalog",
  "items": [
    {
      "product_ref_id": 1,
      "quantity": 10,
      "unit_price": 50000
    }
  ]
}
```

Expected output:

```json
{
  "message": "Purchase Order dibuat",
  "po_id": 1,
  "total_amount": 500000
}
```

### Purchase Order List

Method:

```txt
GET
```

URL:

```txt
http://localhost:3000/api/supplier/purchase-orders/list
```

Expected output:

```json
[
  {
    "po_id": 1,
    "supplier_id": 1,
    "supplier_name": "Global Components Inc.",
    "total_amount": 500000,
    "status": "draft"
  }
]
```

## 11. Endpoint Summary

| Feature | Method | URL |
| --- | --- | --- |
| Gateway health | GET | `/health` |
| Register | POST | `/api/auth/register` |
| Login | POST | `/api/auth/login` |
| Verify token | GET | `/api/auth/verify` |
| User profile | GET | `/api/users/profile` |
| Update profile | PUT | `/api/users/profile` |
| Address list | GET | `/api/users/addresses` |
| Add address | POST | `/api/users/addresses` |
| Delete address | DELETE | `/api/users/addresses/:id` |
| Wishlist list | GET | `/api/users/wishlist` |
| Add wishlist | POST | `/api/users/wishlist` |
| Delete wishlist | DELETE | `/api/users/wishlist/:product_id` |
| Product list | GET | `/api/products` |
| Product detail | GET | `/api/products/:id` |
| Create product | POST | `/api/products` |
| Update product | PUT | `/api/products/:id` |
| Delete product | DELETE | `/api/products/:id` |
| Supplier list | GET | `/api/supplier` |
| Supplier detail | GET | `/api/supplier/:id` |
| Supplier products | GET | `/api/supplier/:id/products` |
| Create purchase order | POST | `/api/supplier/purchase-order` |
| Purchase order list | GET | `/api/supplier/purchase-orders/list` |

## 12. Troubleshooting

### Error: `Cannot find module`

Penyebab:

- Dependency service belum di-install.

Solusi:

```powershell
npm install
```

Jalankan di folder service yang error.

### Error: `Access denied for user 'root'@'localhost'`

Penyebab:

- Password MySQL di `.env` salah.

Solusi:

```env
DB_USER=root
DB_PASSWORD=password_mysql_kamu
```

Restart service setelah mengubah `.env`.

### Error: `Unknown database 'lumiere_tenant_1'`

Penyebab:

- File `databases/core.sql` belum di-import.

Solusi:

```sql
source D:/UGM/smt_4/WIRPL/WIRPL-Project2/databases/core.sql;
```

### Error: `Unknown database 'lumiere_supplier'`

Penyebab:

- File `databases/supplier.sql` belum di-import.

Solusi:

```sql
source D:/UGM/smt_4/WIRPL/WIRPL-Project2/databases/supplier.sql;
```

### Error: `502 Bad Gateway`

Penyebab:

- Gateway hidup, tapi service target belum jalan.

Solusi:

Pastikan service ini hidup:

```txt
auth     -> 3001
product  -> 3002
supplier -> 3006
gateway  -> 3000
```

### Error: `EADDRINUSE`

Penyebab:

- Port sudah dipakai proses lain.

Solusi:

- Matikan proses lama dengan `Ctrl + C`.
- Pastikan auth memakai `3001`, product `3002`, supplier `3006`, gateway `3000`.

## 13. Bukti Fungsional

Bagian Dhimas dianggap berhasil jika semua request berikut sukses:

```txt
POST /api/auth/register                  201 Created
POST /api/auth/login                     200 OK
GET  /api/auth/verify                    200 OK
GET  /api/users/profile                  200 OK
POST /api/users/addresses                201 Created
GET  /api/products                       200 OK
GET  /api/products/:id                   200 OK
GET  /api/supplier                       200 OK
GET  /api/supplier/:id                   200 OK
POST /api/supplier/purchase-order        201 Created
GET  /api/supplier/purchase-orders/list  200 OK
```

Flow akhir:

```txt
User register -> login mendapat token -> token dipakai untuk profile/alamat/wishlist -> produk tampil di katalog -> supplier membuat purchase order untuk restock
```
