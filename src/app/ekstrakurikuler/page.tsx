
"use client";

import React, { useMemo } from "react";
import { Trophy, Calendar, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, where } from "firebase/firestore";

export default function VisitorEkstrakurikuler() {
  const db = useFirestore();
  const currentSchoolId = 'smpn5-langke-rembong';

  const extraQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "extracurriculars"), where("schoolId", "==", currentSchoolId));
  }, [db]);

  const { data: rawExtras, loading } = useCollection(extraQuery);

  const extras = useMemo(() => {
    if (!rawExtras) return [];
    return rawExtras.filter((item: any) => item.status === "Published");
  }, [rawExtras]);

  return (
    <div className="pt-24 bg-white min-h-screen">
      <section className="bg-primary py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary/5 skew-y-3 translate-y-20" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold font-headline mb-6 tracking-tighter uppercase">Ekstrakurikuler</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto font-medium">Wadah pengembangan bakat, minat, dan kreativitas siswa diluar jam akademik.</p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[1, 2, 3].map(i => <div key={i} className="h-96 bg-slate-100 rounded-[3rem] animate-pulse" />)}
            </div>
          ) : extras.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {extras.map((item: any) => (
                <Card key={item.id} className="group overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[3rem] bg-white flex flex-col">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute bottom-6 left-6 bg-secondary text-primary text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl">
                      EKSTRAKURIKULER
                    </div>
                  </div>
                  <CardContent className="p-10 space-y-6 flex-1 flex flex-col">
                    <div className="space-y-2">
                      <h3 className="text-3xl font-bold text-primary font-headline tracking-tight group-hover:text-secondary transition-colors">{item.name}</h3>
                      {item.schedule && (
                        <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                          <Calendar className="h-4 w-4 text-secondary" /> {item.schedule}
                        </div>
                      )}
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed flex-1">{item.description}</p>
                    <div className="pt-6 border-t border-slate-50">
                      <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
                        <CheckCircle2 className="h-4 w-4 text-green-500" /> Terbuka Untuk Seluruh Siswa
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <Trophy className="h-16 w-16 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 italic text-lg font-medium">Belum ada informasi ekstrakurikuler yang diterbitkan.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
