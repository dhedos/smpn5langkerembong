"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  GraduationCap, 
  Users, 
  UserCircle, 
  Briefcase, 
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";

const IconMap: Record<string, any> = {
  GraduationCap: GraduationCap,
  Users: Users,
  UserCircle: UserCircle,
  Briefcase: Briefcase,
};

export default function Home() {
  const db = useFirestore();
  const currentSchoolId = 'smpn5-langke-rembong';
  const settingsRef = useMemo(() => db ? doc(db, "schools", currentSchoolId) : null, [db, currentSchoolId]);
  const { data: settings } = useDoc(settingsRef);

  const schoolName = settings?.schoolName || "SMPN 5 LANGKE REMBONG";
  const heroImageUrl = settings?.heroImageUrl;
  const heroBadgeText = settings?.heroBadgeText || "Selamat Datang di Website Resmi Kami";
  const heroTitle = settings?.heroTitle || "MEMBANGUN MASA DEPAN BERSAMA KAMI";
  const heroSubtitle = settings?.heroSubtitle || "Pendidikan berkualitas untuk generasi emas bangsa melalui kurikulum yang inovatif.";
  
  const isSpmbActive = settings?.ppdbIsActive !== false;

  const stats = settings?.stats || [
    { label: "Guru", value: "0", icon: "GraduationCap" },
    { label: "Tenaga Pendidik", value: "0", icon: "Users" },
    { label: "Siswa", value: "0", icon: "UserCircle" }
  ];

  return (
    <div className="flex flex-col gap-0 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0 transition-opacity duration-1000">
           {heroImageUrl && (
             <Image 
              src={heroImageUrl} 
              alt="Hero image" 
              fill 
              className="object-cover" 
              priority 
              quality={90}
            />
           )}
        </div>
        <div className="absolute inset-0 bg-slate-950/60 md:bg-gradient-to-r md:from-slate-950 md:via-slate-950/70 md:to-transparent z-[1]" />
        
        <div className="container relative z-10 px-6 md:px-12 mx-auto pb-32 pt-40 md:pt-48">
          <div className="max-w-5xl space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-secondary px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 shadow-2xl">
                <Sparkles className="h-4 w-4" /> {heroBadgeText}
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[7.5rem] font-black text-white font-headline leading-[1.1] md:leading-[0.85] tracking-tight md:tracking-tighter uppercase drop-shadow-2xl">
                  {heroTitle}
                </h1>
                <div className="text-2xl sm:text-3xl md:text-5xl font-bold text-secondary italic tracking-tight drop-shadow-lg lowercase mt-2 md:mt-4 opacity-90">
                  {schoolName}
                </div>
              </div>
            </div>
            
            <p className="text-base md:text-xl text-white/90 max-w-2xl leading-relaxed font-medium drop-shadow-md border-l-4 border-secondary pl-6">
              {heroSubtitle}
            </p>
            
            <div className="flex flex-wrap gap-4 md:gap-6 pt-6 md:pt-10">
              {isSpmbActive && (
                <Button size="lg" className="bg-secondary text-primary font-bold hover:bg-secondary/90 px-8 md:px-10 py-6 md:py-7 text-base md:text-lg rounded-full shadow-2xl group border-none" asChild>
                  <Link href="/ppdb" className="flex items-center gap-3">
                    {settings?.ppdbMenuTitle || "SPMB ONLINE"} <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Button>
              )}
              <Button size="lg" className="bg-white text-primary font-bold hover:bg-slate-100 px-8 md:px-10 py-6 md:py-7 text-base md:text-lg rounded-full shadow-xl transition-all border-none" asChild>
                <Link href="/profil">Pelajari Profil Kami</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-20 -mt-12 md:-mt-24 px-6 md:px-12 container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {stats.map((stat: any, idx: number) => {
            const Icon = IconMap[stat.icon] || Users;
            return (
              <div key={idx} className="bg-white p-5 md:p-10 rounded-2xl md:rounded-[3rem] shadow-xl border border-slate-100 flex flex-row md:flex-col items-center md:justify-center md:text-center gap-5 md:space-y-4 hover:translate-y-[-5px] transition-all duration-500">
                <div className="bg-secondary/10 p-3 md:p-5 rounded-xl md:rounded-3xl shrink-0">
                  <Icon className="h-6 w-6 md:h-10 md:w-10 text-secondary" />
                </div>
                <div className="space-y-0 md:space-y-1 text-left md:text-center">
                  <div className="text-2xl md:text-5xl font-bold text-primary font-headline tracking-tighter leading-none">{stat.value}</div>
                  <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
