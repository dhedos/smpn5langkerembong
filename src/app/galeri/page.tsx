
"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { Camera, Calendar } from "lucide-react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";

export default function VisitorGaleri() {
  const db = useFirestore();
  const galleryQuery = useMemo(() => db ? query(collection(db, "gallery"), orderBy("createdAt", "desc")) : null, [db]);
  const { data: photos, loading } = useCollection(galleryQuery);

  return (
    <div className="pt-24 bg-white min-h-screen">
      <section className="bg-primary py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary/5 skew-y-3 translate-y-20" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold font-headline mb-6 tracking-tighter">Galeri Sekolah</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto font-medium">Dokumentasi momen berharga dan kegiatan siswa-siswi EduVista SMP.</p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="aspect-square bg-slate-100 rounded-3xl" />
              ))}
            </div>
          ) : photos && photos.length > 0 ? (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
              {photos.map((photo: any) => (
                <div key={photo.id} className="relative group break-inside-avoid rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <h3 className="text-white text-xl font-bold font-headline mb-2">{photo.title}</h3>
                    <div className="flex items-center gap-2 text-white/70 text-xs">
                      <Calendar className="h-3 w-3" />
                      <span>{photo.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 space-y-4">
              <Camera className="h-16 w-16 text-slate-200 mx-auto" />
              <p className="text-slate-400 italic text-lg">Belum ada dokumentasi foto yang diunggah.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
