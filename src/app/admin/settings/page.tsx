
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Settings, 
  Save, 
  Phone, 
  School, 
  Image as ImageIcon, 
  BookOpen, 
  Target, 
  History as HistoryIcon, 
  Plus, 
  Trash2, 
  BarChart3, 
  Upload, 
  FileText, 
  CheckCircle2 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useFirestore, useDoc } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

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
    headmasterPhotoUrl: "",
    whatsappNumber: "",
    address: "",
    phone: "",
    email: "",
    history: "",
    vision: "",
    mission: [],
    stats: [],
    ppdbYear: "2024/2025",
    ppdbIsActive: true,
    ppdbRequirements: [],
    ppdbQuotas: []
  });

  useEffect(() => {
    if (currentSettings) {
      setFormData({
        ...formData,
        ...currentSettings,
        mission: currentSettings.mission || [],
        stats: currentSettings.stats || [],
        ppdbRequirements: currentSettings.ppdbRequirements || [],
        ppdbQuotas: currentSettings.ppdbQuotas || []
      });
    }
  }, [currentSettings]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast({ title: "File terlalu besar", description: "Maksimal ukuran file adalah 1MB.", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!db) return;
    try {
      await setDoc(doc(db, "settings", "general"), formData, { merge: true });
      toast({ title: "Berhasil", description: "Pengaturan telah disimpan secara permanen." });
    } catch (error) {
      toast({ title: "Gagal", description: "Terjadi kesalahan saat menyimpan.", variant: "destructive" });
    }
  };

  // Helper functions for arrays
  const addItem = (field: string, defaultValue: any) => {
    setFormData({ ...formData, [field]: [...formData[field], defaultValue] });
  };

  const updateItem = (field: string, index: number, value: any) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const removeItem = (field: string, index: number) => {
    const newArray = formData[field].filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, [field]: newArray });
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
          <Save className="h-4 w-4" /> Simpan Perubahan
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto flex flex-nowrap">
          <TabsTrigger value="general" className="rounded-lg px-6 shrink-0">Identitas</TabsTrigger>
          <TabsTrigger value="welcome" className="rounded-lg px-6 shrink-0">Sambutan</TabsTrigger>
          <TabsTrigger value="profile" className="rounded-lg px-6 shrink-0">Visi Misi</TabsTrigger>
          <TabsTrigger value="stats" className="rounded-lg px-6 shrink-0">Statistik</TabsTrigger>
          <TabsTrigger value="ppdb" className="rounded-lg px-6 shrink-0 text-secondary font-bold">PPDB Online</TabsTrigger>
        </TabsList>

        {/* Tab Umum */}
        <TabsContent value="general" className="space-y-6 animate-in fade-in duration-500">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="bg-slate-50/50">
                <CardTitle className="text-lg flex items-center gap-2"><School className="h-5 w-5" /> Identitas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-500">Nama Sekolah</Label>
                  <Input value={formData.schoolName} onChange={(e) => setFormData({...formData, schoolName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-500">Logo Sekolah</Label>
                  <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "schoolLogoUrl")} />
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardHeader className="bg-slate-50/50">
                <CardTitle className="text-lg flex items-center gap-2"><Phone className="h-5 w-5" /> Kontak</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-500">WhatsApp Admin</Label>
                  <Input value={formData.whatsappNumber} onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-500">Email Sekolah</Label>
                  <Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Sambutan */}
        <TabsContent value="welcome" className="animate-in fade-in duration-500">
          <Card className="border-none shadow-sm">
            <CardHeader className="bg-slate-50/50">
              <CardTitle className="text-lg">Sambutan Kepala Sekolah</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Nama Kepala Sekolah</Label>
                  <Input value={formData.headmasterName} onChange={(e) => setFormData({...formData, headmasterName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Foto (Unggah)</Label>
                  <Input type="file" onChange={(e) => handleFileChange(e, "headmasterPhotoUrl")} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Isi Pesan Sambutan</Label>
                <Textarea className="min-h-[200px]" value={formData.welcomeMessage} onChange={(e) => setFormData({...formData, welcomeMessage: e.target.value})} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab PPDB */}
        <TabsContent value="ppdb" className="space-y-6 animate-in fade-in duration-500">
          <Card className="border-none shadow-sm border-l-4 border-l-secondary">
            <CardHeader className="bg-slate-50/50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2 text-primary"><FileText className="h-5 w-5" /> Status & Tahun PPDB</CardTitle>
                <CardDescription>Atur periode aktif pendaftaran siswa baru.</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Label className="text-xs font-bold">{formData.ppdbIsActive ? "AKTIF" : "NONAKTIF"}</Label>
                <Switch 
                  checked={formData.ppdbIsActive} 
                  onCheckedChange={(val) => setFormData({...formData, ppdbIsActive: val})} 
                />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Tahun Pelajaran</Label>
                  <Input placeholder="E.g. 2024/2025" value={formData.ppdbYear} onChange={(e) => setFormData({...formData, ppdbYear: e.target.value})} />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="bg-slate-50/50 flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2"><CheckCircle2 className="h-5 w-5" /> Persyaratan</CardTitle>
                <Button variant="outline" size="sm" onClick={() => addItem("ppdbRequirements", "")} className="h-8 gap-1">
                  <Plus className="h-3 w-3" /> Tambah
                </Button>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                {formData.ppdbRequirements.map((req: string, i: number) => (
                  <div key={i} className="flex gap-2">
                    <Input value={req} onChange={(e) => updateItem("ppdbRequirements", i, e.target.value)} placeholder="E.g. Fotokopi Akte Kelahiran" />
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeItem("ppdbRequirements", i)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader className="bg-slate-50/50 flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Jalur & Kuota</CardTitle>
                <Button variant="outline" size="sm" onClick={() => addItem("ppdbQuotas", {label: "", value: "", description: ""})} className="h-8 gap-1">
                  <Plus className="h-3 w-3" /> Tambah
                </Button>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {formData.ppdbQuotas.map((q: any, i: number) => (
                  <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3 relative">
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Nama Jalur" value={q.label} onChange={(e) => updateItem("ppdbQuotas", i, {...q, label: e.target.value})} />
                      <Input placeholder="Kuota (%)" value={q.value} onChange={(e) => updateItem("ppdbQuotas", i, {...q, value: e.target.value})} />
                    </div>
                    <Input placeholder="Keterangan singkat" value={q.description} onChange={(e) => updateItem("ppdbQuotas", i, {...q, description: e.target.value})} />
                    <Button variant="ghost" size="sm" className="w-full text-destructive text-[10px]" onClick={() => removeItem("ppdbQuotas", i)}>HAPUS JALUR</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
