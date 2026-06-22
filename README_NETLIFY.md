# Deploy Netlify + Aiven MySQL

Project ini sudah disesuaikan untuk Netlify Functions, jadi tidak perlu Render/Koyeb.

## Di Netlify

1. New site from Git
2. Pilih repo GitHub kamu
3. Build command: `npm install`
4. Publish directory: `public`
5. Functions directory otomatis dari `netlify.toml`

## Environment Variables

Isi di Netlify > Site configuration > Environment variables:

```
DB_HOST=mysql-1d5c68ee-ginaoke.e.aivencloud.com
DB_PORT=12595
DB_USER=avnadmin
DB_PASSWORD=PASSWORD_AIVEN_KAMU
DB_NAME=defaultdb
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false
```

## Test

Buka:

```
https://nama-site.netlify.app/api/health
```

Kalau muncul `ok: true`, app sudah connect ke Aiven.

## Catatan

- Data jadwal, notes, dan musik upload disimpan di Aiven MySQL.
- Upload audio dibatasi 8MB agar aman di Netlify Functions.
