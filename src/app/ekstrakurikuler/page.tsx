"use client";

import React, { useMemo } from "react";
import { Trophy, Calendar, CheckCircle2, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useFirestore, useCollection, useDoc } from "@/firebase";
import { collection, query, where, doc } from "firebase/firestore";

export default function VisitorEkstrakurikuler() {
  const db = useFirestore();
  const currentSchoolId = 'smpn5-langke-rembong';

  const settingsRef = useMemo(() => db ? doc(db, "schools", currentSchoolId) : null, [db]);
  const { data: settings, loading: settingsLoading } = useDoc(settingsRef);

  const extraQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "extracurriculars"), where("schoolId", "==", currentSchoolId));
  }, [db]);

  const { data: rawExtras, loading: extrasLoading } = useCollection(extraQuery);

  const extras = useMemo(() => {
    if (!rawExtras) return [];
    return rawExtras.filter((item: any) => item.status === "Published");
  }, [rawExtras]);

  const heroImageUrl = settings?.heroImageUrl || (settingsLoading ? "" : "https://picsum.photos/seed/school1/1920/1080");

  return (
    <div className="pt-0 bg-white min-h-screen">
      {/* Dynamic Hero Header */}
      <section className="relative h-[45vh] md:h-[55vh] flex items-center justify-center overflow-hidden bg-slate-950">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000"
          style={{ 
            backgroundImage: heroImageUrl ? `url('${heroImageUrl}')` : 'none',
            opacity: heroImageUrl ? 1 : 0
          }}
        />
        <div className="absolute inset-0 bg-slate-950/70 z-[1]" />
        
        <div className="container mx-auto px-4 relative z-10 text-center space-y-4 pt-16 md:pt-24">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold font-headline text-white tracking-tighter uppercase drop-shadow-2xl">
            Ekstrakurikuler
          </h1>
          <p className="text-sm md:text-xl text-white/80 max-w-2xl mx-auto font-medium drop-shadow-lg leading-relaxed">
            Wadah pengembangan bakat, minat, dan kreativitas siswa diluar jam akademik.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {extrasLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary/20" />
            </div>
          ) : extras.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {extras.map((item: any) => (
                <Card key={item.id} className="group border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-xl bg-white flex flex-col p-6">
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute bottom-4 left-4 bg-secondary text-primary text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl">
                      EKSTRAKURIKULER
                    </div>
                  </div>
                  <CardContent className="px-2 pt-8 pb-4 space-y-6 flex-1 flex flex-col">
                    <div className="space-y-3">
                      <h3 className="text-2xl md:text-4xl font-bold text-primary font-headline tracking-tight leading-none group-hover:text-secondary transition-colors">
                        {item.name}
                      </h3>
                      {item.schedule && (
                        <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                          <Calendar className="h-4 w-4 text-secondary" /> {item.schedule}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-slate-500 font-medium leading-relaxed flex-1 text-sm md:text-base tracking-wide">
                      {item.description}
                    </div>

                    <div className="pt-6 border-t border-slate-50 mt-auto">
                      <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
                        <CheckCircle2 className="h-4 w-4 text-green-500" /> Terbuka Untuk Seluruh Siswa
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <Trophy className="h-16 w-16 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 italic text-lg font-medium">Belum ada informasi ekstrakurikuler yang diterbitkan.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
