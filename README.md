
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
3. **Keamanan**: Hanya pengguna yang emailnya terdaftar di koleksi Firestore `admins` yang dapat mengakses fitur manajemen.

## Pemecahan Masalah (Troubleshooting)

### Error: `auth/configuration-not-found`
Jika Anda melihat error ini saat mencoba login:
1. Buka [Firebase Console](https://console.firebase.google.com/).
2. Pergi ke **Authentication** > **Sign-in method**.
3. Klik **Add new provider** dan pilih **Google**.
4. Pastikan statusnya **Enabled**.

### Error: `auth/unauthorized-domain` (PENTING)
Jika Anda melihat error ini saat menggunakan **Web Preview** atau setelah **Deployment**:
1. Buka [Firebase Console](https://console.firebase.google.com/).
2. Masuk ke menu **Authentication** > Tab **Settings** > **Authorized domains**.
3. Klik **Add domain**.
4. Masukkan domain yang muncul di browser Anda (tanpa `https://` atau path belakang). 
   - Untuk pratinjau saat ini: `9000-firebase-studio-1779520840203.cluster-edb2jv34dnhjisxuq5m7l37ccy.cloudworkstations.dev`
   - Untuk Vercel: `smpn5langkerembong.vercel.app`

### Error: "Akses Ditolak" (Izin Diperlukan)
Jika Anda berhasil login tetapi melihat layar akses ditolak:
1. Buka **Firestore Database** di Firebase Console.
2. Buat koleksi baru bernama `admins`.
3. Buat dokumen baru dengan **ID Dokumen** = Alamat Email Google Anda (misal: `admin@gmail.com`).
4. Tambahkan field berikut ke dokumen tersebut:
   - `email` (string): email Anda
   - `role` (string): `superadmin`

## Panduan Deployment ke Vercel

### 1. Push Kode ke GitHub
Jalankan perintah ini di terminal:
```bash
git add .
git commit -m "Update konfigurasi admin"
git push -u origin main --force
```

---
© 2024 SMPN 5 Langke Rembong. Dikembangkan dengan EduVista Framework.
