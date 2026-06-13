
"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  FileText, 
  MessageCircle, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  ShieldCheck,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";

export default function SPMBPage() {
  const db = useFirestore();
  const currentSchoolId = 'smpn5-langke-rembong';
  const settingsRef = useMemo(() => db ? doc(db, "schools", currentSchoolId) : null, [db]);
  const { data: settings, loading: settingsLoading } = useDoc(settingsRef);

  const whatsappNumber = settings?.whatsappNumber || "628123456789";
  const schoolName = settings?.schoolName || "Sekolah";
  const spmbYear = settings?.ppdbYear || "2024/2025";
  const isActive = settings?.ppdbIsActive !== false;
  const spmbSubtitle = settings?.ppdbSubtitle || `Sistem Penerimaan Peserta Didik Baru ${schoolName}.`;
  const heroImageUrl = settings?.heroImageUrl || "https://picsum.photos/seed/school1/1920/1080";

  const handleRegisterViaWA = () => {
    const message = `Halo Panitia SPMB ${schoolName},\n\nSaya ingin mendaftarkan anak saya sebagai calon siswa baru tahun ajaran ${spmbYear}. Mohon informasi mengenai langkah pendaftaran selanjutnya.\n\nTerima kasih.`;
    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  if (settingsLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950">
        <Loader2 className="h-10 w-10 animate-spin text-secondary" />
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="pt-32 pb-24 container mx-auto px-4 max-w-2xl text-center">
        <div className="bg-slate-50 p-16 rounded-[3rem] border-2 border-dashed border-slate-200">
           <AlertCircle className="h-16 w-16 text-slate-300 mx-auto mb-6" />
           <h2 className="text-3xl font-bold text-slate-700 font-headline mb-4">Pendaftaran SPMB Ditutup</h2>
           <p className="text-slate-500 mb-8">Mohon maaf, periode pendaftaran SPMB saat ini belum dibuka.</p>
           <Button variant="outline" className="rounded-full px-10" asChild><Link href="/">Kembali ke Beranda</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-0 pb-24 bg-background">
      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden bg-slate-950">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000"
          style={{ 
            backgroundImage: `url('${heroImageUrl}')`,
          }}
        />
        <div className="absolute inset-0 bg-slate-950/70 z-[1]" />
        
        <div className="container mx-auto px-4 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 rounded-full text-secondary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            <ShieldCheck className="h-4 w-4" /> Jalur Resmi Pendaftaran
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-headline text-white tracking-tighter uppercase drop-shadow-2xl">
            SPMB Online {spmbYear}
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-medium drop-shadow-lg">
            {spmbSubtitle}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Registration Area */}
          <div className="lg:col-span-2">
            <Card className="shadow-2xl border-none rounded-[3rem] overflow-hidden bg-white">
              <CardHeader className="p-8 md:p-12 border-b bg-slate-50/30">
                <CardTitle className="text-3xl md:text-4xl font-headline text-primary tracking-tight">Pendaftaran Praktis Melalui WhatsApp</CardTitle>
                <p className="text-slate-500 mt-4 leading-relaxed font-medium">
                  Kami mempermudah proses pendaftaran Anda. Cukup klik tombol di bawah untuk langsung terhubung dengan Panitia Pendaftaran kami di WhatsApp. Tim kami akan memandu Anda melalui setiap langkah pendaftaran.
                </p>
              </CardHeader>
              <CardContent className="p-8 md:p-12 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="bg-primary/10 h-12 w-12 rounded-2xl flex items-center justify-center shrink-0">
                      <Info className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary mb-1">Konsultasi</h4>
                      <p className="text-sm text-slate-500">Tanyakan persyaratan & biaya secara langsung.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="bg-secondary/10 h-12 w-12 rounded-2xl flex items-center justify-center shrink-0">
                      <FileText className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary mb-1">Kirim Berkas</h4>
                      <p className="text-sm text-slate-500">Kirim foto Akta & KK dengan mudah via chat.</p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleRegisterViaWA}
                  size="lg" 
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] py-10 text-xl md:text-2xl font-bold rounded-[2rem] shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-4 border-none text-white"
                >
                  <MessageCircle className="h-8 w-8" /> Daftar Sekarang via WhatsApp
                </Button>

                <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                  Aktif selama jam kerja operasional sekolah
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="p-8 bg-slate-50/50 border-b">
                <CardTitle className="text-xl flex items-center gap-3 text-primary">
                  <FileText className="h-6 w-6 text-secondary" /> Jalur Tersedia
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {settings?.ppdbQuotas?.length > 0 ? settings.ppdbQuotas.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-start gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                    <div>
                      <div className="font-bold text-primary text-base">{item.label}</div>
                      <div className="text-xs text-slate-500">{item.description}</div>
                    </div>
                    <div className="bg-secondary/10 text-secondary text-xs font-black px-3 py-1.5 rounded-lg shrink-0 uppercase">
                      {item.value}
                    </div>
                  </div>
                )) : <p className="text-sm text-slate-400 italic">Informasi kuota belum tersedia.</p>}
              </CardContent>
            </Card>

            <Card className="bg-primary text-white border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8">
                <CardTitle className="text-xl flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-secondary" /> Persyaratan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <ul className="space-y-4">
                  {settings?.ppdbRequirements?.length > 0 ? settings.ppdbRequirements.map((req: string, i: number) => (
                    <li key={i} className="flex gap-4 items-start">
                      <div className="h-2 w-2 rounded-full bg-secondary mt-2.5 shrink-0" />
                      <span className="text-white/80 text-sm font-medium">{req}</span>
                    </li>
                  )) : (
                    <>
                      <li className="flex gap-4 items-start"><div className="h-2 w-2 rounded-full bg-secondary mt-2.5 shrink-0" /><span className="text-white/80 text-sm font-medium">Lulus SD/MI Sederajat</span></li>
                      <li className="flex gap-4 items-start"><div className="h-2 w-2 rounded-full bg-secondary mt-2.5 shrink-0" /><span className="text-white/80 text-sm font-medium">Fotokopi Akta Kelahiran</span></li>
                      <li className="flex gap-4 items-start"><div className="h-2 w-2 rounded-full bg-secondary mt-2.5 shrink-0" /><span className="text-white/80 text-sm font-medium">Fotokopi Kartu Keluarga</span></li>
                    </>
                  )}
                </ul>
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest italic">
                    *Semua berkas dapat dikirim dalam bentuk foto melalui WhatsApp.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
