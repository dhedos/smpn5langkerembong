
import type {Metadata} from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/contact/WhatsAppButton';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';
import { DynamicBranding } from '@/components/layout/DynamicBranding';

/**
 * Metadata global dioptimalkan untuk multi-tenancy.
 * Judul dan deskripsi akan diperbarui secara dinamis oleh DynamicBranding di sisi client.
 */
export const metadata: Metadata = {
  title: {
    default: 'Official School Portal',
    template: '%s | School Portal'
  },
  description: 'Wadah pendidikan modern yang menginspirasi kreativitas dan prestasi bagi masa depan bangsa. Informasi sekolah, prestasi, dan pendaftaran siswa baru.',
  keywords: ['Pendidikan Modern', 'Sekolah Unggulan', 'Education Excellence', 'Digital School', 'PPDB Online'],
  authors: [{ name: 'School System' }],
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    title: 'Official School Portal',
    description: 'Menemukan masa depan cerah melalui sistem pendidikan terintegrasi dan fasilitas unggulan.',
  }
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
      </head>
      <body className="font-body antialiased selection:bg-secondary selection:text-white" suppressHydrationWarning>
        <FirebaseClientProvider>
          <DynamicBranding />
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <WhatsAppButton />
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
