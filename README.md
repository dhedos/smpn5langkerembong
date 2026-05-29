# Website SMPN 5 Langke Rembong

Website modern untuk SMPN 5 Langke Rembong yang dilengkapi dengan CMS Admin dinamis dan AI.

## Fitur Utama
- **CMS Admin**: Kelola Berita, Fasilitas, Galeri, dan Pengaturan Situs secara real-time.
- **PPDB Online**: Sistem pendaftaran siswa baru yang dapat diaktifkan/dinonaktifkan oleh admin.
- **WhatsApp Integration**: Tombol chat langsung ke admin sekolah.
- **AI Content Optimizer**: Membantu admin membuat ringkasan berita secara otomatis menggunakan Genkit AI.

## Cara Mengakses Admin
1. Buka browser dan arahkan ke `domain-anda.com/admin`.
2. Login menggunakan akun Google yang terdaftar.
3. Kelola seluruh konten melalui dashboard yang tersedia.

## Panduan Deployment ke Vercel

Untuk membuat website ini online, ikuti langkah-langkah berikut:

### 1. Push Kode ke GitHub
Pastikan kode Anda sudah berada di repositori GitHub:
```bash
git add .
git commit -m "Siap untuk deployment"
git push -u origin main --force
```

### 2. Hubungkan ke Vercel
1. Buka [Vercel Dashboard](https://vercel.com/dashboard).
2. Klik **"Add New"** lalu pilih **"Project"**.
3. Cari repositori `smpn5langkerembong` dan klik **"Import"**.

### 3. Konfigurasi Environment Variables (PENTING)
Agar fitur AI (ringkasan berita) berfungsi di Vercel, Anda harus menambahkan kunci API Google:
1. Di halaman konfigurasi Vercel (sebelum klik Deploy), cari bagian **Environment Variables**.
2. Tambahkan variabel berikut:
   - **Key**: `GOOGLE_GENAI_API_KEY`
   - **Value**: [Masukkan Kunci API Gemini Anda] (Bisa didapatkan di [Google AI Studio](https://aistudio.google.com/app/apikey))
3. Klik **"Add"**.

### 4. Klik Deploy
Vercel akan secara otomatis membangun aplikasi Anda. Setelah selesai, Anda akan mendapatkan URL publik (misal: `smpn5langkerembong.vercel.app`).

## Teknologi
- **Frontend**: Next.js 15 (App Router)
- **Database & Auth**: Firebase (Firestore & Authentication)
- **Styling**: Tailwind CSS & ShadCN UI
- **AI Engine**: Genkit AI (Google Gemini)

---
© 2024 SMPN 5 Langke Rembong. Dikembangkan dengan EduVista Framework.