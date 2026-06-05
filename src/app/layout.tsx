
import type {Metadata} from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/contact/WhatsAppButton';
import { ChatAssistant } from '@/components/chat/ChatAssistant';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';

/**
 * Metadata global dioptimalkan untuk multi-tenancy.
 * Judul dan deskripsi akan diperbarui secara dinamis oleh halaman client,
 * namun crawler akan melihat nilai default yang profesional ini.
 */
export const metadata: Metadata = {
  title: {
    default: 'Official School Portal | Education Excellence',
    template: '%s | Official School Portal'
  },
  description: 'Wadah pendidikan modern yang menginspirasi kreativitas dan prestasi bagi masa depan bangsa. Informasi sekolah, prestasi, dan pendaftaran siswa baru.',
  keywords: ['Pendidikan Modern', 'Sekolah Unggulan', 'Education Excellence', 'Digital School', 'PPDB Online'],
  authors: [{ name: 'EduVista School System' }],
  creator: 'EduVista GN',
  publisher: 'EduVista Global Network',
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    title: 'Portal Sekolah Modern - Mewujudkan Generasi Cerdas & Berkarakter',
    description: 'Menemukan masa depan cerah melalui sistem pendidikan terintegrasi dan fasilitas unggulan.',
    siteName: 'Official School Portal',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Official School Portal',
    description: 'Pusat informasi pendidikan modern dan prestasi siswa.',
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
