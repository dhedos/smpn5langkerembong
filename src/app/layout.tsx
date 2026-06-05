
import type {Metadata} from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/contact/WhatsAppButton';
import { ChatAssistant } from '@/components/chat/ChatAssistant';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: {
    default: 'SMPN 5 Langke Rembong - Website Resmi',
    template: '%s | SMPN 5 Langke Rembong'
  },
  description: 'Website resmi SMPN 5 Langke Rembong. Informasi sekolah, profil, berita terbaru, ekstrakurikuler, dan pendaftaran siswa baru (PPDB) online untuk wilayah Ruteng, Manggarai.',
  keywords: ['SMPN 5 Langke Rembong', 'SMP Negeri 5 Langke Rembong', 'Sekolah Ruteng', 'SMP Manggarai', 'PPDB SMPN 5 Langke Rembong', 'Pendidikan Manggarai'],
  authors: [{ name: 'SMPN 5 Langke Rembong' }],
  creator: 'SMPN 5 Langke Rembong',
  publisher: 'SMPN 5 Langke Rembong',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://smpn5langkerembong.sch.id',
    title: 'SMPN 5 Langke Rembong - Mewujudkan Generasi Cerdas & Berkarakter',
    description: 'Portal informasi resmi SMPN 5 Langke Rembong. Temukan berita terbaru, fasilitas unggulan, dan pendaftaran siswa baru.',
    siteName: 'SMPN 5 Langke Rembong',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SMPN 5 Langke Rembong',
    description: 'Portal informasi resmi SMPN 5 Langke Rembong.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        {/* Favicon optimization hints */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-body antialiased selection:bg-secondary selection:text-white" suppressHydrationWarning>
        <FirebaseClientProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <WhatsAppButton />
          <ChatAssistant />
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
