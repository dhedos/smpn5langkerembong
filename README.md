
# Website SMPN 5 Langke Rembong

Website modern untuk SMPN 5 Langke Rembong yang dilengkapi dengan CMS Admin dinamis dan AI.

## Fitur Utama
- **CMS Admin**: Kelola Berita, Fasilitas, Galeri, dan Pengaturan Situs secara real-time.
- **PPDB Online**: Sistem pendaftaran siswa baru yang dapat diaktifkan/dinonaktifkan oleh admin.
- **WhatsApp Integration**: Tombol chat langsung ke admin sekolah.
- **Sistem Keamanan**: Login admin terproteksi menggunakan Firebase Authentication.

## Panduan Akses Admin
Dashboard Admin digunakan untuk mengelola seluruh konten website.
1. **URL Akses**: Tambahkan `/admin` pada alamat website Anda (misal: `domainanda.com/admin`).
2. **Metode Login**: Masukkan Email dan Password yang telah didaftarkan di Firebase Console.

## Pemecahan Masalah (Troubleshooting)

### Error: `auth/invalid-credential`
Jika Anda melihat error ini saat mencoba login:
1. Buka [Firebase Console](https://console.firebase.google.com/).
2. Masuk ke menu **Authentication** > **Sign-in method**.
3. Klik **Add new provider** > pilih **Email/Password** > centang **Enable** > klik **Save**.
4. Masuk ke tab **Users**, klik **Add user** dan daftarkan email (bebas email apa saja) serta password.

### Error: `auth/unauthorized-domain`
Jika login gagal saat menggunakan domain baru atau preview:
1. Buka **Authentication** > Tab **Settings** > **Authorized domains**.
2. Klik **Add domain** dan masukkan domain website Anda (misal: `smpn5langkerembong.vercel.app`).

---
© 2024 SMPN 5 Langke Rembong. Dikembangkan dengan EduVista Framework.
