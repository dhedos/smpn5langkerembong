"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GraduationCap, Users, Award, BookOpen, Calendar, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
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
  const heroImageUrl = settings?.heroImageUrl || PlaceHolderImages.find(img => img.id === 'hero-school')?.imageUrl || "https://picsum.photos/seed/school1/1920/1080";

  return (
    <div className="flex flex-col gap-0">
      {/* Hero Section - Optimized for Precision */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-slate-950">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[3000ms] hover:scale-110 opacity-60"
          style={{ 
            backgroundImage: `url('${heroImageUrl}')`,
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent z-[1]" />
        
        <div className="container relative z-10 px-6 md:px-12 mx-auto">
          <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-2xl border border-white/20 text-white px-6 py-2.5 rounded-full text-xs font-bold tracking-[0.2em] uppercase shadow-2xl">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
              </span>
              {settings?.ppdbIsActive ? `Pendaftaran Online ${settings.ppdbYear} Dibuka` : "Ekselensi Pendidikan Modern"}
            </div>
            
            <h1 className="text-6xl md:text-[7rem] font-bold text-white font-headline leading-[0.95] tracking-tighter drop-shadow-2xl">
              {settings?.heroTitle || "Wujudkan Masa Depan"} <br/>
              <span className="text-secondary italic font-light">{settings?.schoolName || "SMPN 5 LR"}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/70 max-w-2xl leading-relaxed font-medium drop-shadow-lg">
              {settings?.heroSubtitle || "Sekolah dengan komitmen tinggi dalam mencetak generasi cerdas, berintegritas, dan kompetitif di era global."}
            </p>
            
            <div className="flex flex-wrap gap-6 pt-10">
              <Button size="lg" className="bg-secondary text-primary font-bold hover:bg-secondary/90 px-12 py-9 text-lg rounded-full shadow-2xl shadow-secondary/20 hover:scale-105 transition-all group" asChild>
                <Link href="/ppdb" className="flex items-center gap-3">
                  Daftar Sekarang <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white/30 backdrop-blur-md hover:bg-white hover:text-primary px-12 py-9 text-lg rounded-full font-bold transition-all" asChild>
                <Link href="/profil" className="flex items-center gap-3">
                  <Play className="h-4 w-4 fill-current" /> Lihat Profil
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Precise Floating Design */}
      <section className="relative -mt-20 z-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {displayStats.map((stat: any, i: number) => {
            const Icon = iconMap[stat.icon] || Users;
            return (
              <Card key={i} className="bg-white/95 backdrop-blur-xl border-white/50 shadow-2xl hover:translate-y-[-10px] transition-all duration-500 rounded-[2.5rem] group">
                <CardContent className="p-10 flex flex-col items-center text-center gap-6">
                  <div className="p-5 bg-slate-50 rounded-3xl group-hover:bg-primary transition-colors duration-500">
                    <Icon className="h-10 w-10 text-primary group-hover:text-white transition-colors duration-500" />
                  </div>
                  <div>
                    <div className="text-5xl font-bold text-slate-900 font-headline tracking-tighter mb-2">{stat.value}</div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">{stat.label}</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Sambutan Kepala Sekolah - High Contrast Layout */}
      <section className="py-40 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-32">
            <div className="w-full lg:w-1/2 relative">
              <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.1)] border-[16px] border-slate-50 group">
                <Image
                  src={settings?.headmasterPhotoUrl || PlaceHolderImages.find(img => img.id === 'headmaster')?.imageUrl || "https://picsum.photos/seed/headmaster/600/750"}
                  alt="Kepala Sekolah"
                  width={600}
                  height={750}
                  className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                />
              </div>
              <div className="absolute -bottom-16 -right-16 -z-10 bg-secondary/10 w-full h-full rounded-[4rem] blur-3xl" />
            </div>
            <div className="w-full lg:w-1/2 space-y-10">
              <div className="inline-block bg-slate-100 text-slate-500 font-bold tracking-[0.3em] uppercase text-xs px-6 py-3 rounded-full">{settings?.welcomeTitle || "Sambutan Kepala Sekolah"}</div>
              <h2 className="text-5xl md:text-7xl font-bold text-primary leading-[1.1] font-headline tracking-tighter">
                Mendidik dengan <br/> <span className="text-secondary italic">Hati dan Inovasi</span>
              </h2>
              <div className="space-y-8 text-slate-600 text-xl leading-relaxed font-medium">
                <p className="whitespace-pre-line italic relative pl-10">
                  <span className="absolute left-0 top-0 text-7xl text-secondary/30 font-serif leading-none">“</span>
                  {settings?.welcomeMessage || "Visi kami adalah menciptakan ekosistem pendidikan yang tidak hanya unggul secara akademis, tetapi juga membentuk karakter siswa yang tangguh dan berintegritas tinggi."}
                </p>
              </div>
              <div className="pt-10 flex items-center gap-6">
                 <div className="w-20 h-px bg-slate-200" />
                 <div>
                    <div className="font-bold text-3xl text-primary font-headline tracking-tight">{settings?.headmasterName || "Dr. Ahmad Hidayat, M.Pd."}</div>
                    <div className="text-secondary font-bold uppercase text-xs tracking-[0.3em] mt-2">{settings?.headmasterTitle || "Kepala Sekolah"}</div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights & News - Modern Card Grid */}
      <section className="py-40 bg-slate-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-10">
            <div className="space-y-6">
              <div className="text-secondary font-bold tracking-[0.3em] uppercase text-xs">Update Informasi</div>
              <h2 className="text-5xl md:text-7xl font-bold text-primary font-headline tracking-tighter">Kabar Terbaru</h2>
            </div>
            <Button variant="outline" className="rounded-full px-10 py-8 font-bold border-slate-200 text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-xl bg-white" asChild>
              <Link href="/berita" className="flex items-center gap-3">Lihat Semua Artikel <ChevronRight className="h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {newsItems && newsItems.length > 0 ? (
              newsItems.map((item: any) => (
                <Card key={item.id} className="group overflow-hidden border-none shadow-[0_30px_60px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] transition-all duration-700 rounded-[3rem] bg-white flex flex-col h-full border border-white">
                  <div className="relative h-72 overflow-hidden shrink-0">
                    <Image
                      src={item.imageUrl || `https://picsum.photos/seed/${item.id}/600/400`}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md text-primary text-[10px] font-bold px-6 py-2 rounded-full uppercase tracking-[0.2em]">
                      {item.category}
                    </div>
                  </div>
                  <CardContent className="p-10 space-y-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-widest">
                      <Calendar className="h-4 w-4 text-secondary" />
                      <span>{item.date}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-primary font-headline group-hover:text-secondary transition-colors line-clamp-2 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 text-[15px] line-clamp-2 font-medium leading-relaxed flex-1">
                      {item.summary}
                    </p>
                    <Link href={`/berita/${item.id}`} className="inline-flex items-center gap-3 text-primary font-bold text-sm group/link pt-6 border-t border-slate-50">
                      Selengkapnya <ArrowRight className="h-4 w-4 text-secondary group-hover/link:translate-x-3 transition-transform" />
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 italic text-lg font-medium">Belum ada berita yang dipublikasikan.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Facilities Grid - Unique Bento Style */}
      <section className="py-40 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center max-w-4xl mx-auto mb-32 space-y-8">
            <div className="bg-secondary/10 text-secondary font-bold tracking-[0.3em] uppercase text-xs px-6 py-3 rounded-full inline-block">Fasilitas Kampus</div>
            <h2 className="text-5xl md:text-[5.5rem] font-bold text-primary font-headline tracking-tighter leading-none">Infrastruktur Unggulan</h2>
            <p className="text-slate-500 text-xl font-medium leading-relaxed">Menyediakan sarana belajar yang nyaman, modern, dan lengkap untuk menunjang pencapaian prestasi siswa.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {facilities && facilities.length > 0 ? facilities.map((f: any, idx: number) => (
              <div key={f.id} className={cn("h-[500px] relative rounded-[3.5rem] overflow-hidden group shadow-2xl", (idx === 0 || idx === 3) && "md:col-span-2")}>
                <Image src={f.imageUrl || `https://picsum.photos/seed/${f.id}/800/600`} alt={f.name} fill className="object-cover group-hover:scale-110 transition-transform duration-[1500ms]" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent p-12 flex flex-col justify-end">
                  <div className="space-y-4 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-700">
                    <h3 className="text-white text-3xl md:text-4xl font-bold font-headline tracking-tight leading-none">{f.name}</h3>
                    <div className="h-1.5 w-16 bg-secondary rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-32 bg-slate-50 rounded-[3.5rem] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 italic text-lg font-medium">Data fasilitas belum diperbarui.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}