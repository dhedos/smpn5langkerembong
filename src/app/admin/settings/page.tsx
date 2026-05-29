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
  Layout
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
      if (file.size > 800 * 1024) {
        toast({ title: "File terlalu besar", description: "Maksimal ukuran file gambar adalah 800KB.", variant: "destructive" });
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
      toast({ title: "Berhasil", description: "Pengaturan telah disimpan secara permanen." });
    } catch (error: any) {
      console.error("Save error:", error);
      toast({ 
        title: "Gagal Menyimpan", 
        description: "Terjadi kesalahan saat menyimpan.", 
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

  if (loading) return <div className="p-12 text-center text-muted-foreground animate-pulse">Memuat pengaturan...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-2">
            <Settings className="h-8 w-8 text-secondary" /> Konfigurasi Website
          </h1>
          <p className="text-muted-foreground text-sm">Kelola seluruh konten website sekolah Anda.</p>
        </div>
        <Button 
          className="bg-primary shadow-lg shadow-primary/20 flex gap-2" 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-xl w-full md:w-auto flex overflow-x-auto h-auto">
          <TabsTrigger value="general" className="rounded-lg px-6 py-2">Identitas</TabsTrigger>
          <TabsTrigger value="hero" className="rounded-lg px-6 py-2">Hero Section</TabsTrigger>
          <TabsTrigger value="welcome" className="rounded-lg px-6 py-2">Sambutan</TabsTrigger>
          <TabsTrigger value="profile" className="rounded-lg px-6 py-2">Visi Misi</TabsTrigger>
          <TabsTrigger value="stats" className="rounded-lg px-6 py-2">Statistik</TabsTrigger>
          <TabsTrigger value="ppdb" className="rounded-lg px-6 py-2 text-secondary font-bold">PPDB Online</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="bg-slate-50/50">
                <CardTitle className="text-lg flex items-center gap-2"><School className="h-5 w-5" /> Identitas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label>Nama Sekolah</Label>
                  <Input value={formData.schoolName} onChange={(e) => setFormData({...formData, schoolName: e.target.value})} placeholder="E.g. SMP Negeri 5 Langke Rembong" />
                </div>
                <div className="space-y-2">
                  <Label>Logo Sekolah (Maks 800KB)</Label>
                  <div className="flex items-center gap-4">
                    {formData.schoolLogoUrl && <div className="h-16 w-16 relative border rounded-lg bg-white p-1"><Image src={formData.schoolLogoUrl} alt="Logo" fill className="object-contain" /></div>}
                    <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "schoolLogoUrl")} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Alamat Lengkap</Label>
                  <Textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardHeader className="bg-slate-50/50">
                <CardTitle className="text-lg flex items-center gap-2"><Phone className="h-5 w-5" /> Kontak</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label>WhatsApp Admin (62812...)</Label>
                  <Input value={formData.whatsappNumber} onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Nomor Telepon Kantor</Label>
                  <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Email Resmi</Label>
                  <Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="hero" className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="bg-slate-50/50">
              <CardTitle className="text-lg flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Tampilan Beranda (Hero)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label>Judul Utama (Headline)</Label>
                <Input value={formData.heroTitle} onChange={(e) => setFormData({...formData, heroTitle: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Sub-judul (Keterangan)</Label>
                <Textarea value={formData.heroSubtitle} onChange={(e) => setFormData({...formData, heroSubtitle: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Foto Latar Belakang Hero (Maks 800KB)</Label>
                <div className="relative h-48 w-full border rounded-xl overflow-hidden bg-slate-50 mb-2">
                  {formData.heroImageUrl ? (
                    <Image src={formData.heroImageUrl} alt="Hero Preview" fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">Belum ada foto latar</div>
                  )}
                </div>
                <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "heroImageUrl")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="welcome" className="animate-in fade-in duration-500">
          <Card className="border-none shadow-sm">
            <CardHeader className="bg-slate-50/50">
              <CardTitle className="text-lg flex items-center gap-2"><GraduationCap className="h-5 w-5" /> Sambutan Kepala Sekolah</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Nama Kepala Sekolah</Label>
                  <Input value={formData.headmasterName} onChange={(e) => setFormData({...formData, headmasterName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Foto Kepala Sekolah (Maks 800KB)</Label>
                  <div className="flex items-center gap-4">
                    {formData.headmasterPhotoUrl && <div className="h-16 w-16 relative border rounded-lg overflow-hidden"><Image src={formData.headmasterPhotoUrl} alt="Kepala Sekolah" fill className="object-cover" /></div>}
                    <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "headmasterPhotoUrl")} className="flex-1" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Isi Pesan Sambutan</Label>
                <Textarea className="min-h-[200px]" value={formData.welcomeMessage} onChange={(e) => setFormData({...formData, welcomeMessage: e.target.value})} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6 animate-in fade-in duration-500">
          <Card className="border-none shadow-sm">
            <CardHeader className="bg-slate-50/50">
              <CardTitle className="text-lg flex items-center gap-2"><HistoryIcon className="h-5 w-5" /> Sejarah & Visi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label>Visi Sekolah</Label>
                <Input value={formData.vision} onChange={(e) => setFormData({...formData, vision: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Sejarah Singkat</Label>
                <Textarea className="min-h-[200px]" value={formData.history} onChange={(e) => setFormData({...formData, history: e.target.value})} />
              </div>
              <div className="space-3">
                <div className="flex justify-between items-center mb-3">
                  <Label className="font-bold">Misi Sekolah (Poin-poin)</Label>
                  <Button variant="outline" size="sm" onClick={() => addItem("mission", "")}><Plus className="h-3 w-3" /> Tambah Misi</Button>
                </div>
                {formData.mission?.map((m: string, i: number) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <Input value={m} onChange={(e) => updateItem("mission", i, e.target.value)} />
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeItem("mission", i)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6 animate-in fade-in duration-500">
          <Card className="border-none shadow-sm">
            <CardHeader className="bg-slate-50/50">
              <CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Statistik Sekolah</CardTitle>
              <CardDescription>Angka yang muncul di bagian atas halaman beranda.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.stats?.map((stat: any, i: number) => (
                <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-primary mb-2">
                    {stat.icon === "Users" && <Users className="h-4 w-4" />}
                    {stat.icon === "GraduationCap" && <GraduationCap className="h-4 w-4" />}
                    {stat.icon === "Award" && <Award className="h-4 w-4" />}
                    {stat.icon === "BookOpen" && <BookOpen className="h-4 w-4" />}
                    {stat.label}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-slate-400">Label</Label>
                      <Input value={stat.label} onChange={(e) => updateItem("stats", i, {...stat, label: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-slate-400">Nilai (E.g. 850+)</Label>
                      <Input value={stat.value} onChange={(e) => updateItem("stats", i, {...stat, value: e.target.value})} />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ppdb" className="space-y-6">
          <Card className="border-none shadow-sm border-l-4 border-l-secondary">
            <CardHeader className="bg-slate-50/50 flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2 text-primary"><FileText className="h-5 w-5" /> Status PPDB</CardTitle>
              <div className="flex items-center gap-3">
                <Label>{formData.ppdbIsActive ? "AKTIF" : "NONAKTIF"}</Label>
                <Switch checked={formData.ppdbIsActive} onCheckedChange={(val) => setFormData({...formData, ppdbIsActive: val})} />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Label>Tahun Pelajaran</Label>
              <Input className="mt-2" value={formData.ppdbYear} onChange={(e) => setFormData({...formData, ppdbYear: e.target.value})} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
