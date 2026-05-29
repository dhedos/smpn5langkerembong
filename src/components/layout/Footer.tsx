
"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { GraduationCap, Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from "lucide-react";
import { useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";

export function Footer() {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");

  const db = useFirestore();
  const settingsRef = useMemo(() => db ? doc(db, "settings", "general") : null, [db]);
  const { data: settings } = useDoc(settingsRef);

  if (isAdminPage) return null;

  const schoolName = settings?.schoolName || "EduVista SMP";
  const schoolLogo = settings?.schoolLogoUrl;
  const address = settings?.address || "Jl. Pendidikan No. 45, Jakarta Selatan, DKI Jakarta";
  const phone = settings?.phone || "(021) 1234-5678";
  const email = settings?.email || "info@eduvista-smp.sch.id";

  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* School Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-white p-2 rounded-lg">
                {schoolLogo ? (
                  <div className="relative h-6 w-6">
                    <Image src={schoolLogo} alt="Logo" fill className="object-contain" />
                  </div>
                ) : (
                  <GraduationCap className="h-6 w-6 text-primary" />
                )}
              </div>
              <span className="font-headline font-bold text-xl tracking-tighter">
                {schoolName.split(" ")[0]} <span className="text-secondary">{schoolName.split(" ").slice(1).join(" ")}</span>
              </span>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Membentuk generasi cerdas, berkarakter, dan siap menghadapi tantangan global melalui pendidikan modern yang berbasis nilai-nilai luhur.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-secondary transition-colors"><Facebook className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-secondary transition-colors"><Instagram className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-secondary transition-colors"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-secondary transition-colors"><Youtube className="h-5 w-5" /></Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-headline font-semibold mb-6 text-lg">Tautan Cepat</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><Link href="/profil" className="hover:text-white transition-colors">Profil Sekolah</Link></li>
              <li><Link href="/berita" className="hover:text-white transition-colors">Berita & Pengumuman</Link></li>
              <li><Link href="/ppdb" className="hover:text-white transition-colors">PPDB Online 2024</Link></li>
              <li><Link href="/akademik" className="hover:text-white transition-colors">Kalender Akademik</Link></li>
              <li><Link href="/galeri" className="hover:text-white transition-colors">Galeri Foto</Link></li>
            </ul>
          </div>

          {/* Academic */}
          <div>
            <h4 className="font-headline font-semibold mb-6 text-lg">Akademik</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><Link href="#" className="hover:text-white transition-colors">E-Learning</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Perpustakaan Digital</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Kurikulum Merdeka</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Daftar Guru</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Ekstrakurikuler</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-headline font-semibold mb-6 text-lg">Hubungi Kami</h4>
            <ul className="space-y-4 text-sm text-primary-foreground/70">
              <li className="flex gap-3">
                <MapPin className="h-5 w-5 text-secondary shrink-0" />
                <span className="whitespace-pre-line">{address}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="h-5 w-5 text-secondary shrink-0" />
                <span>{phone}</span>
              </li>
              <li className="flex gap-3">
                <Mail className="h-5 w-5 text-secondary shrink-0" />
                <span>{email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:row justify-between items-center gap-4 text-xs text-primary-foreground/50">
          <p>© 2024 {schoolName}. Seluruh hak cipta dilindungi.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-white">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
