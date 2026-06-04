
"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { GraduationCap, Facebook, Instagram, Youtube, MapPin, Phone, Mail, LogIn } from "lucide-react";
import { useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";

// Simple TikTok SVG icon
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export function Footer() {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");

  const db = useFirestore();
  const currentSchoolId = 'smpn5-langke-rembong';
  const settingsRef = useMemo(() => db ? doc(db, "schools", currentSchoolId) : null, [db]);
  const { data: settings } = useDoc(settingsRef);

  const displayYear = useMemo(() => {
    return settings?.copyrightYear || new Date().getFullYear().toString();
  }, [settings?.copyrightYear]);

  if (isAdminPage) return null;

  const schoolName = settings?.schoolName || "SMPN 5 Langke Rembong";
  const schoolLogo = settings?.schoolLogoUrl;
  const address = settings?.address || "Jl. Pendidikan No. 45, Jakarta Selatan";
  const phone = settings?.phone || "(021) 1234-5678";
  const email = settings?.email || "info@sekolah.sch.id";

  const socialLinks = [
    { icon: Facebook, href: settings?.facebookUrl || "#" },
    { icon: Instagram, href: settings?.instagramUrl || "#" },
    { icon: TikTokIcon, href: settings?.tiktokUrl || "#" },
    { icon: Youtube, href: settings?.youtubeUrl || "#" },
  ];

  const akademikLinks = [
    { name: "Kurikulum Merdeka", href: "#" },
    { name: "E-Learning", href: "#" },
    { name: "Perpustakaan", href: "#" },
    { name: "Ekstrakurikuler", href: "/ekstrakurikuler" },
  ];

  return (
    <footer className="bg-primary text-white pt-24 pb-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Column 1: Info */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="bg-white p-2.5 rounded-2xl">
                {schoolLogo ? (
                  <div className="relative h-8 w-8"><Image src={schoolLogo} alt="Logo" fill className="object-contain" /></div>
                ) : (
                  <GraduationCap className="h-8 w-8 text-primary" />
                )}
              </div>
              <span className="font-headline font-bold text-2xl tracking-tighter">
                {schoolName}
              </span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed font-medium">
              Membangun fondasi pendidikan unggul yang menginspirasi kreativitas bagi masa depan bangsa.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, i) => (
                <Link 
                  key={i} 
                  href={social.href} 
                  target={social.href !== "#" ? "_blank" : undefined}
                  className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-secondary hover:text-primary transition-all"
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:pl-8">
            <h4 className="font-headline font-bold mb-10 text-xs tracking-[0.2em] uppercase text-secondary">Tautan Cepat</h4>
            <ul className="space-y-5 text-sm font-bold text-primary-foreground/60">
              <li key="beranda"><Link href="/" className="hover:text-white transition-colors">Beranda</Link></li>
              <li key="profil"><Link href="/profil" className="hover:text-white transition-colors">Profil Sekolah</Link></li>
              <li key="informasi"><Link href="/informasi" className="hover:text-white transition-colors">Informasi Terbaru</Link></li>
              <li key="spmb"><Link href="/ppdb" className="hover:text-white transition-colors">SPMB Online</Link></li>
            </ul>
          </div>

          {/* Column 3: Akademik */}
          <div className="lg:pl-4">
            <h4 className="font-headline font-bold mb-10 text-xs tracking-[0.2em] uppercase text-secondary">Akademik</h4>
            <ul className="space-y-5 text-sm font-bold text-primary-foreground/60">
              {akademikLinks.map((item) => (
                <li key={item.name}>
                  {item.href === "#" ? (
                    <span className="hover:text-white transition-colors cursor-pointer">{item.name}</span>
                  ) : (
                    <Link href={item.href} className="hover:text-white transition-colors">
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Hubungi Kami */}
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
          <p>© {displayYear} {schoolName.toUpperCase()}. ALL RIGHTS RESERVED.</p>
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
