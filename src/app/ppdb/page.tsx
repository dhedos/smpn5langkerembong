
"use client";

import React, { useState } from "react";
import { Upload, CheckCircle2, Info, FileText, UserPlus, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

export default function PPDBPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast({
      title: "Pendaftaran Berhasil",
      description: "Nomor registrasi Anda telah dikirimkan melalui WhatsApp/Email.",
    });
  };

  if (submitted) {
    return (
      <div className="pt-32 pb-24 container mx-auto px-4 max-w-2xl text-center">
        <div className="bg-white p-12 rounded-3xl shadow-2xl border border-primary/10">
          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-primary font-headline mb-4">Terima Kasih!</h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Data pendaftaran putra-putri Anda telah kami terima. Tim admin akan melakukan verifikasi berkas dalam 2-3 hari kerja.
          </p>
          <div className="bg-primary/5 p-6 rounded-2xl mb-8">
            <div className="text-sm text-muted-foreground uppercase tracking-widest font-bold mb-2">Nomor Registrasi</div>
            <div className="text-4xl font-bold text-primary tracking-tighter">PPDB-2024-0891</div>
          </div>
          <div className="flex flex-col gap-4">
            <Button size="lg" className="w-full bg-primary" onClick={() => window.print()}>Cetak Bukti Pendaftaran</Button>
            <Button variant="outline" className="w-full" onClick={() => setSubmitted(false)}>Daftar Lagi</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 bg-background">
      {/* Header */}
      <section className="bg-primary py-16 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Penerimaan Siswa Baru</h1>
          <p className="text-white/70 max-w-xl mx-auto">Tahun Pelajaran 2024/2025. Bergabunglah bersama komunitas belajar terbaik.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-2xl border-none rounded-3xl">
              <CardHeader className="p-8 border-b">
                <div className="flex items-center gap-3 text-secondary font-bold text-sm uppercase tracking-widest mb-2">
                  <UserPlus className="h-4 w-4" /> Formulir Pendaftaran
                </div>
                <CardTitle className="text-2xl font-headline text-primary">Data Calon Siswa</CardTitle>
                <CardDescription>Lengkapi data di bawah ini dengan informasi yang valid.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullname">Nama Lengkap Siswa</Label>
                      <Input id="fullname" placeholder="Masukkan nama sesuai ijazah" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nisn">NISN</Label>
                      <Input id="nisn" placeholder="10 digit Nomor Induk" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pob">Tempat Lahir</Label>
                      <Input id="pob" placeholder="Kota Kelahiran" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Tanggal Lahir</Label>
                      <Input id="dob" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Jenis Kelamin</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="L">Laki-laki</SelectItem>
                          <SelectItem value="P">Perempuan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="school">Asal Sekolah (SD/MI)</Label>
                      <Input id="school" placeholder="Nama sekolah asal" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Alamat Lengkap</Label>
                    <Textarea id="address" placeholder="Jalan, No Rumah, RT/RW, Kelurahan, Kecamatan" required />
                  </div>

                  <div className="border-t pt-8">
                    <h3 className="text-xl font-bold text-primary font-headline mb-6">Data Orang Tua / Wali</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="parent">Nama Ayah/Ibu/Wali</Label>
                        <Input id="parent" placeholder="Nama lengkap orang tua" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Nomor WhatsApp Aktif</Label>
                        <Input id="phone" placeholder="0812XXXXXXXX" required />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-8">
                    <h3 className="text-xl font-bold text-primary font-headline mb-6">Upload Dokumen (Format PDF/JPG)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {["Kartu Keluarga", "Akte Kelahiran", "Ijazah/SKL"].map((doc) => (
                        <div key={doc} className="border-2 border-dashed border-muted rounded-2xl p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer group">
                          <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2 group-hover:text-primary" />
                          <div className="text-xs font-bold text-primary uppercase">{doc}</div>
                          <div className="text-[10px] text-muted-foreground mt-1">Klik untuk upload</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button size="lg" className="w-full bg-primary py-8 text-lg font-bold rounded-2xl shadow-xl hover:translate-y-[-2px] transition-all">
                    Kirim Pendaftaran
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            <Card className="glass border-none shadow-xl">
              <CardHeader className="p-6">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="h-5 w-5 text-secondary" /> Informasi Jalur
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                {[
                  { label: "Jalur Zonasi", quota: "50%", desc: "Berdasarkan jarak tempat tinggal" },
                  { label: "Jalur Prestasi", quota: "30%", desc: "Akademik & Non-Akademik" },
                  { label: "Jalur Afirmasi", quota: "15%", desc: "Keluarga kurang mampu" },
                  { label: "Pindahan Orang Tua", quota: "5%", desc: "Mutasi tugas wali" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-start gap-4">
                    <div>
                      <div className="font-bold text-primary text-sm">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.desc}</div>
                    </div>
                    <div className="bg-secondary/10 text-secondary text-xs font-bold px-2 py-1 rounded">
                      {item.quota}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-primary text-white border-none shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
              <CardHeader className="p-6">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-secondary" /> Persyaratan Umum
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <ul className="text-sm space-y-3 text-white/80">
                  <li className="flex gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
                    Berusia maksimal 15 tahun pada 1 Juli 2024.
                  </li>
                  <li className="flex gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
                    Telah lulus dari SD/MI atau sederajat.
                  </li>
                  <li className="flex gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
                    Menyerahkan fotokopi Rapor kelas 4-6.
                  </li>
                  <li className="flex gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
                    Pas foto 3x4 (3 lembar).
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full py-8 rounded-2xl flex items-center gap-2" asChild>
              <Link href="/faq">
                <HelpCircle className="h-5 w-5" /> Butuh Bantuan? Lihat FAQ
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
