"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GraduationCap, Users, Award, BookOpen, Calendar, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDoc, useCollection, useFirestore } from "@/firebase";
import { doc, collection, query, limit, orderBy, where } from "firebase/firestore";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, any> = { Users, GraduationCap, Award, BookOpen };

export default function Home() {
  const db = useFirestore();
  
  // Default to a demo school if not specified. In production, this would be dynamic via domain or path.
  const currentSchoolId = 'default-school';
  const settingsRef = useMemo(() => db ? doc(db, "schools", currentSchoolId) : null, [db]);
  const { data: settings } = useDoc(settingsRef);

  const newsQuery = useMemo(() => db ? query(collection(db, "news"), where("schoolId", "==", currentSchoolId), orderBy("date", "desc"), limit(3)) : null, [db]);
  const { data: newsItems } = useCollection(newsQuery);

  const heroImageUrl = settings?.heroImageUrl || "https://picsum.photos/seed/school1/1920/1080";
  const schoolName = settings?.schoolName || "Goetnik Nusantara";

  return (
    <div className="flex flex-col gap-0">
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-slate-950">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url('${heroImageUrl}')`, backgroundAttachment: 'fixed', transitionDuration: '4s' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent z-[1]" />
        <div className="container relative z-10 px-6 md:px-12 mx-auto pb-48 pt-32">
          <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-left duration-1000">
            <h1 className="text-6xl md:text-[7rem] font-bold text-white font-headline leading-[0.9] tracking-tighter uppercase">
              {settings?.heroTitle || "Pendidikan Modern"} <br/>
              <span className="text-secondary italic font-light">{schoolName}</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/70 max-w-2xl leading-relaxed font-medium">
              {settings?.heroSubtitle || "Membangun ekosistem pendidikan yang unggul dan inovatif secara global."}
            </p>
            <div className="flex flex-wrap gap-6 pt-6">
              <Button size="lg" className="bg-secondary text-primary font-bold hover:bg-secondary/90 px-12 py-8 text-xl rounded-full shadow-2xl group border-none" asChild>
                <Link href="/ppdb" className="flex items-center gap-3">
                  SPMB ONLINE <ArrowRight className="h-6 w-6 group-hover:translate-x-3 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-40 bg-white">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <div className="inline-block bg-slate-100 text-slate-500 font-bold tracking-widest uppercase text-[9px] px-6 py-3 rounded-full mb-8">Sambutan Kepala Sekolah</div>
          <h2 className="text-5xl md:text-[4.5rem] font-bold text-primary leading-[1] font-headline tracking-tighter mb-12">Mendidik dengan <span className="text-secondary italic">Hati & Inovasi</span></h2>
          <div className="max-w-3xl mx-auto text-slate-600 text-xl leading-relaxed font-medium italic">
             "{settings?.welcomeMessage || "Selamat datang di website resmi kami. Bersama GN Nusantara, kita ciptakan masa depan cemerlang."}"
          </div>
          <div className="mt-12">
            <div className="font-bold text-3xl text-primary font-headline tracking-tight">{settings?.headmasterName || "Kepala Sekolah"}</div>
            <div className="text-secondary font-bold uppercase text-[10px] tracking-widest mt-2">{settings?.headmasterTitle || "Global Administrator"}</div>
          </div>
        </div>
      </section>
    </div>
  );
}