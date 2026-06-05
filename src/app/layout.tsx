import type {Metadata} from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/contact/WhatsAppButton';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';
import { DynamicBranding } from '@/components/layout/DynamicBranding';

export const metadata: Metadata = {
  title: {
    default: 'Website Resmi',
    template: '%s'
  },
  description: 'Portal informasi resmi sekolah dengan layanan pendidikan modern dan prestasi unggulan.',
  icons: {
    icon: [], // Menghapus referensi ikon default untuk mencegah flicker logo lama
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
