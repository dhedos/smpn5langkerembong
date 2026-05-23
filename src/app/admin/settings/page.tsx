
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Settings, Save, Sparkles, Wand2, Info } from "lucide-react";
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
    heroTitle: "",
    heroSubtitle: "",
    welcomeTitle: "",
    welcomeMessage: "",
    headmasterName: "",
    headmasterTitle: "",
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

  if (loading) return <div className="p-24">Loading...</div>;

  return (
    <div className="pt-24 pb-24 container mx-auto px-4 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-2">
            <Settings className="h-8 w-8 text-secondary" /> Pengaturan Website
          </h1>
          <p className="text-muted-foreground">Kelola teks dan konten utama halaman depan.</p>
        </div>
        <Button className="bg-primary flex gap-2" onClick={handleSave}>
          <Save className="h-4 w-4" /> Simpan Perubahan
        </Button>
      </div>

      <div className="space-y-8">
        <Card className="border-none shadow-xl">
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>Teks yang muncul pertama kali di bagian atas website.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Judul Utama (Hero Title)</Label>
              <Input 
                value={formData.heroTitle} 
                onChange={(e) => setFormData({...formData, heroTitle: e.target.value})}
                placeholder="Contoh: Membangun Masa Depan EduVista"
              />
            </div>
            <div className="space-y-2">
              <Label>Sub-judul (Hero Subtitle)</Label>
              <Textarea 
                value={formData.heroSubtitle} 
                onChange={(e) => setFormData({...formData, heroSubtitle: e.target.value})}
                placeholder="Deskripsi singkat di bawah judul utama."
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl">
          <CardHeader>
            <CardTitle>Sambutan Kepala Sekolah</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nama Kepala Sekolah</Label>
                <Input 
                  value={formData.headmasterName} 
                  onChange={(e) => setFormData({...formData, headmasterName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Gelar/Jabatan</Label>
                <Input 
                  value={formData.headmasterTitle} 
                  onChange={(e) => setFormData({...formData, headmasterTitle: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Judul Sambutan</Label>
              <Input 
                value={formData.welcomeTitle} 
                onChange={(e) => setFormData({...formData, welcomeTitle: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Pesan Sambutan</Label>
              <Textarea 
                className="min-h-[150px]"
                value={formData.welcomeMessage} 
                onChange={(e) => setFormData({...formData, welcomeMessage: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
