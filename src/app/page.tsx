
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

  const displayStats = settings?.stats || defaultStats;
  const heroImageUrl = settings?.heroImageUrl || "https://picsum.photos/seed/school1/1920/1080";

  return (
    <div className="flex flex-col gap-0">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-950">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[4000ms] hover:scale-105 opacity-60"
          style={{ backgroundImage: `url('${heroImageUrl}')`, backgroundAttachment: 'fixed' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent z-[1]" />
        
        <div className="container relative z-10 px-6 md:px-12 mx-auto pb-48 pt-32">
          <div className="max-w-4xl space-y-12 animate-in fade-in slide-in-from-left duration-1000">
            <h1 className="text-6xl md:text-[8rem] font-bold text-white font-headline leading-[0.9] tracking-tighter">
              {settings?.heroTitle || "Wujudkan Masa Depan"} <br/>
              <span className="text-secondary italic font-light">{settings?.schoolName || "SMPN 5 LR"}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/70 max-w-2xl leading-relaxed font-medium">
              {settings?.heroSubtitle || "Sekolah dengan komitmen tinggi dalam mencetak generasi cerdas, berintegritas, dan kompetitif."}
            </p>
            
            <div className="flex flex-wrap gap-6 pt-10">
              <Button size="lg" className="bg-secondary text-primary font-bold hover:bg-secondary/90 px-14 py-10 text-xl rounded-full shadow-2xl group" asChild>
                <Link href="/ppdb" className="flex items-center gap-3">
                  Daftar Sekarang <ArrowRight className="h-6 w-6 group-hover:translate-x-3 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white/30 backdrop-blur-md hover:bg-white hover:text-primary px-14 py-10 text-xl rounded-full font-bold transition-all" asChild>
                <Link href="/profil" className="flex items-center gap-3">
                  <Play className="h-5 w-5 fill-current" /> Lihat Profil
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Precise Design from Reference */}
      <section className="relative -mt-32 z-20 px-6 mb-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {displayStats.map((stat: any, i: number) => {
            const Icon = iconMap[stat.icon] || Users;
            return (
              <Card key={i} className="bg-white border-none shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] hover:translate-y-[-10px] transition-all duration-500 rounded-[4rem] group overflow-hidden">
                <CardContent className="p-10 md:p-14 flex flex-col items-center text-center space-y-8">
                  <div className="p-6 bg-slate-50 rounded-[2rem] transition-colors duration-500">
                    <Icon className="h-10 w-10 text-primary/80" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-6xl md:text-7xl font-bold text-slate-900 font-headline tracking-tighter">
                      {stat.value}
                    </div>
                    <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-[0.25em] pt-2">
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
      <section className="py-56 bg-white overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-40">
            <div className="w-full lg:w-1/2 relative">
              <div className="relative z-10 rounded-[5rem] overflow-hidden shadow-2xl border-[20px] border-slate-50 group">
                <Image
                  src={settings?.headmasterPhotoUrl || "https://picsum.photos/seed/headmaster/600/750"}
                  alt="Kepala Sekolah"
                  width={600}
                  height={750}
                  className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                />
              </div>
            </div>
            <div className="w-full lg:w-1/2 space-y-12">
              <div className="inline-block bg-slate-100 text-slate-500 font-bold tracking-widest uppercase text-[10px] px-8 py-4 rounded-full">{settings?.welcomeTitle || "Sambutan Kepala Sekolah"}</div>
              <h2 className="text-6xl md:text-[5.5rem] font-bold text-primary leading-[1] font-headline tracking-tighter">
                Mendidik dengan <br/> <span className="text-secondary italic">Hati & Inovasi</span>
              </h2>
              <p className="text-slate-600 text-2xl leading-relaxed font-medium italic pl-16 relative">
                <span className="absolute left-0 top-0 text-[10rem] text-secondary/20 font-serif leading-none -translate-y-12">“</span>
                {settings?.welcomeMessage || "Visi kami adalah menciptakan ekosistem pendidikan yang unggul dan berkarakter."}
              </p>
              <div className="pt-16">
                 <div className="font-bold text-4xl text-primary font-headline tracking-tight">{settings?.headmasterName || "Dr. Ahmad Hidayat, M.Pd."}</div>
                 <div className="text-secondary font-bold uppercase text-xs tracking-widest mt-3">{settings?.headmasterTitle || "Kepala Sekolah"}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights & News */}
      <section className="py-56 bg-slate-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-12">
            <div className="space-y-8">
              <div className="text-secondary font-bold tracking-widest uppercase text-[10px]">Update Informasi</div>
              <h2 className="text-6xl md:text-[6rem] font-bold text-primary font-headline tracking-tighter leading-none">Kabar Terbaru</h2>
            </div>
            <Button variant="outline" className="rounded-full px-12 py-10 text-lg font-bold border-slate-200 text-slate-600 hover:bg-primary hover:text-white transition-all shadow-2xl bg-white" asChild>
              <Link href="/berita" className="flex items-center gap-4">Lihat Semua Berita <ChevronRight className="h-5 w-5" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {newsItems?.map((item: any) => (
              <Card key={item.id} className="group overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-700 rounded-[4rem] bg-white flex flex-col h-full">
                <div className="relative h-80 overflow-hidden shrink-0">
                  <Image src={item.imageUrl || `https://picsum.photos/seed/${item.id}/600/400`} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute top-10 left-10 bg-white/95 backdrop-blur-md text-primary text-[10px] font-bold px-8 py-2.5 rounded-full uppercase tracking-widest">{item.category}</div>
                </div>
                <CardContent className="p-12 space-y-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-widest"><Calendar className="h-5 w-5 text-secondary" /> {item.date}</div>
                  <h3 className="text-3xl font-bold text-primary font-headline group-hover:text-secondary transition-colors line-clamp-2 leading-tight">{item.title}</h3>
                  <p className="text-slate-500 text-lg line-clamp-3 font-medium flex-1">{item.summary}</p>
                  <Link href={`/berita/${item.id}`} className="inline-flex items-center gap-4 text-primary font-bold text-base group/link pt-10 border-t border-slate-50">
                    Baca Artikel <ArrowRight className="h-5 w-5 text-secondary group-hover/link:translate-x-4 transition-transform" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Bento Grid */}
      <section className="py-56 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center max-w-5xl mx-auto mb-40 space-y-10">
            <div className="bg-secondary/10 text-secondary font-bold tracking-widest uppercase text-[10px] px-8 py-4 rounded-full inline-block">Fasilitas Kampus</div>
            <h2 className="text-6xl md:text-[7rem] font-bold text-primary font-headline tracking-tighter leading-none">Sarana Unggulan</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {facilities?.map((f: any, idx: number) => (
              <div key={f.id} className={cn("h-[600px] relative rounded-[4rem] overflow-hidden group shadow-xl", (idx === 0 || idx === 3) && "md:col-span-2")}>
                <Image src={f.imageUrl || `https://picsum.photos/seed/${f.id}/800/600`} alt={f.name} fill className="object-cover group-hover:scale-110 transition-transform duration-[2000ms]" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/30 to-transparent p-16 flex flex-col justify-end">
                  <h3 className="text-white text-4xl md:text-5xl font-bold font-headline tracking-tight leading-none">{f.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
