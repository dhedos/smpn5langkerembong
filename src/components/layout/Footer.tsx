"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, ExternalLink, Globe } from "lucide-react";
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

  const schoolName = settings?.schoolName || "";
  const schoolLogo = settings?.schoolLogoUrl;
  const officialWebsites = Array.isArray(settings?.officialWebsites) ? settings.officialWebsites : [];
  
  const address = settings?.address || "";
  const phone = settings?.phone || "-";
  const email = settings?.email || "-";

  // Dynamic Name Splitting for Adaptive Branding
  const nameParts = schoolName.toUpperCase().split(" ");
  const row1 = nameParts.slice(0, 2).join(" ");
  const row2 = nameParts.length > 2 ? nameParts.slice(2).join(" ") : "";

  const socialLinks = [
    { id: "facebook", icon: <Facebook className="h-4 w-4" />, href: settings?.facebookUrl || "#" },
    { id: "instagram", icon: <Instagram className="h-4 w-4" />, href: settings?.instagramUrl || "#" },
    { 
      id: "tiktok", 
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.525.02c1.31-.032 2.612-.012 3.914-.022.072 1.51.523 2.973 1.353 4.24 1.096 1.597 2.647 2.766 4.445 3.32v4.015c-1.352-.142-2.65-.584-3.793-1.32-.977-.63-1.808-1.46-2.44-2.435v7.26c-.035 1.513-.423 2.99-1.127 4.305-.71 1.32-1.742 2.44-2.99 3.253-1.25.815-2.7 1.255-4.204 1.277-1.503.023-3.003-.393-4.305-1.112-1.3-.72-2.42-1.75-3.235-2.997-.813-1.25-1.252-2.7-1.272-4.204-.02-1.503.402-3.002 1.123-4.305.72-1.3 1.75-2.41 2.997-3.226 1.25-.814 2.7-1.253 4.204-1.273a7.435 7.435 0 0 1 3.013.385v4.067c-.822-.267-1.696-.328-2.54-.18-.843.147-1.637.525-2.296 1.09-.658.566-1.162 1.305-1.457 2.13-.295.827-.373 1.714-.226 2.585.147.872.536 1.688 1.123 2.356.586.67 1.34 1.154 2.176 1.398.835.244 1.725.26 2.57.043.844-.217 1.615-.658 2.228-1.272.613-.614 1.04-1.39 1.233-2.238.192-.85.158-1.734-.1-2.57V.02h.001z"/>
        </svg>
      ), 
      href: settings?.tiktokUrl || "#" 
    },
    { id: "youtube", icon: <Youtube className="h-4 w-4" />, href: settings?.youtubeUrl || "#" },
  ];

  return (
    <footer className="bg-primary text-white pt-16 md:pt-20 pb-10 border-t border-white/5 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-12 lg:gap-8 mb-16">
          <div className="flex flex-col space-y-6 lg:col-span-2">
            <div className="flex items-center gap-4 md:gap-5">
              {schoolLogo ? (
                <div className="bg-white p-2 md:p-3 rounded-[1.5rem] md:rounded-[1.8rem] shadow-2xl shrink-0 flex items-center justify-center w-20 h-20 md:w-28 md:h-28">
                  <div className="relative h-14 w-14 md:h-20 md:w-20">
                    <Image src={schoolLogo} alt={`Logo ${schoolName}`} fill className="object-contain" />
                  </div>
                </div>
              ) : null}
              {schoolName && (
                <div className="font-headline font-black text-2xl md:text-5xl tracking-tighter leading-[0.7] uppercase">
                  <span className="block">{row1}</span>
                  <span className="block text-secondary">{row2}</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <p className="text-white/60 text-[10px] leading-relaxed font-bold uppercase tracking-widest max-w-sm">
                Membangun fondasi pendidikan unggul yang menginspirasi kreativitas bagi masa depan bangsa.
              </p>

              {officialWebsites.length > 0 && (
                <div className="flex flex-col gap-2 pt-2">
                  {officialWebsites.map((web: any, i: number) => (
                    <a 
                      key={i}
                      href={web.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white/80 hover:text-secondary transition-all flex items-center gap-2 uppercase text-[9px] font-black tracking-widest bg-white/5 p-3 rounded-xl border border-white/10 group w-fit min-w-[200px]"
                    >
                      <Globe className="h-3.5 w-3.5 text-secondary" /> 
                      <span className="truncate">{web.title || "Portal Resmi"}</span> 
                      <ExternalLink className="h-3 w-3 ml-auto opacity-30 group-hover:opacity-100 shrink-0" />
                    </a>
                  ))}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {socialLinks.map((social) => (
                  <Link 
                    key={social.id} 
                    href={social.href} 
                    target="_blank"
                    className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <h4 className="font-headline font-black mb-6 md:mb-8 text-[11px] tracking-[0.2em] uppercase text-secondary">Tautan Cepat</h4>
            <ul className="space-y-4 md:space-y-5 text-[12px] font-black text-white/70">
              <li><Link href="/profil" className="hover:text-white transition-colors uppercase tracking-[0.1em] block">Profil Sekolah</Link></li>
              <li><Link href="/informasi" className="hover:text-white transition-colors uppercase tracking-[0.1em] block">Informasi Terbaru</Link></li>
              <li><Link href="/ppdb" className="hover:text-white transition-colors uppercase tracking-[0.1em] block">PPDB Online</Link></li>
              <li><Link href="/galeri" className="hover:text-white transition-colors uppercase tracking-[0.1em] block">Galeri Kegiatan</Link></li>
            </ul>
          </div>

          <div className="pt-2">
            <h4 className="font-headline font-black mb-6 md:mb-8 text-[11px] tracking-[0.2em] uppercase text-secondary">Akademik</h4>
            <ul className="space-y-4 md:space-y-5 text-[12px] font-black text-white/70">
              <li className="hover:text-white transition-colors cursor-pointer uppercase tracking-[0.1em] block">Kurikulum Merdeka</li>
              <li className="hover:text-white transition-colors cursor-pointer uppercase tracking-[0.1em] block">E-Learning</li>
              <li className="hover:text-white transition-colors cursor-pointer uppercase tracking-[0.1em] block">Perpustakaan</li>
              <li><Link href="/ekstrakurikuler" className="hover:text-white transition-colors uppercase tracking-[0.1em] block">Ekstrakurikuler</Link></li>
            </ul>
          </div>

          <div className="pt-2">
            <h4 className="font-headline font-black mb-6 md:mb-8 text-[11px] tracking-[0.2em] uppercase text-secondary">Hubungi Kami</h4>
            <ul className="space-y-5 md:space-y-6 text-[12px] text-white/80 font-black tracking-wide">
              {address && (
                <li className="flex gap-4 items-start">
                  <div className="bg-white/5 p-2 md:p-2.5 rounded-xl shrink-0 mt-0.5">
                    <MapPin className="h-4 w-4 text-secondary" /> 
                  </div>
                  <span className="leading-relaxed uppercase tracking-tighter break-words">{address}</span>
                </li>
              )}
              <li className="flex gap-4 items-center">
                <div className="bg-white/5 p-2 md:p-2.5 rounded-xl shrink-0">
                  <Phone className="h-4 w-4 text-secondary" /> 
                </div>
                <span>{phone}</span>
              </li>
              <li className="flex gap-4 items-center">
                <div className="bg-white/5 p-2 md:p-2.5 rounded-xl shrink-0">
                  <Mail className="h-4 w-4 text-secondary" /> 
                </div>
                <span className="break-all lowercase">{email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black text-white/30 tracking-[0.2em] uppercase text-center md:text-left">
          <p>© {displayYear} {schoolName ? schoolName.toUpperCase() : "OFFICIAL PORTAL"}. ALL RIGHTS RESERVED.</p>
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
