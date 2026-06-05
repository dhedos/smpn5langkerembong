import type {Metadata} from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/contact/WhatsAppButton';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';
import { DynamicBranding } from '@/components/layout/DynamicBranding';

// Menggunakan SVG logo perisai sekolah sebagai data URI untuk bypass favicon.ico fisik
const schoolShieldLogo = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj4KICA8cGF0aCBkPSJNNTAgNSBMMTAgMjUgVjU1IEMxMCA3NSA1MCA5NSA1MCA5NSBDNTAgOTUgOTAgNzUgOTAgNTUgVjI1IEw1MCA1IFoiIGZpbGw9IiMxYTM2NWQiIC8+CiAgPHBhdGggZD0iTTUwIDIwIEw1NSAzNSBINzAgTDU4IDQ1IEw2MiA2MCBMNTAgNTAgTDM4IDYwIEw0MiA0NSBMMzAgMzUgSDQ1IEw1MCAyMCBaIiBmaWxsPSIjZmJiZjI0IiAvPgo8L3N2Zz4=';

export const metadata: Metadata = {
  title: 'Website Resmi Sekolah',
  description: 'Portal Informasi Pendidikan dan Pendaftaran Siswa Baru.',
  icons: {
    icon: [
      { url: schoolShieldLogo, type: 'image/svg+xml' },
    ],
    shortcut: schoolShieldLogo,
    apple: schoolShieldLogo,
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
        <meta name="robots" content="index, follow" />
        {/* Force override any physical favicon.ico */}
        <link rel="icon" href={schoolShieldLogo} type="image/svg+xml" sizes="any" />
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
