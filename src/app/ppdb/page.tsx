"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, FileText, UserPlus, AlertCircle, Loader2, Upload, FileUp, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";
import { cn } from "@/lib/utils";

export default function SPMBPage() {
  const db = useFirestore();
  const currentSchoolId = 'smpn5-langke-rembong';
  const settingsRef = useMemo(() => db ? doc(db, "schools", currentSchoolId) : null, [db]);
  const { data: settings, loading: settingsLoading } = useDoc(settingsRef);

  const [submitted, setSubmitted] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState<string | null>(null);
  
  // States untuk berkas
  const [aktaFile, setAktaFile] = useState<string | null>(null);
  const [kkFile, setKkFile] = useState<string | null>(null);
  const [ijazahFile, setIjazahFile] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Perbaikan Hydration: Generate nomor acak hanya di client setelah interaksi formulir selesai
  useEffect(() => {
    if (submitted && !registrationNumber) {
      setRegistrationNumber(`SPMB-${Math.floor(Math.random() * 9000) + 1000}`);
    }
  }, [submitted, registrationNumber]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void, label: string) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast({ 
          title: "File Terlalu Besar", 
          description: `Ukuran ${label} maksimal 1MB.`, 
          variant: "destructive" 
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
        toast({ title: "Berkas Terpilih", description: `${label} berhasil dilampirkan.` });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulasi pengiriman data
    setTimeout(() => {
      setSubmitted(true);
      setIsProcessing(false);
      toast({
        title: "Pendaftaran Berhasil",
        description: "Data dan berkas pendaftaran Anda telah kami terima.",
      });
    }, 1500);
  };

  if (settingsLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950">
        <Loader2 className="h-10 w-10 animate-spin text-secondary" />
      </div>
    );
  }

  const spmbYear = settings?.ppdbYear || "2024/2025";
  const isActive = settings?.ppdbIsActive !== false;
  const spmbSubtitle = settings?.ppdbSubtitle || `Sistem Penerimaan Peserta Didik Baru (${settings?.schoolName || "Sekolah"}).`;
  
  const heroImageUrl = settings?.heroImageUrl || "https://picsum.photos/seed/school1/1920/1080";

  if (submitted) {
    return (
      <div className="pt-32 pb-24 container mx-auto px-4 max-w-2xl text-center">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-primary/10">
          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-primary font-headline mb-4">Terima Kasih!</h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Data dan berkas pendaftaran SPMB Anda telah kami terima. Tim panitia akan melakukan verifikasi berkas segera.
          </p>
          <div className="bg-primary/5 p-6 rounded-2xl mb-8">
            <div className="text-sm text-muted-foreground uppercase tracking-widest font-bold mb-2">Nomor Registrasi</div>
            <div className="text-4xl font-bold text-primary tracking-tighter">
              {registrationNumber || "MEMPROSES..."}
            </div>
          </div>
          <Button variant="outline" className="w-full rounded-2xl" onClick={() => { setSubmitted(false); setRegistrationNumber(null); setAktaFile(null); setKkFile(null); setIjazahFile(null); }}>Daftar Lagi</Button>
        </div>
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
      {/* Header Dinamis */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden bg-slate-950">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000"
          style={{ 
            backgroundImage: `url('${heroImageUrl}')`,
          }}
        />
        <div className="absolute inset-0 bg-slate-950/70 z-[1]" />
        
        <div className="container mx-auto px-4 relative z-10 text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold font-headline text-white tracking-tighter uppercase drop-shadow-2xl">
            SPMB Online
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-medium drop-shadow-lg">
            {spmbSubtitle}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <Card className="shadow-2xl border-none rounded-[3rem] overflow-hidden bg-white">
              <CardHeader className="p-8 md:p-10 border-b">
                <div className="flex items-center gap-3 text-secondary font-bold text-sm uppercase tracking-widest mb-3">
                  <UserPlus className="h-5 w-5" /> Formulir Pendaftaran
                </div>
                <CardTitle className="text-3xl font-headline text-primary tracking-tight">Data Calon Pendaftar {spmbYear}</CardTitle>
              </CardHeader>
              <CardContent className="p-8 md:p-10 space-y-12">
                <form onSubmit={handleSubmit} className="space-y-12">
                  {/* Seksi Data Diri */}
                  <div className="space-y-6">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b pb-2">I. Data Diri</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="fullname" className="text-slate-700 font-bold">Nama Lengkap</Label>
                        <Input id="fullname" className="h-12 rounded-xl bg-slate-50 border-slate-100" placeholder="Sesuai Ijazah" required />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="gender" className="text-slate-700 font-bold">Jenis Kelamin</Label>
                        <Select required>
                          <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100">
                            <SelectValue placeholder="Pilih" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="L">Laki-laki</SelectItem>
                            <SelectItem value="P">Perempuan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Seksi Upload Berkas */}
                  <div className="space-y-6">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b pb-2">II. Dokumen Pendukung (Maks 1MB)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Akta Kelahiran */}
                      <div className="space-y-3">
                        <Label className="text-xs font-bold text-slate-500 uppercase">Scan Akta Kelahiran</Label>
                        <div className={cn(
                          "relative aspect-[4/3] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer group",
                          aktaFile ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-200 hover:border-primary/30"
                        )}>
                          {aktaFile ? <FileCheck className="h-10 w-10 text-green-500" /> : <FileUp className="h-10 w-10 text-slate-300 group-hover:text-primary/30" />}
                          <span className={cn("text-[10px] font-bold mt-2 uppercase tracking-widest", aktaFile ? "text-green-600" : "text-slate-400")}>
                            {aktaFile ? "Terlampir" : "Pilih Berkas"}
                          </span>
                          <input 
                            type="file" 
                            accept=".pdf,image/*" 
                            onChange={(e) => handleFileChange(e, setAktaFile, "Akta Kelahiran")} 
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                            required 
                          />
                        </div>
                      </div>

                      {/* Kartu Keluarga */}
                      <div className="space-y-3">
                        <Label className="text-xs font-bold text-slate-500 uppercase">Scan Kartu Keluarga</Label>
                        <div className={cn(
                          "relative aspect-[4/3] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer group",
                          kkFile ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-200 hover:border-primary/30"
                        )}>
                          {kkFile ? <FileCheck className="h-10 w-10 text-green-500" /> : <FileUp className="h-10 w-10 text-slate-300 group-hover:text-primary/30" />}
                          <span className={cn("text-[10px] font-bold mt-2 uppercase tracking-widest", kkFile ? "text-green-600" : "text-slate-400")}>
                            {kkFile ? "Terlampir" : "Pilih Berkas"}
                          </span>
                          <input 
                            type="file" 
                            accept=".pdf,image/*" 
                            onChange={(e) => handleFileChange(e, setKkFile, "Kartu Keluarga")} 
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                            required 
                          />
                        </div>
                      </div>

                      {/* Ijazah / SKL */}
                      <div className="space-y-3">
                        <Label className="text-xs font-bold text-slate-500 uppercase">Scan Ijazah / SKL</Label>
                        <div className={cn(
                          "relative aspect-[4/3] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer group",
                          ijazahFile ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-200 hover:border-primary/30"
                        )}>
                          {ijazahFile ? <FileCheck className="h-10 w-10 text-green-500" /> : <FileUp className="h-10 w-10 text-slate-300 group-hover:text-primary/30" />}
                          <span className={cn("text-[10px] font-bold mt-2 uppercase tracking-widest", ijazahFile ? "text-green-600" : "text-slate-400")}>
                            {ijazahFile ? "Terlampir" : "Pilih Berkas"}
                          </span>
                          <input 
                            type="file" 
                            accept=".pdf,image/*" 
                            onChange={(e) => handleFileChange(e, setIjazahFile, "Ijazah/SKL")} 
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                            required 
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 italic">Format yang didukung: PDF, JPG, PNG. Pastikan dokumen terlihat jelas.</p>
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full bg-primary py-8 text-xl font-bold rounded-2xl shadow-xl hover:scale-[1.01] transition-transform"
                    disabled={isProcessing}
                  >
                    {isProcessing ? <Loader2 className="h-6 w-6 animate-spin mr-2" /> : <Upload className="h-6 w-6 mr-2" />}
                    {isProcessing ? "Mengirim Data..." : "Kirim Pendaftaran"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="p-8 bg-slate-50/50 border-b">
                <CardTitle className="text-xl flex items-center gap-3 text-primary">
                  <UserPlus className="h-6 w-6 text-secondary" /> Jalur SPMB
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {settings?.ppdbQuotas?.length > 0 ? settings.ppdbQuotas.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-start gap-4">
                    <div>
                      <div className="font-bold text-primary text-base">{item.label}</div>
                      <div className="text-sm text-slate-500">{item.description}</div>
                    </div>
                    <div className="bg-secondary/10 text-secondary text-sm font-bold px-3 py-1.5 rounded-xl shrink-0">
                      {item.value}
                    </div>
                  </div>
                )) : <p className="text-sm text-slate-400 italic">Informasi kuota belum tersedia.</p>}
              </CardContent>
            </Card>

            <Card className="bg-primary text-white border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8">
                <CardTitle className="text-xl flex items-center gap-3">
                  <FileText className="h-6 w-6 text-secondary" /> Persyaratan Utama
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <ul className="space-y-4">
                  {settings?.ppdbRequirements?.length > 0 ? settings.ppdbRequirements.map((req: string, i: number) => (
                    <li key={i} className="flex gap-4 items-start">
                      <div className="h-2 w-2 rounded-full bg-secondary mt-2.5 shrink-0" />
                      <span className="text-white/80 text-base">{req}</span>
                    </li>
                  )) : (
                    <>
                      <li className="flex gap-4 items-start"><div className="h-2 w-2 rounded-full bg-secondary mt-2.5 shrink-0" /><span className="text-white/80 text-base">Lulus SD/MI Sederajat</span></li>
                      <li className="flex gap-4 items-start"><div className="h-2 w-2 rounded-full bg-secondary mt-2.5 shrink-0" /><span className="text-white/80 text-base">Mengisi formulir dengan data asli</span></li>
                      <li className="flex gap-4 items-start"><div className="h-2 w-2 rounded-full bg-secondary mt-2.5 shrink-0" /><span className="text-white/80 text-base">Melampirkan berkas scan asli</span></li>
                    </>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
