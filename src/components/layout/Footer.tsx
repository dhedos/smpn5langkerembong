"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { GraduationCap, Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail, LogIn, ArrowRight } from "lucide-react";
import { useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";

export function Footer() {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");

  const db = useFirestore();
  const settingsRef = useMemo(() => db ? doc(db, "settings", "general") : null, [db]);
  const { data: settings } = useDoc(settingsRef);

  if (isAdminPage) return null;

  const schoolName = settings?.schoolName || "SMPN 5 Langke Rembong";
  const schoolLogo = settings?.schoolLogoUrl;
  const address = settings?.address || "Jl. Pendidikan No. 45, Jakarta Selatan";
  const phone = settings?.phone || "(021) 1234-5678";
  const email = settings?.email || "info@sekolah.sch.id";

  return (
    <footer className="bg-primary text-white pt-24 pb-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Column 1: Info */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-4">
              <div className="bg-white p-2.5 rounded-2xl">
                {schoolLogo ? (
                  <div className="relative h-8 w-8"><Image src={schoolLogo} alt="Logo" fill className="object-contain" /></div>
                ) : (
                  <GraduationCap className="h-8 w-8 text-primary" />
                )}
              </div>
              <span className="font-headline font-bold text-2xl tracking-tighter">
                {schoolName.split(" ").map((w, i) => (
                   <span key={i} className={i === 1 || w === "5" ? "text-secondary" : ""}>{w}{" "}</span>
                ))}
              </span>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed font-medium">
              Membangun fondasi pendidikan unggul yang menginspirasi kreativitas bagi masa depan bangsa.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <Link key={i} href="#" className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-secondary hover:text-primary transition-all">
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:pl-8">
            <h4 className="font-headline font-bold mb-10 text-xs tracking-[0.2em] uppercase text-secondary">Tautan Cepat</h4>
            <ul className="space-y-5 text-sm font-bold text-primary-foreground/60">
              {["Profil Sekolah", "Berita & Acara", "SPMB Online", "Galeri Kegiatan"].map((item) => (
                <li key={item}><Link href="#" className="hover:text-white transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          {/* Column 3: Academic */}
          <div className="lg:pl-4">
            <h4 className="font-headline font-bold mb-10 text-xs tracking-[0.2em] uppercase text-secondary">Akademik</h4>
            <ul className="space-y-5 text-sm font-bold text-primary-foreground/60">
              {["Kurikulum Merdeka", "E-Learning", "Perpustakaan", "Ekstrakurikuler"].map((item) => (
                <li key={item}><Link href="#" className="hover:text-white transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="font-headline font-bold mb-10 text-xs tracking-[0.2em] uppercase text-secondary">Hubungi Kami</h4>
            <ul className="space-y-6 text-sm text-primary-foreground/90 font-medium">
              <li className="flex gap-4 items-start"><MapPin className="h-5 w-5 text-secondary shrink-0" /> {address}</li>
              <li className="flex gap-4 items-center"><Phone className="h-5 w-5 text-secondary shrink-0" /> {phone}</li>
              <li className="flex gap-4 items-center"><Mail className="h-5 w-5 text-secondary shrink-0" /> {email}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold text-primary-foreground/40 tracking-[0.2em] uppercase">
          <p>© 2024 {schoolName.toUpperCase()}. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-10 items-center">
            <Link href="/admin" className="opacity-30 hover:opacity-100 transition-all flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <LogIn className="h-3 w-3" /> ADMIN CONSOLE
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
