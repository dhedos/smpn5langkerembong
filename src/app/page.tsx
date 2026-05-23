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

  return (
    <div className="flex flex-col gap-0">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
        <Image
          src={PlaceHolderImages.find(img => img.id === 'hero-school')?.imageUrl || ""}
          alt="Modern School Building"
          fill
          priority
          className="object-cover"
          data-ai-hint="modern school"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/40 to-transparent" />
        
        <div className="container relative z-10 px-4 md:px-8 mx-auto">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-md border border-secondary/30 text-secondary px-4 py-2 rounded-full text-sm font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              PPDB Tahun Pelajaran 2024/2025 Telah Dibuka
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white font-headline leading-tight">
              {settings?.heroTitle || "Membangun Masa Depan"} <br/>
              <span className="text-secondary">EduVista SMP</span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
              {settings?.heroSubtitle || "Sekolah menengah pertama modern yang berfokus pada pengembangan holistik siswa melalui kurikulum inovatif."}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" className="bg-secondary text-primary font-bold hover:bg-secondary/90 px-8 rounded-full shadow-lg" asChild>
                <Link href="/ppdb">Daftar Online</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 px-8 rounded-full" asChild>
                <Link href="/profil">Profil Sekolah</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-16 z-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayStats.map((stat: any) => {
            const Icon = iconMap[stat.icon] || Users;
            return (
              <Card key={stat.label} className="glass border-none shadow-xl hover:translate-y-[-5px] transition-transform">
                <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-2xl">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary font-headline">{stat.value}</div>
                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Sambutan Kepala Sekolah */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2 relative">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                <Image
                  src={PlaceHolderImages.find(img => img.id === 'headmaster')?.imageUrl || ""}
                  alt="Kepala Sekolah"
                  width={500}
                  height={600}
                  className="w-full h-auto object-cover"
                  data-ai-hint="professional man"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 -z-10 bg-secondary w-full h-full rounded-3xl" />
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <div className="text-secondary font-bold tracking-widest uppercase text-sm">{settings?.welcomeTitle || "Sambutan Kepala Sekolah"}</div>
              <h2 className="text-4xl font-bold text-primary leading-tight font-headline">
                Menginspirasi Siswa Untuk <br/> Menjelajahi Potensi Terbaik Mereka
              </h2>
              <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                <p className="whitespace-pre-line">
                  {settings?.welcomeMessage || "Selamat datang di EduVista SMP. Kami berkomitmen untuk menciptakan lingkungan belajar yang aman, suportif, dan merangsang intelektual bagi setiap siswa."}
                </p>
              </div>
              <div className="pt-4">
                <div className="font-bold text-xl text-primary font-headline">{settings?.headmasterName || "Dr. Ahmad Hidayat, M.Pd."}</div>
                <div className="text-secondary font-medium">{settings?.headmasterTitle || "Kepala Sekolah SMP EduVista"}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights & News */}
      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <div className="text-secondary font-bold tracking-widest uppercase text-sm mb-2">Informasi Terbaru</div>
              <h2 className="text-4xl font-bold text-primary font-headline">Kabar Sekolah & Pengumuman</h2>
            </div>
            <Button variant="outline" className="hidden md:flex gap-2" asChild>
              <Link href="/berita">Lihat Semua Berita <ChevronRight className="h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newsItems && newsItems.length > 0 ? (
              newsItems.map((item: any) => (
                <Card key={item.id} className="group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={item.imageUrl || `https://picsum.photos/seed/${item.id}/600/400`}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-secondary text-primary text-xs font-bold px-3 py-1 rounded-full">
                      {item.category}
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      <Calendar className="h-3 w-3" />
                      <span>{item.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-primary font-headline group-hover:text-secondary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {item.summary}
                    </p>
                    <Link href={`/berita/${item.id}`} className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all pt-2">
                      Baca Selengkapnya <ArrowRight className="h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="col-span-3 text-center text-muted-foreground">Belum ada berita terbaru.</p>
            )}
          </div>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <div className="text-secondary font-bold tracking-widest uppercase text-sm">Fasilitas Modern</div>
            <h2 className="text-4xl font-bold text-primary font-headline">Sarana Pendukung Belajar Terbaik</h2>
            <p className="text-muted-foreground">Kami menyediakan fasilitas lengkap berstandar internasional untuk mendukung kenyamanan dan efektivitas proses belajar mengajar.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {facilities && facilities.map((f: any, idx: number) => (
              <div key={f.id} className={cn("h-80 relative rounded-3xl overflow-hidden group", idx === 0 && "md:col-span-2 lg:col-span-2")}>
                <Image src={f.imageUrl || `https://picsum.photos/seed/${f.id}/800/600`} alt={f.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-8 flex flex-col justify-end">
                  <h3 className="text-white text-xl font-bold font-headline">{f.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
