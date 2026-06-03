"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Settings, 
  Save, 
  Phone, 
  School, 
  BookOpen, 
  Target, 
  History as HistoryIcon, 
  Plus, 
  Trash2, 
  BarChart3, 
  FileText, 
  CheckCircle2,
  Users,
  GraduationCap,
  Award,
  ImageIcon,
  Layout,
  Type,
  Upload
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    heroImageUrl: "",
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
    stats: [
      { label: "Siswa Aktif", value: "850+", icon: "Users" },
      { label: "Guru & Staff", value: "65+", icon: "GraduationCap" },
      { label: "Prestasi Siswa", value: "120+", icon: "Award" },
      { label: "Ekstrakurikuler", value: "24", icon: "BookOpen" },
    ],
    ppdbYear: "2024/2025",
    ppdbIsActive: true,
    ppdbRequirements: [],
    ppdbQuotas: []
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentSettings) {
      setFormData((prev: any) => ({
        ...prev,
        ...currentSettings,
        mission: currentSettings.mission || [],
        stats: currentSettings.stats || prev.stats,
        ppdbRequirements: currentSettings.ppdbRequirements || [],
        ppdbQuotas: currentSettings.ppdbQuotas || []
      }));
    }
  }, [currentSettings]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast({ title: "File terlalu besar", description: "Maksimal ukuran file gambar adalah 1MB.", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev: any) => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!db) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, "settings", "general"), formData, { merge: true });
      toast({ title: "Berhasil", description: "Seluruh pengaturan telah disimpan secara permanen." });
    } catch (error: any) {
      console.error("Save error:", error);
      toast({ 
        title: "Gagal Menyimpan", 
        description: "Terjadi kesalahan saat menyimpan ke database.", 
        variant: "destructive" 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addItem = (field: string, defaultValue: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: [...(prev[field] || []), defaultValue] }));
  };

  const updateItem = (field: string, index: number, value: any) => {
    setFormData((prev: any) => {
      const newArray = [...(prev[field] || [])];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const removeItem = (field: string, index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_: any, i: number) => i !== index)
    }));
  };

  if (loading) return <div className="p-12 text-center text-muted-foreground animate-pulse font-medium italic">Menghubungkan ke Cloud Database...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold font-headline text-primary flex items-center gap-3">
            <div className="bg-secondary p-2.5 rounded-2xl">
              <Settings className="h-8 w-8 text-primary" />
            </div>
            Konfigurasi Website
          </h1>
          <p className="text-muted-foreground text-sm font-medium mt-1">Sesuaikan identitas dan statistik sekolah secara real-time.</p>
        </div>
        <Button 
          size="lg"
          className="bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20 flex gap-2 h-14 px-10 rounded-2xl font-bold text-lg" 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Menyimpan Data..." : "Simpan Perubahan"} <Save className="h-5 w-5" />
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-8">
        <TabsList className="bg-slate-100/80 p-1.5 rounded-2xl w-full md:w-auto flex overflow-x-auto h-auto backdrop-blur-sm border border-slate-200">
          <TabsTrigger value="general" className="rounded-xl px-8 py-3 font-bold">Identitas</TabsTrigger>
          <TabsTrigger value="hero" className="rounded-xl px-8 py-3 font-bold">Hero</TabsTrigger>
          <TabsTrigger value="welcome" className="rounded-xl px-8 py-3 font-bold">Sambutan</TabsTrigger>
          <TabsTrigger value="profile" className="rounded-xl px-8 py-3 font-bold">Visi Misi</TabsTrigger>
          <TabsTrigger value="stats" className="rounded-xl px-8 py-3 font-bold text-secondary">Statistik</TabsTrigger>
          <TabsTrigger value="ppdb" className="rounded-xl px-8 py-3 font-bold">PPDB Online</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b p-8">
                <CardTitle className="text-xl flex items-center gap-3"><School className="h-6 w-6 text-primary" /> Identitas Sekolah</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400">Nama Sekolah</Label>
                  <Input value={formData.schoolName} onChange={(e) => setFormData({...formData, schoolName: e.target.value})} className="h-12 bg-slate-50 border-slate-100 rounded-xl" />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400">Logo Sekolah (PNG/SVG)</Label>
                  <div className="flex flex-col gap-4">
                    {formData.schoolLogoUrl && (
                      <div className="h-32 w-32 relative border-2 border-slate-100 rounded-[2rem] bg-white p-4 flex items-center justify-center">
                        <img src={formData.schoolLogoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                      </div>
                    )}
                    <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "schoolLogoUrl")} className="h-12 cursor-pointer" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b p-8">
                <CardTitle className="text-xl flex items-center gap-3"><Phone className="h-6 w-6 text-primary" /> Kontak Resmi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400">WhatsApp Admin</Label>
                  <Input value={formData.whatsappNumber} onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})} className="h-12 bg-slate-50 border-slate-100 rounded-xl" />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400">Email Sekolah</Label>
                  <Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="h-12 bg-slate-50 border-slate-100 rounded-xl" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-8">
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b p-8 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-3"><BarChart3 className="h-6 w-6 text-primary" /> Statistik Sekolah</CardTitle>
                <CardDescription className="font-medium text-slate-400">Edit angka pencapaian yang tampil di Beranda.</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl font-bold border-primary text-primary hover:bg-primary/5" onClick={() => addItem("stats", { label: "Baru", value: "0", icon: "Users" })}>
                <Plus className="h-4 w-4 mr-2" /> Tambah Stat
              </Button>
            </CardHeader>
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.stats?.map((stat: any, i: number) => (
                <div key={i} className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6 relative group hover:bg-white hover:shadow-lg transition-all duration-300">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/5 rounded-full"
                    onClick={() => removeItem("stats", i)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest">Nama Statistik</Label>
                      <Input value={stat.label} onChange={(e) => updateItem("stats", i, {...stat, label: e.target.value})} className="bg-white rounded-xl h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest">Nilai/Angka</Label>
                      <Input value={stat.value} onChange={(e) => updateItem("stats", i, {...stat, value: e.target.value})} className="bg-white rounded-xl h-12 font-bold text-lg" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest">Ikon Representasi</Label>
                    <Select value={stat.icon} onValueChange={(val) => updateItem("stats", i, {...stat, icon: val})}>
                      <SelectTrigger className="bg-white h-12 rounded-xl">
                        <SelectValue placeholder="Pilih Ikon" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="Users">Ikon Siswa (Users)</SelectItem>
                        <SelectItem value="GraduationCap">Ikon Guru (Graduation)</SelectItem>
                        <SelectItem value="Award">Ikon Prestasi (Award)</SelectItem>
                        <SelectItem value="BookOpen">Ikon Ekskul (Book)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hero" className="space-y-8">
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b p-8">
              <CardTitle className="text-xl flex items-center gap-3"><ImageIcon className="h-6 w-6 text-primary" /> Tampilan Beranda Utama</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase text-slate-400">Judul Headline</Label>
                    <Input value={formData.heroTitle} onChange={(e) => setFormData({...formData, heroTitle: e.target.value})} className="h-14 font-bold text-lg bg-slate-50 border-slate-100 rounded-xl" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase text-slate-400">Sub-judul</Label>
                    <Textarea value={formData.heroSubtitle} onChange={(e) => setFormData({...formData, heroSubtitle: e.target.value})} className="min-h-[150px] bg-slate-50 border-slate-100 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400">Foto Hero (Latar Belakang)</Label>
                  <div className="relative aspect-video w-full border-2 border-slate-100 rounded-[2.5rem] overflow-hidden bg-slate-50 mb-4 flex items-center justify-center">
                    {formData.heroImageUrl ? (
                      <img src={formData.heroImageUrl} alt="Hero Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="h-12 w-12 text-slate-300" />
                    )}
                  </div>
                  <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "heroImageUrl")} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
