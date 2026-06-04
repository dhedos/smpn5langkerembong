
"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { GraduationCap, Facebook, Instagram, Youtube, MapPin, Phone, Mail, ExternalLink, Globe } from "lucide-react";
import { useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";

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
  const officialWebsite = settings?.officialWebsiteUrl;
  const officialWebsiteTitle = settings?.officialWebsiteTitle || "PORTAL RESMI INSTANSI";
  const address = settings?.address || "Jl. Pendidikan No. 5, Langke Rembong";
  const phone = settings?.phone || "6285281814006";
  const email = settings?.email || "smpn5lr@gmail.com";

  const socialLinks = [
    { icon: Facebook, href: settings?.facebookUrl || "#" },
    { icon: Instagram, href: settings?.instagramUrl || "#" },
    { icon: Youtube, href: settings?.youtubeUrl || "#" },
  ];

  const renderFormattedName = (name: string) => {
    if (name.includes('SMPN 5')) {
      return (
        <div className="font-headline font-black text-2xl md:text-3xl tracking-tighter leading-[1.1] uppercase">
          <span className="text-white">SMPN </span>
          <span className="text-secondary">5</span>
          <span className="text-white"> Langke</span>
          <br />
          <span className="text-white">Rembong</span>
        </div>
      );
    }
    // Fallback standard split if name is different
    const words = name.split(' ');
    return (
      <div className="font-headline font-black text-2xl md:text-3xl tracking-tighter leading-[1.1] uppercase">
        {words.slice(0, Math.ceil(words.length / 2)).join(' ')}
        <br />
        {words.slice(Math.ceil(words.length / 2)).join(' ')}
      </div>
    );
  };

  return (
    <footer className="bg-primary text-white pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="flex flex-col">
            <div className="flex items-center gap-5 mb-6">
              <div className="bg-white p-3 rounded-[1.5rem] shadow-xl shrink-0 flex items-center justify-center w-20 h-20 md:w-24 md:h-24">
                {schoolLogo ? (
                  <div className="relative h-14 w-14">
                    <Image src={schoolLogo} alt="Logo" fill className="object-contain" />
                  </div>
                ) : (
                  <GraduationCap className="h-12 w-12 text-primary" />
                )}
              </div>
              {renderFormattedName(schoolName)}
            </div>
            
            <p className="text-white/60 text-xs leading-relaxed font-medium max-w-xs mb-6">
              Membangun fondasi pendidikan unggul yang menginspirasi kreativitas bagi masa depan bangsa.
            </p>

            <div className="flex gap-2">
              {socialLinks.map((social, i) => (
                <Link 
                  key={i} 
                  href={social.href} 
                  target="_blank"
                  className="h-10 w-10 rounded-[0.75rem] bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-headline font-black mb-8 text-[10px] tracking-[0.2em] uppercase text-secondary">Tautan Cepat</h4>
            <ul className="space-y-4 text-sm font-medium text-white/70">
              <li><Link href="/profil" className="hover:text-white transition-colors">Profil Sekolah</Link></li>
              <li><Link href="/informasi" className="hover:text-white transition-colors">Informasi Terbaru</Link></li>
              <li><Link href="/ppdb" className="hover:text-white transition-colors">SPMB Online</Link></li>
              <li><Link href="/galeri" className="hover:text-white transition-colors">Galeri Kegiatan</Link></li>
            </ul>
          </div>

          {/* Academic Column */}
          <div>
            <h4 className="font-headline font-black mb-8 text-[10px] tracking-[0.2em] uppercase text-secondary">Akademik</h4>
            <ul className="space-y-4 text-sm font-medium text-white/70">
              <li><span className="hover:text-white transition-colors cursor-pointer">Kurikulum Merdeka</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">E-Learning</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Perpustakaan</span></li>
              <li><Link href="/ekstrakurikuler" className="hover:text-white transition-colors">Ekstrakurikuler</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-headline font-black mb-8 text-[10px] tracking-[0.2em] uppercase text-secondary">Hubungi Kami</h4>
            <ul className="space-y-5 text-sm text-white/80 font-medium">
              <li className="flex gap-4 items-start">
                <div className="bg-white/5 p-2 rounded-lg">
                  <MapPin className="h-4 w-4 text-secondary shrink-0" /> 
                </div>
                <span className="leading-relaxed pt-1">{address}</span>
              </li>
              <li className="flex gap-4 items-center">
                <div className="bg-white/5 p-2 rounded-lg">
                  <Phone className="h-4 w-4 text-secondary shrink-0" /> 
                </div>
                <span>{phone}</span>
              </li>
              <li className="flex gap-4 items-center">
                <div className="bg-white/5 p-2 rounded-lg">
                  <Mail className="h-4 w-4 text-secondary shrink-0" /> 
                </div>
                <span>{email}</span>
              </li>
              {officialWebsite && (
                <li className="flex gap-4 items-center pt-2 border-t border-white/5 mt-4">
                  <div className="bg-white/5 p-2 rounded-lg">
                    <Globe className="h-4 w-4 text-secondary shrink-0" /> 
                  </div>
                  <a 
                    href={officialWebsite} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-secondary transition-all flex items-center gap-2 uppercase text-[10px] font-black tracking-widest"
                  >
                    {officialWebsiteTitle} <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-white/30 tracking-[0.2em] uppercase">
          <p>© {displayYear} {schoolName}. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6 items-center">
            <Link href="/admin" className="opacity-30 hover:opacity-100 transition-all flex items-center gap-2">
              ADMIN CONSOLE
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
