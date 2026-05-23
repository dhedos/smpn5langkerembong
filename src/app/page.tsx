
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GraduationCap, Users, Award, BookOpen, Calendar, ChevronRight } from "lucide-react";
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
  const { data: settings, loading: settingsLoading } = useDoc(settingsRef);

  const newsQuery = useMemo(() => db ? query(collection(db, "news"), orderBy("date", "desc"), limit(3)) : null, [db]);
  const { data: newsItems } = useCollection(newsQuery);

  const facilitiesQuery = useMemo(() => db ? query(collection(db, "facilities"), limit(4)) : null, [db]);
  const { data: facilities } = useCollection(facilitiesQuery);

  if (settingsLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const defaultStats = [
    { label: "Siswa Aktif", value: "850+", icon: "Users" },
    { label: "Guru Profesional", value: "65+", icon: "GraduationCap" },
    { label: "Prestasi Nasional", value: "120+", icon: "Award" },
    { label: "Ekskul", value: "24", icon: "BookOpen" },
  ];

  const displayStats = settings?.stats || defaultStats;

  const heroImageUrl = PlaceHolderImages.find(img => img.id === 'hero-school')?.imageUrl || "";

  return (
    <div className="flex flex-col gap-0">
      {/* Hero Section with Fixed Background */}
      <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
        {/* Background Layer */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-700"
          style={{ 
            backgroundImage: `url('${heroImageUrl}')`,
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-primary/40 to-background z-[1]" />
        
        <div className="container relative z-10 px-4 md:px-8 mx-auto">
          <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 text-secondary px-6 py-2.5 rounded-full text-sm font-bold shadow-2xl">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
              </span>
              PPDB Tahun Pelajaran 2024/2025 Telah Dibuka
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-white font-headline leading-[1.1] tracking-tighter drop-shadow-2xl">
              {settings?.heroTitle || "Membangun Masa Depan"} <br/>
              <span className="text-secondary italic">EduVista SMP</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl leading-relaxed font-medium drop-shadow-lg">
              {settings?.heroSubtitle || "Sekolah menengah pertama modern yang berfokus pada pengembangan holistik siswa melalui kurikulum inovatif."}
            </p>
            <div className="flex flex-wrap gap-5 pt-6">
              <Button size="lg" className="bg-secondary text-primary font-bold hover:bg-secondary/90 px-10 py-8 text-lg rounded-full shadow-2xl hover:scale-105 transition-all" asChild>
                <Link href="/ppdb">Daftar Online Sekarang</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white/40 backdrop-blur-md hover:bg-white/10 px-10 py-8 text-lg rounded-full font-bold" asChild>
                <Link href="/profil">Jelajahi Profil</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-24 z-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {displayStats.map((stat: any) => {
            const Icon = iconMap[stat.icon] || Users;
            return (
              <Card key={stat.label} className="bg-white/80 backdrop-blur-2xl border-white/50 shadow-2xl hover:translate-y-[-8px] transition-all duration-300 rounded-[2rem] overflow-hidden">
                <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                  <div className="p-4 bg-primary/10 rounded-2xl">
                    <Icon className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-primary font-headline tracking-tighter">{stat.value}</div>
                    <div className="text-sm text-slate-500 font-bold uppercase tracking-widest">{stat.label}</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Sambutan Kepala Sekolah */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:row items-center gap-20">
            <div className="w-full md:w-1/2 relative">
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white group">
                <Image
                  src={PlaceHolderImages.find(img => img.id === 'headmaster')?.imageUrl || ""}
                  alt="Kepala Sekolah"
                  width={600}
                  height={750}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  data-ai-hint="professional man"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 -z-10 bg-secondary w-full h-full rounded-[3rem] opacity-20 blur-2xl" />
              <div className="absolute -top-10 -left-10 -z-10 bg-primary w-40 h-40 rounded-full opacity-10 animate-pulse" />
            </div>
            <div className="w-full md:w-1/2 space-y-8">
              <div className="inline-block bg-secondary/10 text-secondary font-bold tracking-widest uppercase text-xs px-4 py-2 rounded-full">{settings?.welcomeTitle || "Sambutan Kepala Sekolah"}</div>
              <h2 className="text-5xl font-bold text-primary leading-tight font-headline tracking-tighter">
                Menginspirasi Siswa Untuk Menjelajahi Potensi Terbaik Mereka
              </h2>
              <div className="space-y-6 text-slate-600 text-lg leading-relaxed font-medium">
                <p className="whitespace-pre-line italic border-l-4 border-secondary pl-6">
                  "{settings?.welcomeMessage || "Selamat datang di EduVista SMP. Kami berkomitmen untuk menciptakan lingkungan belajar yang aman, suportif, dan merangsang intelektual bagi setiap siswa."}"
                </p>
              </div>
              <div className="pt-6">
                <div className="font-bold text-2xl text-primary font-headline tracking-tight">{settings?.headmasterName || "Dr. Ahmad Hidayat, M.Pd."}</div>
                <div className="text-secondary font-bold uppercase text-xs tracking-widest mt-1">{settings?.headmasterTitle || "Kepala Sekolah SMP EduVista"}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights & News */}
      <section className="py-32 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="space-y-4">
              <div className="text-secondary font-bold tracking-widest uppercase text-xs">Informasi Terbaru</div>
              <h2 className="text-5xl font-bold text-primary font-headline tracking-tighter">Kabar Sekolah & Pengumuman</h2>
            </div>
            <Button variant="outline" className="rounded-full px-8 py-6 font-bold border-primary text-primary hover:bg-primary hover:text-white transition-all shadow-lg" asChild>
              <Link href="/berita">Lihat Semua Berita <ChevronRight className="h-4 w-4 ml-2" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {newsItems && newsItems.length > 0 ? (
              newsItems.map((item: any) => (
                <Card key={item.id} className="group overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] bg-white">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={item.imageUrl || `https://picsum.photos/seed/${item.id}/600/400`}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-primary text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                      {item.category}
                    </div>
                  </div>
                  <CardContent className="p-8 space-y-4">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                      <Calendar className="h-3 w-3" />
                      <span>{item.date}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-primary font-headline group-hover:text-secondary transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-2 font-medium">
                      {item.summary}
                    </p>
                    <Link href={`/berita/${item.id}`} className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:gap-4 transition-all pt-4 group/link">
                      Baca Selengkapnya <ArrowRight className="h-4 w-4 text-secondary group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="col-span-3 text-center text-slate-400 italic py-20">Belum ada berita terbaru yang diterbitkan.</p>
            )}
          </div>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <div className="bg-secondary/10 text-secondary font-bold tracking-widest uppercase text-xs px-4 py-2 rounded-full inline-block">Fasilitas Modern</div>
            <h2 className="text-5xl font-bold text-primary font-headline tracking-tighter">Sarana Pendukung Belajar Terbaik</h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">Kami menyediakan fasilitas lengkap berstandar internasional untuk mendukung kenyamanan dan efektivitas proses belajar mengajar bagi seluruh siswa.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {facilities && facilities.map((f: any, idx: number) => (
              <div key={f.id} className={cn("h-[450px] relative rounded-[3rem] overflow-hidden group shadow-2xl", idx === 0 && "md:col-span-2 lg:col-span-2")}>
                <Image src={f.imageUrl || `https://picsum.photos/seed/${f.id}/800/600`} alt={f.name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-10 flex flex-col justify-end">
                  <div className="space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-white text-3xl font-bold font-headline tracking-tight">{f.name}</h3>
                    <div className="h-1 w-12 bg-secondary rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
