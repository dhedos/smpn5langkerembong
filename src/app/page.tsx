
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GraduationCap, Users, Award, BookOpen, Calendar, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDoc, useCollection, useFirestore } from "@/firebase";
import { doc, collection, query, limit, orderBy } from "firebase/firestore";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, any> = {
  Users,
  GraduationCap,
  Award,
  BookOpen,
};

export default function Home() {
  const db = useFirestore();
  
  const settingsRef = useMemo(() => db ? doc(db, "settings", "general") : null, [db]);
  const { data: settings } = useDoc(settingsRef);

  const newsQuery = useMemo(() => db ? query(collection(db, "news"), orderBy("date", "desc"), limit(3)) : null, [db]);
  const { data: newsItems } = useCollection(newsQuery);

  const facilitiesQuery = useMemo(() => db ? query(collection(db, "facilities"), limit(4)) : null, [db]);
  const { data: facilities } = useCollection(facilitiesQuery);

  const defaultStats = [
    { label: "Siswa Aktif", value: "850+", icon: "Users" },
    { label: "Guru & Staff", value: "65+", icon: "GraduationCap" },
    { label: "Prestasi Siswa", value: "120+", icon: "Award" },
    { label: "Ekstrakurikuler", value: "24", icon: "BookOpen" },
  ];

  const displayStats = settings?.stats?.length > 0 ? settings.stats : defaultStats;
  const heroImageUrl = settings?.heroImageUrl || "https://picsum.photos/seed/school1/1920/1080";

  return (
    <div className="flex flex-col gap-0">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-slate-950">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[4000ms] hover:scale-105 opacity-60"
          style={{ backgroundImage: `url('${heroImageUrl}')`, backgroundAttachment: 'fixed' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent z-[1]" />
        
        <div className="container relative z-10 px-6 md:px-12 mx-auto pb-48 pt-32">
          <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-left duration-1000">
            <h1 className="text-6xl md:text-[7rem] font-bold text-white font-headline leading-[0.9] tracking-tighter">
              {settings?.heroTitle || "Wujudkan Masa Depan"} <br/>
              <span className="text-secondary italic font-light">{settings?.schoolName || "SMPN 5 LR"}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/70 max-w-2xl leading-relaxed font-medium">
              {settings?.heroSubtitle || "Sekolah dengan komitmen tinggi dalam mencetak generasi cerdas, berintegritas, dan kompetitif."}
            </p>
            
            <div className="flex flex-wrap gap-6 pt-6">
              <Button size="lg" className="bg-secondary text-primary font-bold hover:bg-secondary/90 px-12 py-8 text-xl rounded-full shadow-2xl group border-none" asChild>
                <Link href="/ppdb" className="flex items-center gap-3">
                  Daftar Sekarang <ArrowRight className="h-6 w-6 group-hover:translate-x-3 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" className="bg-white text-primary hover:bg-slate-100 px-12 py-8 text-xl rounded-full font-bold transition-all shadow-xl border-none" asChild>
                <Link href="/profil" className="flex items-center gap-3">
                  <Play className="h-5 w-5 fill-current text-secondary" /> Lihat Profil
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-24 z-20 px-6 mb-32">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayStats.map((stat: any, i: number) => {
            const Icon = iconMap[stat.icon] || Users;
            return (
              <Card key={i} className="bg-white border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] hover:translate-y-[-8px] transition-all duration-500 rounded-[4rem] group overflow-hidden">
                <CardContent className="p-8 md:p-10 flex flex-col items-center text-center space-y-6">
                  <div className="p-4 bg-slate-50 rounded-[1.5rem] transition-colors duration-500">
                    <Icon className="h-7 w-7 text-primary/80" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-5xl md:text-6xl font-bold text-slate-900 font-headline tracking-tighter">
                      {stat.value}
                    </div>
                    <div className="text-[9px] text-slate-400 font-extrabold uppercase tracking-[0.25em] pt-1">
                      {stat.label}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Sambutan Section */}
      <section className="py-40 bg-white overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-32">
            <div className="w-full lg:w-1/2 relative">
              <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-2xl border-[15px] border-slate-50 group">
                <Image
                  src={settings?.headmasterPhotoUrl || "https://picsum.photos/seed/headmaster/600/750"}
                  alt="Kepala Sekolah"
                  width={600}
                  height={750}
                  className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                />
              </div>
            </div>
            <div className="w-full lg:w-1/2 space-y-10">
              <div className="inline-block bg-slate-100 text-slate-500 font-bold tracking-widest uppercase text-[9px] px-6 py-3 rounded-full">{settings?.welcomeTitle || "Sambutan Kepala Sekolah"}</div>
              <h2 className="text-5xl md:text-[4.5rem] font-bold text-primary leading-[1] font-headline tracking-tighter">
                Mendidik dengan <br/> <span className="text-secondary italic">Hati & Inovasi</span>
              </h2>
              <p className="text-slate-600 text-xl leading-relaxed font-medium italic pl-12 relative">
                <span className="absolute left-0 top-0 text-[8rem] text-secondary/20 font-serif leading-none -translate-y-10">“</span>
                {settings?.welcomeMessage || "Visi kami adalah menciptakan ekosistem pendidikan yang unggul dan berkarakter."}
              </p>
              <div className="pt-10">
                 <div className="font-bold text-3xl text-primary font-headline tracking-tight">{settings?.headmasterName || "Dr. Ahmad Hidayat, M.Pd."}</div>
                 <div className="text-secondary font-bold uppercase text-[10px] tracking-widest mt-2">{settings?.headmasterTitle || "Kepala Sekolah"}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights & News */}
      <section className="py-40 bg-slate-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-10">
            <div className="space-y-6">
              <div className="text-secondary font-bold tracking-widest uppercase text-[9px]">Update Informasi</div>
              <h2 className="text-5xl md:text-[5rem] font-bold text-primary font-headline tracking-tighter leading-none">Informasi Terbaru</h2>
            </div>
            <Button variant="outline" className="rounded-full px-10 py-8 text-lg font-bold border-slate-200 text-slate-600 hover:bg-primary hover:text-white transition-all shadow-xl bg-white" asChild>
              <Link href="/berita" className="flex items-center gap-4">Lihat Semua Informasi <ChevronRight className="h-5 w-5" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {newsItems?.map((item: any) => (
              <Card key={item.id} className="group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-700 rounded-[3rem] bg-white flex flex-col h-full">
                <div className="relative h-72 overflow-hidden shrink-0">
                  <Image src={item.imageUrl || `https://picsum.photos/seed/${item.id}/600/400`} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute top-8 left-8 bg-white/95 backdrop-blur-md text-primary text-[9px] font-bold px-6 py-2 rounded-full uppercase tracking-widest">{item.category}</div>
                </div>
                <CardContent className="p-10 space-y-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-slate-400 text-[10px] font-bold uppercase tracking-widest"><Calendar className="h-4 w-4 text-secondary" /> {item.date}</div>
                  <h3 className="text-2xl font-bold text-primary font-headline group-hover:text-secondary transition-colors line-clamp-2 leading-tight">{item.title}</h3>
                  <p className="text-slate-500 text-base line-clamp-3 font-medium flex-1">{item.summary}</p>
                  <Link href={`/berita/${item.id}`} className="inline-flex items-center gap-3 text-primary font-bold text-sm group/link pt-8 border-t border-slate-50">
                    Baca Artikel <ArrowRight className="h-4 w-4 text-secondary group-hover/link:translate-x-3 transition-transform" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Bento Grid */}
      <section className="py-40 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center max-w-4xl mx-auto mb-32 space-y-8">
            <div className="bg-secondary/10 text-secondary font-bold tracking-widest uppercase text-[9px] px-6 py-3 rounded-full inline-block">Fasilitas Kampus</div>
            <h2 className="text-5xl md:text-[5.5rem] font-bold text-primary font-headline tracking-tighter leading-none">Sarana Unggulan</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {facilities?.map((f: any, idx: number) => (
              <div key={f.id} className={cn("h-[500px] relative rounded-[3rem] overflow-hidden group shadow-lg", (idx === 0 || idx === 3) && "md:col-span-2")}>
                <Image src={f.imageUrl || `https://picsum.photos/seed/${f.id}/800/600`} alt={f.name} fill className="object-cover group-hover:scale-110 transition-transform duration-[2000ms]" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/30 to-transparent p-12 flex flex-col justify-end">
                  <h3 className="text-white text-3xl md:text-4xl font-bold font-headline tracking-tight leading-none">{f.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
