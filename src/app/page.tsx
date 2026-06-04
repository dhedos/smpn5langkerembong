
"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  GraduationCap, 
  Users, 
  UserCircle, 
  Briefcase, 
  Newspaper, 
  Calendar,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDoc, useCollection, useFirestore } from "@/firebase";
import { doc, collection, query, limit, orderBy, where } from "firebase/firestore";

const IconMap: Record<string, any> = {
  GraduationCap: GraduationCap,
  Users: Users,
  UserCircle: UserCircle,
  Briefcase: Briefcase,
};

export default function Home() {
  const db = useFirestore();
  
  const currentSchoolId = 'smpn5-langke-rembong';
  const settingsRef = useMemo(() => db ? doc(db, "schools", currentSchoolId) : null, [db]);
  const { data: settings, loading: settingsLoading } = useDoc(settingsRef);

  const newsQuery = useMemo(() => {
    if (!db) return null;
    return query(
      collection(db, "news"), 
      where("schoolId", "==", currentSchoolId),
      where("status", "==", "Published"),
      orderBy("updatedAt", "desc"), 
      limit(3)
    );
  }, [db]);
  const { data: newsItems, loading: newsLoading } = useCollection(newsQuery);

  if (settingsLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest animate-pulse">Menghubungkan ke GN Nusantara...</p>
      </div>
    );
  }

  const heroImageUrl = settings?.heroImageUrl || "https://picsum.photos/seed/school1/1920/1080";
  const schoolName = settings?.schoolName || "SMPN 5 Langke Rembong";
  const heroTitle = settings?.heroTitle || "Membangun Masa Depan";
  const heroSubtitle = settings?.heroSubtitle || "Pendidikan berkualitas untuk generasi emas bangsa melalui kurikulum inovatif.";
  
  const welcomeSectionLabel = settings?.welcomeSectionLabel || "Sambutan Kepala Sekolah";
  const welcomeTitle = settings?.welcomeTitle || "Mendidik dengan Hati & Teknologi";
  const welcomeMessage = settings?.welcomeMessage || "Kami berkomitmen untuk memberikan pengalaman belajar terbaik bagi putra-putri Anda melalui kurikulum yang inovatif dan lingkungan yang mendukung.";

  const stats = settings?.stats || [
    { label: "Guru", value: "0", icon: "GraduationCap" },
    { label: "Tenaga Pendidik", value: "0", icon: "Users" },
    { label: "Siswa", value: "0", icon: "UserCircle" }
  ];

  return (
    <div className="flex flex-col gap-0">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-slate-950">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url('${heroImageUrl}')`, backgroundAttachment: 'fixed' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent z-[1]" />
        <div className="container relative z-10 px-6 md:px-12 mx-auto pb-48 pt-32">
          <div className="max-w-4xl space-y-10">
            <h1 className="text-5xl md:text-[6rem] font-bold text-white font-headline leading-[1] tracking-tighter uppercase">
              {heroTitle} <br/>
              <span className="text-secondary italic font-light lowercase">{schoolName}</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/70 max-w-2xl leading-relaxed font-medium">
              {heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-6 pt-6">
              <Button size="lg" className="bg-secondary text-primary font-bold hover:bg-secondary/90 px-12 py-8 text-xl rounded-full shadow-2xl group border-none" asChild>
                <Link href="/ppdb" className="flex items-center gap-3">
                  {settings?.ppdbMenuTitle || "SPMB ONLINE"} <ArrowRight className="h-6 w-6 group-hover:translate-x-3 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-12 py-8 text-xl rounded-full backdrop-blur-md" asChild>
                <Link href="/profil">Pelajari Profil Kami</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-20 -mt-24 px-6 md:px-12 container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat: any, idx: number) => {
            const Icon = IconMap[stat.icon] || Users;
            return (
              <div key={idx} className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col items-center text-center space-y-4 hover:translate-y-[-10px] transition-all duration-500">
                <div className="bg-secondary/10 p-5 rounded-3xl">
                  <Icon className="h-10 w-10 text-secondary" />
                </div>
                <div className="space-y-1">
                  <div className="text-5xl font-bold text-primary font-headline tracking-tighter">{stat.value}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sambutan Section */}
      <section className="py-40 bg-white overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="w-full lg:w-1/2 relative">
              <div className="relative aspect-[4/5] w-full max-w-md mx-auto rounded-[4rem] overflow-hidden shadow-2xl border-[15px] border-slate-50 group">
                <img 
                  src={settings?.headmasterPhotoUrl || "https://picsum.photos/seed/headmaster/600/800"} 
                  alt="Kepala Sekolah" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                <div className="absolute bottom-10 left-10 text-white">
                  <div className="font-bold text-2xl font-headline tracking-tight">{settings?.headmasterName || "Kepala Sekolah"}</div>
                  <div className="text-secondary font-bold uppercase text-[10px] tracking-widest mt-1">{settings?.headmasterTitle || "Pimpinan Sekolah"}</div>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 space-y-10 text-center lg:text-left">
              <div className="inline-block bg-slate-100 text-slate-500 font-bold tracking-widest uppercase text-[9px] px-6 py-3 rounded-full">
                {welcomeSectionLabel}
              </div>
              <h2 className="text-5xl md:text-[4.5rem] font-bold text-primary leading-[1] font-headline tracking-tighter whitespace-pre-line">
                {welcomeTitle}
              </h2>
              <div className="text-slate-600 text-xl leading-relaxed font-medium italic relative">
                <span className="absolute -top-10 -left-6 text-slate-100 text-[12rem] font-serif leading-none select-none z-[-1]">“</span>
                {welcomeMessage}
              </div>
              <Button variant="link" className="text-primary font-bold text-lg p-0 h-auto flex items-center gap-2" asChild>
                <Link href="/profil">Selengkapnya tentang visi kami <ArrowRight className="h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Berita Terbaru Section */}
      <section className="py-40 bg-slate-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="space-y-4">
              <div className="text-secondary font-bold tracking-widest uppercase text-xs px-4 py-2 bg-secondary/10 rounded-full inline-flex items-center gap-2">
                <Newspaper className="h-4 w-4" /> Informasi & Agenda
              </div>
              <h2 className="text-5xl font-bold text-primary font-headline tracking-tighter">Berita Terbaru</h2>
            </div>
            <Button variant="outline" className="rounded-full px-10 border-slate-200" asChild>
              <Link href="/informasi">Lihat Semua Berita</Link>
            </Button>
          </div>

          {newsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-96 bg-white rounded-[3rem] animate-pulse shadow-sm" />
              ))}
            </div>
          ) : newsItems && newsItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {newsItems.map((item: any) => (
                <Card key={item.id} className="group overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[3rem] bg-white flex flex-col">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={item.imageUrl || `https://picsum.photos/seed/${item.id}/600/400`}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-primary text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                      {item.category}
                    </div>
                  </div>
                  <CardContent className="p-10 flex flex-col flex-1 space-y-4">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                      <Calendar className="h-3 w-3" />
                      <span>{item.date}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-primary font-headline group-hover:text-secondary transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-3 font-medium flex-1">
                      {item.summary}
                    </p>
                    <Link href={`/informasi/${item.id}`} className="inline-flex items-center gap-3 text-primary font-bold text-sm hover:gap-4 transition-all pt-4 group/link">
                      Baca Selengkapnya <ArrowRight className="h-4 w-4 text-secondary group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
               <Newspaper className="h-16 w-16 text-slate-100 mx-auto mb-4" />
               <p className="text-slate-400 font-medium italic">Belum ada berita yang diterbitkan.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
