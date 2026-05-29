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
2. **Metode Login**: Gunakan akun Google yang valid melalui tombol login yang tersedia.
3. **Keamanan**: Hanya pengguna yang berhasil login melalui Google yang dapat mengakses fitur manajemen.

## Panduan Deployment ke Vercel

### 1. Push Kode ke GitHub
Jika Anda telah melakukan perubahan, jalankan perintah ini di terminal:
```bash
git add .
git commit -m "Update konfigurasi admin"
git push -u origin main --force
```

### 2. Konfigurasi di Vercel
1. Hubungkan repositori GitHub Anda ke proyek Vercel baru.
2. **PENTING**: Tambahkan Environment Variable berikut di Dashboard Vercel:
   - **Key**: `GOOGLE_GENAI_API_KEY`
   - **Value**: [Masukkan Kunci API Gemini Anda] (Dapatkan di [Google AI Studio](https://aistudio.google.com/app/apikey))
3. Klik **Deploy**.

## Teknologi
- **Frontend**: Next.js 15 (App Router)
- **Database & Auth**: Firebase (Firestore & Authentication)
- **Styling**: Tailwind CSS & ShadCN UI
- **AI Engine**: Genkit AI (Google Gemini)

---
© 2024 SMPN 5 Langke Rembong. Dikembangkan dengan EduVista Framework.