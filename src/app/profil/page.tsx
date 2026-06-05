
"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { CheckCircle2, Target, History, Users2, Building2, AlertTriangle, Info, Loader2, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useFirestore, useDoc, useCollection } from "@/firebase";
import { doc, collection, query, where } from "firebase/firestore";

export default function ProfilPage() {
  const db = useFirestore();
  const currentSchoolId = 'smpn5-langke-rembong';
  
  const settingsRef = useMemo(() => db ? doc(db, "schools", currentSchoolId) : null, [db, currentSchoolId]);
  const { data: settings, loading: settingsLoading } = useDoc(settingsRef);

  const facilitiesRef = useMemo(() => {
    if (!db) return null;
    return query(
      collection(db, "facilities"), 
      where("schoolId", "==", currentSchoolId)
    );
  }, [db, currentSchoolId]);
  
  const { data: rawFacilities, loading: facilitiesLoading, error: facilitiesError } = useCollection(facilitiesRef);

  const publishedFacilities = useMemo(() => {
    return rawFacilities?.filter((f: any) => f.status === "Published") || [];
  }, [rawFacilities]);

  if (settingsLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary/30" strokeWidth={1.5} />
      </div>
    );
  }

  const schoolName = settings?.schoolName || "SMPN 5 Langke Rembong";
  const historyPhoto = settings?.historyPhotoUrl || "https://picsum.photos/seed/history/800/800";
  
  return (
    <div className="pt-24 bg-white animate-in fade-in duration-500">
      <section className="bg-primary py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary/5 skew-y-3 translate-y-20" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold font-headline mb-6 tracking-tighter uppercase">Profil Sekolah</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto font-medium">Mengenal lebih dekat perjalanan, nilai, dan infrastruktur unggulan {schoolName}.</p>
        </div>
      </section>

      <section id="sejarah" className="py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-20 items-center">
            <div className="w-full md:w-1/2 space-y-8">
              <div className="text-secondary font-bold tracking-widest uppercase text-xs px-4 py-2 bg-secondary/10 rounded-full inline-flex items-center gap-2">
                <History className="h-4 w-4" /> Sejarah Kami
              </div>
              <h2 className="text-5xl font-bold text-primary font-headline tracking-tighter leading-tight">Membangun Fondasi Pendidikan yang Kokoh</h2>
              <div className="space-y-6 text-slate-600 leading-relaxed text-lg font-medium whitespace-pre-line">
                {settings?.history || `${schoolName} didirikan dengan cita-cita mulia untuk menghadirkan standar pendidikan berkualitas tinggi yang mudah diakses secara global.`}
              </div>
            </div>
            <div className="w-full md:w-1/2 relative">
              <div className="rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-slate-50 bg-slate-50">
                 <img 
                  src={historyPhoto} 
                  alt="Sejarah Sekolah" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="visi-misi" className="py-32 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-16 rounded-[3.5rem] shadow-xl border border-slate-100 space-y-8">
              <div className="bg-primary/10 w-20 h-20 rounded-3xl flex items-center justify-center">
                <Target className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-4xl font-bold text-primary font-headline tracking-tighter">Visi Sekolah</h3>
              <p className="text-2xl text-slate-600 italic leading-relaxed font-medium">
                "{settings?.vision || "Menjadi lembaga pendidikan unggulan yang mencetak generasi bertakwa, berkarakter, dan berdaya saing global."}"
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
                )) : [
                  "Menyelenggarakan pendidikan holistik berbasis teknologi modern.",
                  "Mengembangkan potensi minat dan bakat siswa secara maksimal.",
                  "Menanamkan nilai-nilai religius dan etika dalam setiap aktivitas."
                ].map((m, i) => (
                  <li key={i} className="flex gap-4 items-start group">
                    <CheckCircle2 className="h-7 w-7 text-secondary shrink-0 mt-1" />
                    <span className="text-white/90 text-lg font-medium leading-snug">{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="fasilitas" className="py-32">
        <div className="container mx-auto px-4">
           <div className="text-center mb-20 space-y-6">
            <div className="text-secondary font-bold tracking-widest uppercase text-xs px-4 py-2 bg-secondary/10 rounded-full inline-flex items-center gap-2">
              <Building2 className="h-4 w-4" /> Sarana Prasarana
            </div>
            <h2 className="text-5xl font-bold text-primary font-headline tracking-tighter">Fasilitas Unggulan Kami</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Infrastruktur modern yang menunjang kreativitas dan produktivitas siswa.</p>
          </div>

          {facilitiesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-80 bg-slate-100 rounded-[2.5rem] animate-pulse shadow-sm" />
              ))}
            </div>
          ) : facilitiesError ? (
            <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-red-200 text-red-400">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
              <p className="font-bold">Gagal memuat data.</p>
              <p className="text-sm mt-2">Terjadi masalah koneksi ke database.</p>
            </div>
          ) : publishedFacilities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {publishedFacilities.map((f: any) => (
                <Card key={f.id} className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] group bg-white border border-slate-100">
                  <div className="relative h-64 overflow-hidden bg-slate-100">
                     <img 
                      src={f.imageUrl || `https://picsum.photos/seed/${f.id}/600/400`} 
                      alt={f.name || "Fasilitas"} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  </div>
                  <CardContent className="p-8">
                    <h4 className="text-2xl font-bold text-primary font-headline mb-3 group-hover:text-secondary transition-colors">{f.name || "Nama Fasilitas"}</h4>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed line-clamp-4">{f.description || "Tidak ada deskripsi tersedia."}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <Info className="h-16 w-16 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-bold text-lg">Belum ada fasilitas yang dipublikasikan.</p>
              <p className="text-slate-400 text-sm mt-2">Admin perlu mengatur status fasilitas menjadi <span className="text-green-600 font-bold uppercase">Published</span> di panel kontrol.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lokasi Section */}
      {settings?.googleMapsEmbedUrl && (
        <section id="lokasi" className="py-32 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <div className="text-secondary font-bold tracking-widest uppercase text-xs px-4 py-2 bg-secondary/10 rounded-full inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Lokasi Sekolah
              </div>
              <h2 className="text-5xl font-bold text-primary font-headline tracking-tighter">Temukan Kami</h2>
              <p className="text-slate-500 max-w-xl mx-auto font-medium">{settings.address}</p>
            </div>
            <div className="w-full h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white bg-white">
              <iframe 
                src={settings.googleMapsEmbedUrl} 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
