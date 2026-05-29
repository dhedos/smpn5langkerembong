
# Website SMPN 5 Langke Rembong

Website modern untuk SMPN 5 Langke Rembong yang dilengkapi dengan CMS Admin dinamis dan AI.

## Fitur Utama
- **CMS Admin**: Kelola Berita, Fasilitas, Galeri, dan Pengaturan Situs secara real-time.
- **PPDB Online**: Sistem pendaftaran siswa baru yang dapat diaktifkan/dinonaktifkan oleh admin.
- **WhatsApp Integration**: Tombol chat langsung ke admin sekolah.
- **Sistem Keamanan**: Login admin terproteksi menggunakan Firebase Authentication.

## Panduan Akses Admin
Dashboard Admin digunakan untuk mengelola seluruh konten website.
1. **URL Akses**: Tambahkan `/admin` pada alamat website Anda.
2. **Metode Login**: Masukkan Email dan Password yang telah didaftarkan di Firebase Console.

## Pemecahan Masalah (Troubleshooting)

### Error: `auth/configuration-not-found`
Jika Anda melihat error ini:
1. Buka [Firebase Console](https://console.firebase.google.com/).
2. Masuk ke **Authentication** > **Sign-in method**.
3. Klik **Add new provider** > pilih **Email/Password** > klik **Enable** > **Save**.

### Error: `auth/invalid-credential`
Pastikan Anda sudah mendaftarkan user secara manual:
1. Buka **Authentication** > Tab **Users**.
2. Klik **Add user** dan daftarkan email serta password yang ingin digunakan.

### Error: `auth/unauthorized-domain`
Jika login gagal di lingkungan preview:
1. Buka **Authentication** > Tab **Settings** > **Authorized domains**.
2. Klik **Add domain** dan masukkan domain preview Anda (tanpa https://).

---
© 2024 SMPN 5 Langke Rembong. Dikembangkan dengan EduVista Framework.
