
"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink, 
  Globe, 
  Link as LinkIcon 
} from "lucide-react";
import { useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";

export function Footer() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  const db = useFirestore();
  const currentSchoolId = 'smpn5-langke-rembong';
  const settingsRef = useMemo(() => db ? doc(db, "schools", currentSchoolId) : null, [db, currentSchoolId]);
  const { data: settings } = useDoc(settingsRef);

  if (isAdminPage) return null;

  const schoolName = settings?.schoolName || "SMPN 5 LANGKE REMBONG";
  const schoolLogo = settings?.schoolLogoUrl;
  const officialWebsites = Array.isArray(settings?.officialWebsites) ? settings.officialWebsites : [];
  const otherMedia = Array.isArray(settings?.otherMedia) ? settings.otherMedia : [];
  const displayYear = settings?.copyrightYear || new Date().getFullYear().toString();
  
  const address = settings?.address || "";
  const phone = settings?.phone || "";
  const email = settings?.email || "";

  const nameParts = schoolName.toUpperCase().split(" ");
  const row1 = nameParts.slice(0, 2).join(" ");
  const row2 = nameParts.length > 2 ? nameParts.slice(2).join(" ") : "";

  const ensureExternalUrl = (url: string | undefined) => {
    if (!url || url === "#" || url === "") return "#";
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  const socialLinks = [
    { id: "facebook", icon: <Facebook className="h-4 w-4" />, href: ensureExternalUrl(settings?.facebookUrl) },
    { id: "instagram", icon: <Instagram className="h-4 w-4" />, href: ensureExternalUrl(settings?.instagramUrl) },
    { id: "youtube", icon: <Youtube className="h-4 w-4" />, href: ensureExternalUrl(settings?.youtubeUrl) },
  ];

  return (
    <footer className="bg-primary text-white pt-16 md:pt-20 pb-10 border-t border-white/5 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 md:gap-16 lg:gap-20 mb-16">
          <div className="flex flex-col space-y-6 md:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-5">
              <div className="relative h-16 w-16 md:h-20 md:w-20 shrink-0 flex items-center justify-center">
                {schoolLogo && (
                  <Image 
                    src={schoolLogo} 
                    alt="Logo" 
                    fill 
                    className="object-contain" 
                  />
                )}
              </div>
              <div className="font-headline font-black text-2xl md:text-3xl lg:text-5xl tracking-tight leading-[0.85] uppercase">
                <span className="block">{row1}</span>
                <span className="block text-secondary">{row2}</span>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-white/60 text-[10px] leading-relaxed font-bold uppercase tracking-widest max-w-sm">
                Membangun fondasi pendidikan unggul yang menginspirasi kreativitas bagi masa depan bangsa.
              </p>

              <div className="space-y-4">
                <div className="space-y-3">
                  <span className="text-[11px] font-black text-secondary tracking-widest uppercase">IKUTI KAMI</span>
                  <div className="flex gap-2">
                    {socialLinks.map((social) => (
                      <a 
                        key={social.id} 
                        href={social.href} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-105"
                      >
                        {social.icon}
                      </a>
                    ))}
                    <div className="h-10 w-10 rounded-xl bg-secondary text-primary flex items-center justify-center shadow-xl cursor-default ml-2">
                      <Globe className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-8 pt-6 border-t border-white/10">
                  <div className="space-y-4">
                    <span className="text-[11px] font-black text-secondary tracking-widest uppercase">Portal Resmi Instansi</span>
                    <div className="flex flex-wrap gap-2">
                      {officialWebsites.map((web: any, i: number) => (
                        <a 
                          key={i}
                          href={ensureExternalUrl(web.url)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-white/90 hover:text-secondary transition-all flex items-center gap-2 uppercase text-[9px] font-black tracking-widest bg-white/5 px-4 py-3 rounded-xl border border-white/10 group"
                        >
                          <LinkIcon className="h-3 w-3 text-secondary" /> 
                          <span className="truncate max-w-[150px]">{web.title || "Portal"}</span> 
                          <ExternalLink className="h-3 w-3 opacity-30 group-hover:opacity-100" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <h4 className="font-headline font-black mb-8 text-[11px] tracking-[0.2em] uppercase text-secondary">Hubungi Kami</h4>
            <ul className="space-y-6 text-[12px] text-white/80 font-black tracking-wide">
              {address && (
                <li className="flex gap-4 items-start">
                  <div className="bg-white/5 p-2.5 rounded-xl shrink-0 mt-0.5"><MapPin className="h-4 w-4 text-secondary" /></div>
                  <span className="leading-relaxed uppercase tracking-tighter break-words">{address}</span>
                </li>
              )}
              <li className="flex gap-4 items-center">
                <div className="bg-white/5 p-2.5 rounded-xl shrink-0"><Phone className="h-4 w-4 text-secondary" /></div>
                <span>{phone}</span>
              </li>
              <li className="flex gap-4 items-center">
                <div className="bg-white/5 p-2.5 rounded-xl shrink-0"><Mail className="h-4 w-4 text-secondary" /></div>
                <span className="break-all lowercase">{email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black text-white/30 tracking-[0.2em] uppercase text-center md:text-left">
          <p>© {displayYear} {schoolName.toUpperCase()}. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6 items-center">
            <Link href="/admin" className="opacity-30 hover:opacity-100 transition-all">ADMIN CONSOLE</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
