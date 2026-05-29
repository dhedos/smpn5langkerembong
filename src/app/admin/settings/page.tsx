
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Settings, Save, Phone, School, Image as ImageIcon, Sparkles, BookOpen, Target, History as HistoryIcon, Plus, Trash2, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useFirestore, useDoc } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    history: "",
    vision: "",
    mission: [],
    stats: []
  });

  useEffect(() => {
    if (currentSettings) {
      setFormData({
        ...currentSettings,
        mission: currentSettings.mission || [],
        stats: currentSettings.stats || []
      });
    }
  }, [currentSettings]);

  const handleSave = async () => {
    if (!db) return;
    try {
      await setDoc(doc(db, "settings", "general"), formData, { merge: true });
      toast({ title: "Berhasil", description: "Pengaturan telah disimpan secara permanen." });
    } catch (error) {
      toast({ title: "Gagal", description: "Terjadi kesalahan saat menyimpan.", variant: "destructive" });
    }
  };

  const addMission = () => {
    setFormData({ ...formData, mission: [...formData.mission, ""] });
  };

  const updateMission = (index: number, value: string) => {
    const newMission = [...formData.mission];
    newMission[index] = value;
    setFormData({ ...formData, mission: newMission });
  };

  const removeMission = (index: number) => {
    const newMission = formData.mission.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, mission: newMission });
  };

  const addStat = () => {
    setFormData({ ...formData, stats: [...formData.stats, { label: "", value: "", icon: "Users" }] });
  };

  const updateStat = (index: number, field: string, value: string) => {
    const newStats = [...formData.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setFormData({ ...formData, stats: newStats });
  };

  const removeStat = (index: number) => {
    const newStats = formData.stats.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, stats: newStats });
  };

  if (loading) return <div className="p-12 text-center text-muted-foreground animate-pulse">Memuat pengaturan...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-2">
            <Settings className="h-8 w-8 text-secondary" /> Konfigurasi Website
          </h1>
          <p className="text-muted-foreground text-sm">Kelola seluruh konten tekstual dan identitas sekolah Anda.</p>
        </div>
        <Button className="bg-primary shadow-lg shadow-primary/20 flex gap-2" onClick={handleSave}>
          <Save className="h-4 w-4" /> Simpan Semua Perubahan
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="general" className="rounded-lg px-6">Umum & Identitas</TabsTrigger>
          <TabsTrigger value="welcome" className="rounded-lg px-6">Sambutan</TabsTrigger>
          <TabsTrigger value="profile" className="rounded-lg px-6">Profil & Visi Misi</TabsTrigger>
          <TabsTrigger value="stats" className="rounded-lg px-6">Statistik</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="bg-slate-50/50">
                <CardTitle className="text-lg flex items-center gap-2"><School className="h-5 w-5" /> Identitas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-500">Nama Sekolah</Label>
                  <Input 
                    className="bg-slate-50 border-slate-100"
                    value={formData.schoolName} 
                    onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-500">Nomor WhatsApp Admin</Label>
                  <Input 
                    className="bg-slate-50 border-slate-100"
                    placeholder="E.g. 62812345678"
                    value={formData.whatsappNumber} 
                    onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-500">URL Logo Sekolah</Label>
                  <Input 
                    className="bg-slate-50 border-slate-100"
                    value={formData.schoolLogoUrl} 
                    onChange={(e) => setFormData({...formData, schoolLogoUrl: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader className="bg-slate-50/50">
                <CardTitle className="text-lg flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Hero Utama</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-500">Judul Hero</Label>
                  <Input 
                    className="bg-slate-50 border-slate-100"
                    value={formData.heroTitle} 
                    onChange={(e) => setFormData({...formData, heroTitle: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-500">Sub-judul Hero</Label>
                  <Textarea 
                    className="bg-slate-50 border-slate-100"
                    value={formData.heroSubtitle} 
                    onChange={(e) => setFormData({...formData, heroSubtitle: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="welcome" className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="bg-slate-50/50">
              <CardTitle className="text-lg">Editor Sambutan Kepala Sekolah</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-500">Nama Kepala Sekolah</Label>
                  <Input value={formData.headmasterName} onChange={(e) => setFormData({...formData, headmasterName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-500">Jabatan/Gelar</Label>
                  <Input value={formData.headmasterTitle} onChange={(e) => setFormData({...formData, headmasterTitle: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500">Pesan Sambutan</Label>
                <Textarea 
                  className="min-h-[200px]"
                  value={formData.welcomeMessage} 
                  onChange={(e) => setFormData({...formData, welcomeMessage: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="bg-slate-50/50">
              <CardTitle className="text-lg flex items-center gap-2"><HistoryIcon className="h-5 w-5" /> Sejarah Sekolah</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Textarea 
                className="min-h-[250px]"
                placeholder="Tuliskan sejarah berdirinya sekolah..."
                value={formData.history}
                onChange={(e) => setFormData({...formData, history: e.target.value})}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="bg-slate-50/50">
                <CardTitle className="text-lg flex items-center gap-2"><Target className="h-5 w-5" /> Visi</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Textarea 
                  placeholder="Tuliskan visi sekolah..."
                  value={formData.vision}
                  onChange={(e) => setFormData({...formData, vision: e.target.value})}
                />
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader className="bg-slate-50/50 flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2"><BookOpen className="h-5 w-5" /> Misi</CardTitle>
                <Button variant="outline" size="sm" onClick={addMission} className="h-8 gap-1">
                  <Plus className="h-3 w-3" /> Tambah Misi
                </Button>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                {formData.mission.map((m: string, i: number) => (
                  <div key={i} className="flex gap-2">
                    <Input value={m} onChange={(e) => updateMission(i, e.target.value)} placeholder={`Misi ke-${i+1}`} />
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeMission(i)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="bg-slate-50/50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Statistik Sekolah</CardTitle>
                <CardDescription>Angka yang ditampilkan di bagian atas beranda.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={addStat} className="h-8 gap-1">
                <Plus className="h-3 w-3" /> Tambah Stat
              </Button>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {formData.stats.map((s: any, i: number) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-slate-50 p-4 rounded-xl relative border border-slate-100">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold">Label</Label>
                    <Input value={s.label} onChange={(e) => updateStat(i, "label", e.target.value)} placeholder="Siswa Aktif" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold">Value</Label>
                    <Input value={s.value} onChange={(e) => updateStat(i, "value", e.target.value)} placeholder="850+" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold">Icon (Lucide)</Label>
                    <Input value={s.icon} onChange={(e) => updateStat(i, "icon", e.target.value)} placeholder="Users / Award" />
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => removeStat(i)} className="md:w-fit">Hapus</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
