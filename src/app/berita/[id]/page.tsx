
"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, ChevronLeft, User, Tag, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";

export default function VisitorBeritaDetail() {
  const { id } = useParams();
  const router = useRouter();
  const db = useFirestore();
  const newsRef = useMemo(() => db && id ? doc(db, "news", id as string) : null, [db, id]);
  const { data: item, loading } = useDoc(newsRef);

  if (loading) return <div className="pt-32 text-center text-slate-400 animate-pulse">Memuat informasi...</div>;

  if (!item) return (
    <div className="pt-32 text-center space-y-6">
      <h1 className="text-3xl font-bold text-primary">Informasi Tidak Ditemukan</h1>
      <Button onClick={() => router.push("/berita")}>Kembali ke Daftar</Button>
    </div>
  );

  return (
    <div className="pt-24 bg-white min-h-screen">
      <section className="container mx-auto px-4 max-w-4xl py-12">
        <Button 
          variant="ghost" 
          className="mb-8 rounded-full group hover:bg-primary/5" 
          onClick={() => router.push("/berita")}
        >
          <ChevronLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Kembali ke Informasi
        </Button>

        <div className="space-y-6 mb-12">
          <Badge className="bg-secondary text-primary font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
            {item.category}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-primary font-headline tracking-tighter leading-tight">
            {item.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-slate-400 text-sm font-bold uppercase tracking-widest pt-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-secondary" />
              <span>{item.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-secondary" />
              <span>Admin Sekolah</span>
            </div>
          </div>
        </div>

        <div className="relative aspect-[16/9] w-full rounded-[3rem] overflow-hidden shadow-2xl mb-16 border-[12px] border-slate-50">
          <Image 
            src={item.imageUrl || `https://picsum.photos/seed/${id}/1200/800`} 
            alt={item.title} 
            fill 
            className="object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3">
            <div className="prose prose-slate prose-lg max-w-none whitespace-pre-line text-slate-600 font-medium leading-relaxed">
              {item.content}
            </div>
            
            <div className="mt-16 pt-8 border-t flex flex-wrap gap-2">
              <div className="flex items-center gap-2 text-primary font-bold mr-4">
                <Tag className="h-4 w-4" /> TAGS:
              </div>
              {item.tags?.map((tag: string) => (
                <Badge key={tag} variant="outline" className="border-slate-200 text-slate-500 font-bold px-4 py-1 rounded-full">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-8">
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                <h4 className="text-primary font-bold font-headline mb-4 flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-secondary" /> Bagikan
                </h4>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-primary hover:text-white transition-colors">F</div>
                  <div className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-primary hover:text-white transition-colors">I</div>
                  <div className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-primary hover:text-white transition-colors">W</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
