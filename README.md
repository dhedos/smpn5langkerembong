# Website SMPN 5 Langke Rembong

Website modern untuk SMPN 5 Langke Rembong yang dilengkapi dengan CMS Admin dinamis dan AI.

## Fitur Utama
- **CMS Admin**: Kelola Berita, Fasilitas, Galeri, dan Pengaturan Situs secara real-time.
- **AI Content Optimizer**: Ringkasan berita otomatis dan tag SEO menggunakan Gemini AI.
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

### Error: `403 Forbidden (API Key Leaked)`
Jika fitur AI tidak berfungsi karena kunci bocor:
1. Generate kunci baru di Google Cloud Console / Firebase Console.
2. Perbarui `apiKey` di file `src/firebase/config.ts`.
3. Pastikan kunci tersebut tidak dipublikasikan ke repositori publik tanpa proteksi.

---
© 2024 SMPN 5 Langke Rembong. Dikembangkan dengan EduVista Framework.
