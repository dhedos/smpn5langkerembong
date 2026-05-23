
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Settings, Save, Phone, School, Image as ImageIcon, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useFirestore, useDoc } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const db = useFirestore();
  const settingsRef = useMemo(() => db ? doc(db, "settings", "general") : null, [db]);
  const { data: currentSettings, loading } = useDoc(settingsRef);

  const [formData, setFormData] = useState<any>({
    schoolName: "",
    schoolLogoUrl: "",
    heroTitle: "",
    heroSubtitle: "",
    welcomeTitle: "",
    welcomeMessage: "",
    headmasterName: "",
    headmasterTitle: "",
    whatsappNumber: "",
  });

  useEffect(() => {
    if (currentSettings) {
      setFormData(currentSettings);
    }
  }, [currentSettings]);

  const handleSave = async () => {
    if (!db) return;
    try {
      await setDoc(doc(db, "settings", "general"), formData, { merge: true });
      toast({ title: "Berhasil", description: "Pengaturan telah disimpan." });
    } catch (error) {
      toast({ title: "Gagal", description: "Terjadi kesalahan saat menyimpan.", variant: "destructive" });
    }
  };

  if (loading) return <div className="p-12 text-center text-muted-foreground animate-pulse">Memuat pengaturan...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-2">
            <Settings className="h-8 w-8 text-secondary" /> Konfigurasi Website
          </h1>
          <p className="text-muted-foreground text-sm">Kelola identitas, teks utama, dan integrasi WhatsApp sekolah.</p>
        </div>
        <Button className="bg-primary shadow-lg shadow-primary/20 flex gap-2" onClick={handleSave}>
          <Save className="h-4 w-4" /> Simpan Perubahan
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <Card className="border-none shadow-sm">
            <CardHeader className="bg-slate-50/50">
              <CardTitle className="text-lg">Identitas Sekolah</CardTitle>
              <CardDescription>Nama dan logo yang muncul di seluruh website.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500">Nama Sekolah</Label>
                <div className="relative">
                  <School className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    className="pl-9 bg-slate-50 border-slate-100"
                    value={formData.schoolName} 
                    onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                    placeholder="Contoh: EduVista SMP"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500">URL Logo Sekolah</Label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    className="pl-9 bg-slate-50 border-slate-100"
                    value={formData.schoolLogoUrl} 
                    onChange={(e) => setFormData({...formData, schoolLogoUrl: e.target.value})}
                    placeholder="https://link-ke-gambar-logo.png"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground italic">Gunakan format PNG/SVG transparan untuk hasil terbaik.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="bg-slate-50/50">
              <CardTitle className="text-lg">Integrasi Kontak</CardTitle>
              <CardDescription>Atur nomor WhatsApp admin sekolah.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500">Nomor WhatsApp</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    className="pl-9 bg-slate-50 border-slate-100"
                    value={formData.whatsappNumber} 
                    onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})}
                    placeholder="628123456789"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">Format: Kode negara + nomor (Contoh: 62812...).</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-none shadow-sm">
            <CardHeader className="bg-slate-50/50">
              <CardTitle className="text-lg">Tampilan Beranda (Hero)</CardTitle>
              <CardDescription>Ubah teks promosi di halaman depan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500">Judul Utama</Label>
                <Input 
                  className="bg-slate-50 border-slate-100"
                  value={formData.heroTitle} 
                  onChange={(e) => setFormData({...formData, heroTitle: e.target.value})}
                  placeholder="Membangun Masa Depan"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500">Sub-judul</Label>
                <Textarea 
                  className="bg-slate-50 border-slate-100 min-h-[100px]"
                  value={formData.heroSubtitle} 
                  onChange={(e) => setFormData({...formData, heroSubtitle: e.target.value})}
                  placeholder="Deskripsi singkat mengenai sekolah."
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-primary/5 border-primary/10">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-secondary" /> Info Tambahan
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 leading-relaxed">
              Perubahan yang Anda simpan di sini akan berdampak langsung pada seluruh halaman publik website. Pastikan informasi yang dimasukkan sudah benar dan profesional.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
