
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Upload, CheckCircle2, Info, FileText, UserPlus, HelpCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";

export default function PPDBPage() {
  const db = useFirestore();
  const settingsRef = useMemo(() => db ? doc(db, "settings", "general") : null, [db]);
  const { data: settings, loading } = useDoc(settingsRef);

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast({
      title: "Pendaftaran Berhasil",
      description: "Nomor registrasi Anda telah dikirimkan melalui WhatsApp/Email.",
    });
  };

  if (loading) return <div className="pt-32 text-center text-slate-400">Memuat informasi PPDB...</div>;

  const ppdbYear = settings?.ppdbYear || "2024/2025";
  const isActive = settings?.ppdbIsActive !== false;

  if (submitted) {
    return (
      <div className="pt-32 pb-24 container mx-auto px-4 max-w-2xl text-center">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-primary/10">
          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-primary font-headline mb-4">Terima Kasih!</h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Data pendaftaran putra-putri Anda telah kami terima. Tim admin akan melakukan verifikasi berkas dalam 2-3 hari kerja.
          </p>
          <div className="bg-primary/5 p-6 rounded-2xl mb-8">
            <div className="text-sm text-muted-foreground uppercase tracking-widest font-bold mb-2">Nomor Registrasi</div>
            <div className="text-4xl font-bold text-primary tracking-tighter">REG-{Math.floor(Math.random() * 9000) + 1000}</div>
          </div>
          <div className="flex flex-col gap-4">
            <Button size="lg" className="w-full bg-primary" onClick={() => typeof window !== 'undefined' && window.print()}>Cetak Bukti Pendaftaran</Button>
            <Button variant="outline" className="w-full rounded-2xl" onClick={() => setSubmitted(false)}>Daftar Lagi</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="pt-32 pb-24 container mx-auto px-4 max-w-2xl text-center">
        <div className="bg-slate-50 p-16 rounded-[3rem] border-2 border-dashed border-slate-200">
           <AlertCircle className="h-16 w-16 text-slate-300 mx-auto mb-6" />
           <h2 className="text-3xl font-bold text-slate-700 font-headline mb-4">Pendaftaran Ditutup</h2>
           <p className="text-slate-500 mb-8">Mohon maaf, periode pendaftaran siswa baru Tahun Pelajaran {ppdbYear} saat ini belum dibuka atau sudah berakhir.</p>
           <Button variant="outline" className="rounded-full px-10" asChild><Link href="/">Kembali ke Beranda</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 bg-background">
      {/* Header */}
      <section className="bg-primary py-24 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary/5 skew-y-3 translate-y-24" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold font-headline mb-6 tracking-tighter">Penerimaan Siswa Baru</h1>
          <p className="text-white/70 max-w-xl mx-auto text-xl">Tahun Pelajaran {ppdbYear}. Bergabunglah bersama komunitas belajar terbaik.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-2xl border-none rounded-[3rem] overflow-hidden">
              <CardHeader className="p-10 border-b bg-white">
                <div className="flex items-center gap-3 text-secondary font-bold text-sm uppercase tracking-widest mb-3">
                  <UserPlus className="h-5 w-5" /> Formulir Pendaftaran
                </div>
                <CardTitle className="text-3xl font-headline text-primary tracking-tight">Data Calon Siswa</CardTitle>
                <CardDescription className="text-base">Lengkapi data di bawah ini dengan informasi yang valid sesuai dokumen resmi.</CardDescription>
              </CardHeader>
              <CardContent className="p-10 bg-white">
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="fullname" className="text-slate-700 font-bold">Nama Lengkap Siswa</Label>
                      <Input id="fullname" className="h-12 rounded-xl bg-slate-50 border-slate-100" placeholder="Sesuai Ijazah" required />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="nisn" className="text-slate-700 font-bold">NISN</Label>
                      <Input id="nisn" className="h-12 rounded-xl bg-slate-50 border-slate-100" placeholder="10 Digit Nomor Induk" required />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="dob" className="text-slate-700 font-bold">Tanggal Lahir</Label>
                      <Input id="dob" type="date" className="h-12 rounded-xl bg-slate-50 border-slate-100" required />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="gender" className="text-slate-700 font-bold">Jenis Kelamin</Label>
                      <Select>
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

                  <div className="border-t pt-10">
                    <h3 className="text-2xl font-bold text-primary font-headline mb-8 flex items-center gap-2">
                       <div className="h-8 w-1 bg-secondary rounded-full" /> Data Orang Tua / Wali
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="parent" className="text-slate-700 font-bold">Nama Ayah/Ibu/Wali</Label>
                        <Input id="parent" className="h-12 rounded-xl bg-slate-50 border-slate-100" placeholder="Nama Lengkap" required />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="phone" className="text-slate-700 font-bold">Nomor WhatsApp</Label>
                        <Input id="phone" className="h-12 rounded-xl bg-slate-50 border-slate-100" placeholder="0812XXXXXXXX" required />
                      </div>
                    </div>
                  </div>

                  <Button size="lg" className="w-full bg-primary py-10 text-xl font-bold rounded-2xl shadow-2xl hover:translate-y-[-4px] transition-all">
                    Kirim Pendaftaran Sekarang
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-8">
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="p-8 bg-slate-50/50 border-b">
                <CardTitle className="text-xl flex items-center gap-3 text-primary">
                  <Info className="h-6 w-6 text-secondary" /> Jalur Pendaftaran
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {settings?.ppdbQuotas?.length > 0 ? settings.ppdbQuotas.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-start gap-4 group">
                    <div>
                      <div className="font-bold text-primary text-base group-hover:text-secondary transition-colors">{item.label}</div>
                      <div className="text-sm text-slate-500 font-medium">{item.description}</div>
                    </div>
                    <div className="bg-secondary/10 text-secondary text-sm font-bold px-3 py-1.5 rounded-xl shrink-0">
                      {item.value}
                    </div>
                  </div>
                )) : <p className="text-sm text-slate-400 italic">Informasi jalur belum tersedia.</p>}
              </CardContent>
            </Card>

            <Card className="bg-primary text-white border-none shadow-2xl rounded-[2.5rem] overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
              <CardHeader className="p-8">
                <CardTitle className="text-xl flex items-center gap-3">
                  <FileText className="h-6 w-6 text-secondary" /> Persyaratan Umum
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <ul className="space-y-4">
                  {settings?.ppdbRequirements?.length > 0 ? settings.ppdbRequirements.map((req: string, i: number) => (
                    <li key={i} className="flex gap-4 items-start">
                      <div className="h-2 w-2 rounded-full bg-secondary mt-2.5 shrink-0" />
                      <span className="text-white/80 text-base font-medium">{req}</span>
                    </li>
                  )) : <li className="text-white/50 italic">Persyaratan belum diatur.</li>}
                </ul>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full py-10 rounded-2xl flex items-center gap-3 border-2 border-primary/20 text-primary font-bold hover:bg-primary/5" asChild>
              <Link href="/faq">
                <HelpCircle className="h-6 w-6 text-secondary" /> Butuh Bantuan? Lihat FAQ
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
