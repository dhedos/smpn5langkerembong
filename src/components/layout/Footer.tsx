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
  const address = settings?.address || "Jl. Pendidikan No. 45,\nJakarta Selatan, DKI\nJakarta";
  const phone = settings?.phone || "(021) 1234-5678";
  const email = settings?.email || "info@sekolah.sch.id";

  return (
    <footer className="bg-primary text-white pt-24 pb-12 relative overflow-hidden">
      {/* Background patterns for precision design */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* School Info */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-4">
              <div className="bg-white p-2.5 rounded-2xl shadow-xl transform rotate-3 hover:rotate-0 transition-transform">
                {schoolLogo ? (
                  <div className="relative h-8 w-8">
                    <Image src={schoolLogo} alt="Logo" fill className="object-contain" />
                  </div>
                ) : (
                  <GraduationCap className="h-8 w-8 text-primary" />
                )}
              </div>
              <span className="font-headline font-bold text-2xl tracking-tighter leading-none">
                {schoolName.split(" ").map((w, i) => (
                   <span key={i} className={i === 1 || w === "5" ? "text-secondary" : ""}>{w}{" "}</span>
                ))}
              </span>
            </Link>
            <p className="text-primary-foreground/70 text-[15px] leading-relaxed max-w-sm font-medium">
              Membangun fondasi pendidikan unggul yang menginspirasi kreativitas, inovasi, dan integritas bagi masa depan generasi bangsa.
            </p>
            <div className="flex gap-4 pt-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <Link key={i} href="#" className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-secondary hover:text-primary hover:border-secondary transition-all transform hover:-translate-y-1">
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-8">
            <h4 className="font-headline font-bold mb-10 text-xl tracking-tight flex items-center gap-2 uppercase text-xs tracking-[0.2em] text-secondary">
              <div className="w-8 h-px bg-secondary" /> Tautan Cepat
            </h4>
            <ul className="space-y-5 text-[15px] font-bold text-primary-foreground/60">
              {[
                { name: "Profil Sekolah", href: "/profil" },
                { name: "Berita & Acara", href: "/berita" },
                { name: "PPDB Online", href: "/ppdb" },
                { name: "Galeri Kegiatan", href: "/galeri" },
                { name: "Kontak Kami", href: "#" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white flex items-center gap-2 group transition-colors">
                    <ArrowRight className="h-3 w-3 text-secondary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Academic */}
          <div className="lg:pl-4">
            <h4 className="font-headline font-bold mb-10 text-xl tracking-tight flex items-center gap-2 uppercase text-xs tracking-[0.2em] text-secondary">
              <div className="w-8 h-px bg-secondary" /> Akademik
            </h4>
            <ul className="space-y-5 text-[15px] font-bold text-primary-foreground/60">
              {[
                { name: "Kurikulum Merdeka", href: "#" },
                { name: "E-Learning", href: "#" },
                { name: "Perpustakaan", href: "#" },
                { name: "Kalender Akademik", href: "#" },
                { name: "Ekstrakurikuler", href: "#" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white flex items-center gap-2 group transition-colors">
                    <ArrowRight className="h-3 w-3 text-secondary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-headline font-bold mb-10 text-xl tracking-tight flex items-center gap-2 uppercase text-xs tracking-[0.2em] text-secondary">
              <div className="w-8 h-px bg-secondary" /> Hubungi Kami
            </h4>
            <ul className="space-y-6 text-[15px] text-primary-foreground/90 font-medium">
              <li className="flex gap-5 items-start group">
                <div className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-secondary group-hover:text-primary transition-all">
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="whitespace-pre-line leading-relaxed pt-1">{address}</span>
              </li>
              <li className="flex gap-5 items-center group">
                <div className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-secondary group-hover:text-primary transition-all">
                  <Phone className="h-5 w-5" />
                </div>
                <span className="font-bold">{phone}</span>
              </li>
              <li className="flex gap-5 items-center group">
                <div className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-secondary group-hover:text-primary transition-all">
                  <Mail className="h-5 w-5" />
                </div>
                <span className="font-bold">{email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[13px] font-bold text-primary-foreground/40 tracking-wider">
          <p className="uppercase">© 2024 {schoolName.toUpperCase()}. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-10 items-center">
            <Link href="#" className="hover:text-white transition-colors">PRIVACY POLICY</Link>
            <Link href="#" className="hover:text-white transition-colors">TERMS OF SERVICE</Link>
            <Link href="/admin" className="opacity-30 hover:opacity-100 transition-all flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 hover:border-white/20">
              <LogIn className="h-3.5 w-3.5" /> ADMIN CONSOLE
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}