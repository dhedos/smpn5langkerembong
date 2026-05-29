
"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { GraduationCap, Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail, LogIn } from "lucide-react";
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
  const address = settings?.address || "Jl. Pendidikan No. 45,\nJakarta Selatan, DKI\nJakarta";
  const phone = settings?.phone || "(021) 1234-5678";
  const email = settings?.email || "info@eduvista-smp.sch.id";

  return (
    <footer className="bg-primary text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* School Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-white p-2.5 rounded-2xl shadow-lg">
                {schoolLogo ? (
                  <div className="relative h-7 w-7">
                    <Image src={schoolLogo} alt="Logo" fill className="object-contain" />
                  </div>
                ) : (
                  <GraduationCap className="h-7 w-7 text-primary" />
                )}
              </div>
              <span className="font-headline font-bold text-2xl tracking-tighter">
                EduVista <span className="text-secondary">SMP</span>
              </span>
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed max-w-xs">
              Membentuk generasi cerdas, berkarakter, dan siap menghadapi tantangan global melalui pendidikan modern yang berbasis nilai-nilai luhur.
            </p>
            <div className="flex gap-5 pt-2">
              <Link href="#" className="text-white hover:text-secondary transition-colors"><Facebook className="h-5 w-5" /></Link>
              <Link href="#" className="text-white hover:text-secondary transition-colors"><Instagram className="h-5 w-5" /></Link>
              <Link href="#" className="text-white hover:text-secondary transition-colors"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="text-white hover:text-secondary transition-colors"><Youtube className="h-5 w-5" /></Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:pl-8">
            <h4 className="font-headline font-bold mb-8 text-xl tracking-tight">Tautan Cepat</h4>
            <ul className="space-y-4 text-[15px] text-primary-foreground/70">
              <li><Link href="/profil" className="hover:text-white transition-colors">Profil Sekolah</Link></li>
              <li><Link href="/berita" className="hover:text-white transition-colors">Berita & Pengumuman</Link></li>
              <li><Link href="/ppdb" className="hover:text-white transition-colors">PPDB Online 2024</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Kalender Akademik</Link></li>
              <li><Link href="/galeri" className="hover:text-white transition-colors">Galeri Foto</Link></li>
            </ul>
          </div>

          {/* Academic */}
          <div className="md:pl-4">
            <h4 className="font-headline font-bold mb-8 text-xl tracking-tight">Akademik</h4>
            <ul className="space-y-4 text-[15px] text-primary-foreground/70">
              <li><Link href="#" className="hover:text-white transition-colors">E-Learning</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Perpustakaan Digital</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Kurikulum Merdeka</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Daftar Guru</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Ekstrakurikuler</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-headline font-bold mb-8 text-xl tracking-tight">Hubungi Kami</h4>
            <ul className="space-y-6 text-[15px] text-primary-foreground/90">
              <li className="flex gap-4 items-start">
                <MapPin className="h-6 w-6 text-secondary shrink-0 mt-0.5" />
                <span className="whitespace-pre-line leading-relaxed">{address}</span>
              </li>
              <li className="flex gap-4 items-center">
                <Phone className="h-6 w-6 text-secondary shrink-0" />
                <span>{phone}</span>
              </li>
              <li className="flex gap-4 items-center">
                <Mail className="h-6 w-6 text-secondary shrink-0" />
                <span>{email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/50">
          <p>© 2024 {schoolName}. Seluruh hak cipta dilindungi.</p>
          <div className="flex gap-6 items-center">
            <Link href="#" className="hover:text-white">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-white">Syarat & Ketentuan</Link>
            <Link href="/admin" className="opacity-20 hover:opacity-100 transition-opacity flex items-center gap-1">
              <LogIn className="h-3 w-3" /> Area Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
