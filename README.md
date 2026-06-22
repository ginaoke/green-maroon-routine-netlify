# Daily Routine with Green & Maroon <3

Web planner romantis + fun dengan:

- Calendar default bulan sekarang
- Klik tanggal untuk lihat jadwal per jam
- Edit jadwal per tanggal atau simpan sebagai default hari itu
- Dynamic background music dari YouTube atau upload audio sendiri
- Notes validasi yang bisa diedit dan tersimpan
- Sound effects tombol, confetti, dan efek "duar-duar"
- Data tersimpan di MariaDB lewat backend Node.js

## Cara jalanin

### 1. Install dependency

```bash
npm install
```

### 2. Buat database

Import `schema.sql` ke MariaDB.

```bash
mysql -u root -p < schema.sql
```

### 3. Buat file `.env`

Copy dari `.env.example`, lalu sesuaikan user/password MariaDB.

```bash
cp .env.example .env
```

Contoh:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password_kamu
DB_NAME=daily_routine_green_maroon
```

### 4. Start web

```bash
npm start
```

Buka:

```text
http://localhost:3000
```

## Catatan penting

- Kalau web dibuka tanpa backend, tetap bisa jalan dengan mode local browser, tapi data tidak sync ke kamu dan dia.
- Untuk benar-benar dipakai berdua dan auto update, jalankan backend ini di server yang bisa diakses kalian berdua.
- YouTube diputar sebagai embed iframe, bukan download audio.
- Upload audio disimpan di folder `public/uploads` dan metadata-nya masuk MariaDB.
