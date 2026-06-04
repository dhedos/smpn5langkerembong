
"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Newspaper, Calendar, ArrowRight, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, where, orderBy } from "firebase/firestore";

export default function VisitorInformasi() {
  const db = useFirestore();
  const currentSchoolId = 'smpn5-langke-rembong';

  // Menyederhanakan kueri agar tidak memerlukan composite index manual
  const newsQuery = useMemo(() => {
    if (!db) return null;
    return query(
      collection(db, "news"), 
      where("schoolId", "==", currentSchoolId)
    );
  }, [db]);

  const { data: rawNews, loading } = useCollection(newsQuery);

  // Filtrasi dan pengurutan dilakukan di sisi klien
  const newsItems = useMemo(() => {
    if (!rawNews) return [];
    return rawNews
      .filter((item: any) => item.status === "Published")
      .sort((a: any, b: any) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      });
  }, [rawNews]);

  return (
    <div className="pt-24 bg-white min-h-screen">
      <section className="bg-primary py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary/5 skew-y-3 translate-y-20" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold font-headline mb-6 tracking-tighter">Informasi & Pengumuman</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto font-medium">Informasi terkini mengenai kegiatan, prestasi, dan agenda sekolah kami.</p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <h2 className="text-3xl font-bold text-primary font-headline tracking-tight">Informasi Terbaru</h2>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input className="pl-12 rounded-full h-12 border-slate-200" placeholder="Cari informasi..." />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4 animate-pulse">
                  <div className="h-64 bg-slate-100 rounded-[2.5rem]" />
                  <div className="h-6 bg-slate-100 w-3/4 rounded" />
                  <div className="h-4 bg-slate-100 w-full rounded" />
                </div>
              ))}
            </div>
          ) : newsItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {newsItems.map((item: any) => (
                <Card key={item.id} className="group overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] bg-white flex flex-col">
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
                  <CardContent className="p-8 flex flex-col flex-1 space-y-4">
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
            <div className="text-center py-24 space-y-4">
              <Newspaper className="h-16 w-16 text-slate-200 mx-auto" />
              <p className="text-slate-400 italic text-lg">Belum ada informasi yang diterbitkan saat ini.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
