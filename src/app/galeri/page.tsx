
"use client";

import React, { useMemo } from "react";
import { Camera, Calendar, Loader2 } from "lucide-react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";

export default function VisitorGaleri() {
  const db = useFirestore();
  
  const galleryQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "gallery"), orderBy("date", "desc"));
  }, [db]);

  const { data: photos, loading } = useCollection(galleryQuery);

  return (
    <div className="pt-24 bg-white min-h-screen">
      {/* Header Section */}
      <section className="bg-primary py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary/5 skew-y-3 translate-y-20" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold font-headline mb-6 tracking-tighter uppercase">Dokumentasi Sekolah</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto font-medium">Melihat kembali momen-momen berharga dan prestasi luar biasa siswa kami.</p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="space-y-6 animate-pulse">
                  <div className="aspect-square bg-slate-50 rounded-[3.5rem]" />
                  <div className="h-6 bg-slate-50 rounded-xl w-3/4 mx-auto" />
                </div>
              ))}
            </div>
          ) : photos && photos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-16 gap-x-12">
              {photos.map((photo: any) => (
                <div key={photo.id} className="group flex flex-col items-center text-center space-y-6">
                  {/* Image Container with Squircle Corners */}
                  <div className="relative aspect-square w-full rounded-[3.5rem] overflow-hidden shadow-2xl border-[12px] border-slate-50 bg-slate-100 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-primary/10">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  
                  {/* Visible Title & Date */}
                  <div className="px-4 space-y-2">
                    <h3 className="text-primary text-xl font-bold font-headline uppercase tracking-tighter leading-tight group-hover:text-secondary transition-colors">
                      {photo.title}
                    </h3>
                    <div className="flex items-center justify-center gap-2 text-slate-400 text-[10px] font-extrabold uppercase tracking-[0.2em]">
                      <Calendar className="h-4 w-4 text-secondary" />
                      <span>{photo.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200">
              <Camera className="h-20 w-20 text-slate-200 mx-auto mb-6" />
              <p className="text-slate-400 italic text-xl font-medium">Belum ada dokumentasi foto yang dipublikasikan.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
