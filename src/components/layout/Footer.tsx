
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
  const officialWebsites = settings?.officialWebsites || [];
  const address = settings?.address || "Jl. Pendidikan No. 5, Langke Rembong";
  const phone = settings?.phone || "6285281814006";
  const email = settings?.email || "smpn5lr@gmail.com";

  const socialLinks = [
    { 
      id: "facebook",
      icon: <Facebook className="h-4 w-4" />, 
      href: settings?.facebookUrl || "#" 
    },
    { 
      id: "instagram",
      icon: <Instagram className="h-4 w-4" />, 
      href: settings?.instagramUrl || "#" 
    },
    { 
      id: "tiktok",
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.525.02c1.31-.032 2.612-.012 3.914-.022.072 1.51.523 2.973 1.353 4.24 1.096 1.597 2.647 2.766 4.445 3.32v4.015c-1.352-.142-2.65-.584-3.793-1.32-.977-.63-1.808-1.46-2.44-2.435v7.26c-.035 1.513-.423 2.99-1.127 4.305-.71 1.32-1.742 2.44-2.99 3.253-1.25.815-2.7 1.255-4.204 1.277-1.503.023-3.003-.393-4.305-1.112-1.3-.72-2.42-1.75-3.235-2.997-.813-1.25-1.252-2.7-1.272-4.204-.02-1.503.402-3.002 1.123-4.305.72-1.3 1.75-2.41 2.997-3.226 1.25-.814 2.7-1.253 4.204-1.273a7.435 7.435 0 0 1 3.013.385v4.067c-.822-.267-1.696-.328-2.54-.18-.843.147-1.637.525-2.296 1.09-.658.566-1.162 1.305-1.457 2.13-.295.827-.373 1.714-.226 2.585.147.872.536 1.688 1.123 2.356.586.67 1.34 1.154 2.176 1.398.835.244 1.725.26 2.57.043.844-.217 1.615-.658 2.228-1.272.613-.614 1.04-1.39 1.233-2.238.192-.85.158-1.734-.1-2.57V.02h.001z"/>
        </svg>
      ), 
      href: settings?.tiktokUrl || "#" 
    },
    { 
      id: "youtube",
      icon: <Youtube className="h-4 w-4" />, 
      href: settings?.youtubeUrl || "#" 
    },
  ];

  return (
    <footer className="bg-primary text-white pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
          {/* Brand Column */}
          <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-white p-2 rounded-[1.2rem] shadow-xl shrink-0 flex items-center justify-center w-16 h-16 md:w-20 md:h-20">
                {schoolLogo ? (
                  <div className="relative h-12 w-12">
                    <Image src={schoolLogo} alt="Logo" fill className="object-contain" />
                  </div>
                ) : (
                  <GraduationCap className="h-10 w-10 text-primary" />
                )}
              </div>
              <div className="font-headline font-black text-2xl md:text-3xl tracking-tighter leading-[0.85] uppercase">
                <span className="block">SMPN <span className="text-secondary">5</span></span>
                <span className="block">LANGKE</span>
                <span className="block">REMBONG</span>
              </div>
            </div>

            <p className="text-white/60 text-xs leading-relaxed font-medium max-w-xs mb-4">
              Membangun fondasi pendidikan unggul yang menginspirasi kreativitas bagi masa depan bangsa.
            </p>

            {/* Portal links section right below branding */}
            {officialWebsites.length > 0 && (
              <div className="mb-6 space-y-1.5">
                {officialWebsites.map((web: any, i: number) => (
                  <a 
                    key={i}
                    href={web.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-secondary transition-all flex items-center gap-2 uppercase text-[10px] font-black tracking-widest bg-white/5 p-2 rounded-xl border border-white/10 group"
                  >
                    <Globe className="h-3 w-3 text-secondary" /> 
                    {web.title} 
                    <ExternalLink className="h-3 w-3 ml-auto opacity-30 group-hover:opacity-100" />
                  </a>
                ))}
              </div>
            )}

            <div className="flex gap-2">
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

          {/* Quick Links Column */}
          <div>
            <h4 className="font-headline font-black mb-8 text-[10px] tracking-[0.2em] uppercase text-secondary">Tautan Cepat</h4>
            <ul className="space-y-4 text-sm font-medium text-white/70">
              <li><Link href="/profil" className="hover:text-white transition-colors uppercase tracking-wider">Profil Sekolah</Link></li>
              <li><Link href="/informasi" className="hover:text-white transition-colors uppercase tracking-wider">Informasi Terbaru</Link></li>
              <li><Link href="/ppdb" className="hover:text-white transition-colors uppercase tracking-wider">SPMB Online</Link></li>
              <li><Link href="/galeri" className="hover:text-white transition-colors uppercase tracking-wider">Galeri Kegiatan</Link></li>
            </ul>
          </div>

          {/* Academic Column */}
          <div>
            <h4 className="font-headline font-black mb-8 text-[10px] tracking-[0.2em] uppercase text-secondary">Akademik</h4>
            <ul className="space-y-4 text-sm font-medium text-white/70">
              <li className="hover:text-white transition-colors cursor-pointer uppercase tracking-wider">Kurikulum Merdeka</li>
              <li className="hover:text-white transition-colors cursor-pointer uppercase tracking-wider">E-Learning</li>
              <li className="hover:text-white transition-colors cursor-pointer uppercase tracking-wider">Perpustakaan</li>
              <li><Link href="/ekstrakurikuler" className="hover:text-white transition-colors uppercase tracking-wider">Ekstrakurikuler</Link></li>
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
                <span className="leading-relaxed">{address}</span>
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
