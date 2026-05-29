
# Website SMPN 5 Langke Rembong

Website modern untuk SMPN 5 Langke Rembong yang dilengkapi dengan CMS Admin dinamis dan AI.

## Fitur Utama
- **CMS Admin**: Kelola Berita, Fasilitas, Galeri, dan Pengaturan Situs secara real-time.
- **PPDB Online**: Sistem pendaftaran siswa baru yang dapat diaktifkan/dinonaktifkan oleh admin.
- **WhatsApp Integration**: Tombol chat langsung ke admin sekolah.
- **AI Content Optimizer**: Membantu admin membuat ringkasan berita secara otomatis menggunakan Genkit AI.

## Panduan Akses Admin
Dashboard Admin digunakan untuk mengelola seluruh konten website.
1. **URL Akses**: Tambahkan `/admin` pada alamat website Anda (misal: `domainanda.com/admin`).
2. **Metode Login**: Masukkan Email dan Password akun admin.

## Pemecahan Masalah (Troubleshooting)

### Error: `auth/invalid-credential` (PENTING)
Jika Anda melihat error ini saat mencoba login:
1. Buka [Firebase Console](https://console.firebase.google.com/).
2. Masuk ke menu **Authentication** > **Sign-in method**.
3. Pastikan **Email/Password** berstatus **Enabled**.
4. Masuk ke tab **Users**, pastikan email `smpn5lr@gmail.com` sudah terdaftar. Jika belum, klik **Add user**.

### Error: `auth/unauthorized-domain`
Jika login gagal saat menggunakan domain baru:
1. Buka **Authentication** > Tab **Settings** > **Authorized domains**.
2. Klik **Add domain** dan masukkan domain website Anda (misal: `smpn5langkerembong.vercel.app`).

### Error: "Akses Ditolak" (Izin Diperlukan)
Jika login berhasil tapi akses diblokir:
1. Buka **Firestore Database**.
2. Buat koleksi baru bernama `admins`.
3. Tambah dokumen dengan **ID Dokumen** = `smpn5lr@gmail.com`.
4. Tambahkan field:
   - `email` (string): `smpn5lr@gmail.com`
   - `role` (string): `superadmin`

## Panduan Deployment ke Vercel

### 1. Push Kode ke GitHub
Jalankan perintah ini di terminal:
```bash
git add .
git commit -m "Update konfigurasi admin login"
git push -u origin main --force
```

---
© 2024 SMPN 5 Langke Rembong. Dikembangkan dengan EduVista Framework.
