
"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { CheckCircle2, Target, History, Users2, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useFirestore, useDoc, useCollection } from "@/firebase";
import { doc, collection } from "firebase/firestore";

export default function ProfilPage() {
  const db = useFirestore();
  const settingsRef = useMemo(() => db ? doc(db, "settings", "general") : null, [db]);
  const { data: settings, loading } = useDoc(settingsRef);

  const facilitiesRef = useMemo(() => db ? collection(db, "facilities") : null, [db]);
  const { data: facilities } = useCollection(facilitiesRef);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Memuat profil sekolah...</div>;

  const schoolName = settings?.schoolName || "EduVista SMP";
  
  return (
    <div className="pt-24 bg-white">
      {/* Page Header */}
      <section className="bg-primary py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary/5 skew-y-3 translate-y-20" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold font-headline mb-6 tracking-tighter">Profil Sekolah</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto font-medium">Mengenal lebih dekat perjalanan, nilai, dan infrastruktur unggulan {schoolName}.</p>
        </div>
      </section>

      {/* Sejarah Section */}
      <section id="sejarah" className="py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-20 items-center">
            <div className="w-full md:w-1/2 space-y-8">
              <div className="text-secondary font-bold tracking-widest uppercase text-xs px-4 py-2 bg-secondary/10 rounded-full inline-flex items-center gap-2">
                <History className="h-4 w-4" /> Sejarah Kami
              </div>
              <h2 className="text-5xl font-bold text-primary font-headline tracking-tighter leading-tight">Membangun Fondasi Pendidikan yang Kokoh</h2>
              <div className="space-y-6 text-slate-600 leading-relaxed text-lg font-medium whitespace-pre-line">
                {settings?.history || "Sejarah sekolah belum diatur oleh admin."}
              </div>
            </div>
            <div className="w-full md:w-1/2 relative">
              <div className="rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-slate-50">
                 <Image 
                  src="https://picsum.photos/seed/school-history/800/800" 
                  alt="Sejarah Sekolah" 
                  width={800} 
                  height={800} 
                  className="w-full h-auto"
                  data-ai-hint="old school"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-secondary w-32 h-32 rounded-full opacity-20 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Visi Misi Section */}
      <section id="visi-misi" className="py-32 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-16 rounded-[3.5rem] shadow-xl border border-slate-100 space-y-8">
              <div className="bg-primary/10 w-20 h-20 rounded-3xl flex items-center justify-center">
                <Target className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-4xl font-bold text-primary font-headline tracking-tighter">Visi Sekolah</h3>
              <p className="text-2xl text-slate-600 italic leading-relaxed font-medium">
                "{settings?.vision || "Visi belum diatur oleh admin."}"
              </p>
            </div>
            <div className="bg-primary p-16 rounded-[3.5rem] shadow-2xl text-white space-y-8 relative overflow-hidden">
              <div className="bg-white/10 w-20 h-20 rounded-3xl flex items-center justify-center">
                <Users2 className="h-10 w-10 text-secondary" />
              </div>
              <h3 className="text-4xl font-bold font-headline tracking-tighter">Misi Sekolah</h3>
              <ul className="space-y-5">
                {settings?.mission?.length > 0 ? settings.mission.map((item: string, idx: number) => (
                  <li key={idx} className="flex gap-4 items-start group">
                    <CheckCircle2 className="h-7 w-7 text-secondary shrink-0 mt-1" />
                    <span className="text-white/90 text-lg font-medium leading-snug">{item}</span>
                  </li>
                )) : <li className="italic text-white/50">Misi belum diatur oleh admin.</li>}
              </ul>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
            </div>
          </div>
        </div>
      </section>

      {/* Fasilitas Section */}
      <section id="fasilitas" className="py-32">
        <div className="container mx-auto px-4">
           <div className="text-center mb-20 space-y-6">
            <div className="text-secondary font-bold tracking-widest uppercase text-xs px-4 py-2 bg-secondary/10 rounded-full inline-flex items-center gap-2">
              <Building2 className="h-4 w-4" /> Sarana Prasarana
            </div>
            <h2 className="text-5xl font-bold text-primary font-headline tracking-tighter">Fasilitas Unggulan Kami</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {facilities && facilities.length > 0 ? facilities.map((f: any, i: number) => (
              <Card key={i} className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] group">
                <div className="relative h-64 overflow-hidden">
                   <Image src={f.imageUrl || `https://picsum.photos/seed/${f.id}/600/400`} alt={f.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <CardContent className="p-8">
                  <h4 className="text-2xl font-bold text-primary font-headline mb-3">{f.name}</h4>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            )) : (
              <p className="col-span-3 text-center text-slate-400 italic py-10">Admin belum menambahkan daftar fasilitas.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
