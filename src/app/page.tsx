
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
  Loader2,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDoc, useCollection, useFirestore } from "@/firebase";
import { doc, collection, query, where } from "firebase/firestore";

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
      where("schoolId", "==", currentSchoolId)
    );
  }, [db]);

  const { data: rawNews, loading: newsLoading } = useCollection(newsQuery);

  const newsItems = useMemo(() => {
    if (!rawNews) return [];
    return rawNews
      .filter((item: any) => item.status === "Published")
      .sort((a: any, b: any) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      })
      .slice(0, 3);
  }, [rawNews]);

  if (settingsLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary/30" />
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
  const isSpmbActive = settings?.ppdbIsActive === true;

  const stats = settings?.stats || [
    { label: "Guru", value: "0", icon: "GraduationCap" },
    { label: "Tenaga Pendidik", value: "0", icon: "Users" },
    { label: "Siswa", value: "0", icon: "UserCircle" }
  ];

  return (
    <div className="flex flex-col gap-0">
      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-slate-950">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-70"
          style={{ backgroundImage: `url('${heroImageUrl}')`, backgroundAttachment: 'fixed' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent z-[1]" />
        
        <div className="container relative z-10 px-6 md:px-12 mx-auto pb-32 pt-40">
          <div className="max-w-5xl space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-[8rem] font-black text-white font-headline leading-[0.85] tracking-tighter uppercase drop-shadow-2xl">
                {heroTitle}
              </h1>
              <div className="text-3xl md:text-5xl font-bold text-secondary italic tracking-tight drop-shadow-lg lowercase mt-4 opacity-90">
                {schoolName}
              </div>
            </div>
            
            <p className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed font-medium drop-shadow-md border-l-4 border-secondary pl-6">
              {heroSubtitle}
            </p>
            
            <div className="flex flex-wrap gap-6 pt-10">
              {isSpmbActive && (
                <Button size="lg" className="bg-secondary text-primary font-bold hover:bg-secondary/90 px-10 py-7 text-lg rounded-full shadow-2xl group border-none" asChild>
                  <Link href="/ppdb" className="flex items-center gap-3">
                    {settings?.ppdbMenuTitle || "SPMB ONLINE"} <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Button>
              )}
              <Button size="lg" className="bg-white backdrop-blur-md text-primary font-bold hover:bg-white/90 px-10 py-7 text-lg rounded-full shadow-xl transition-all" asChild>
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
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="w-full lg:w-[40%] flex justify-center lg:justify-end">
              <div className="relative aspect-[2/3] w-full max-w-[320px] rounded-[3rem] overflow-hidden shadow-2xl border-[10px] border-slate-50 group bg-slate-100">
                {settings?.headmasterPhotoUrl ? (
                  <img 
                    src={settings.headmasterPhotoUrl} 
                    alt="Kepala Sekolah" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                    <User className="h-32 w-32 mb-4 opacity-50" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Foto belum tersedia</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <div className="font-bold text-xl font-headline tracking-tight truncate">{settings?.headmasterName || "Kepala Sekolah"}</div>
                  <div className="text-secondary font-bold uppercase text-[9px] tracking-widest mt-1 opacity-90">{settings?.headmasterTitle || "Pimpinan Sekolah"}</div>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-[60%] space-y-8 text-center lg:text-left">
              <div className="inline-block bg-slate-50 text-slate-400 font-bold tracking-widest uppercase text-[9px] px-6 py-3 rounded-full border border-slate-100">
                {welcomeSectionLabel}
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-primary leading-[1.1] font-headline tracking-tighter whitespace-pre-line">
                {welcomeTitle}
              </h2>
              <div className="text-slate-500 text-lg leading-relaxed font-medium relative">
                <span className="hidden md:block absolute -top-8 -left-6 text-slate-100 text-[10rem] font-serif leading-none select-none z-[-1]">“</span>
                {welcomeMessage}
              </div>
              <div className="pt-4">
                <Button variant="link" className="text-primary font-bold text-lg p-0 h-auto flex items-center gap-2 group" asChild>
                  <Link href="/profil">
                    Selengkapnya tentang visi kami 
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Informasi Terbaru Section */}
      <section className="py-40 bg-slate-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="space-y-4">
              <div className="text-secondary font-bold tracking-widest uppercase text-xs px-4 py-2 bg-secondary/10 rounded-full inline-flex items-center gap-2">
                <Newspaper className="h-4 w-4" /> Informasi & Agenda
              </div>
              <h2 className="text-5xl font-bold text-primary font-headline tracking-tighter">Informasi Terbaru</h2>
            </div>
            <Button variant="outline" className="rounded-full px-10 border-slate-200" asChild>
              <Link href="/informasi">Lihat Semua Informasi</Link>
            </Button>
          </div>

          {newsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-96 bg-white rounded-[3rem] animate-pulse shadow-sm" />
              ))}
            </div>
          ) : newsItems.length > 0 ? (
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
               <p className="text-slate-400 font-medium italic">Belum ada informasi yang diterbitkan.</p>
               <p className="text-slate-300 text-xs mt-2">Pastikan Admin telah menyetel status informasi menjadi <span className="text-green-600 font-bold uppercase">Published</span>.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
