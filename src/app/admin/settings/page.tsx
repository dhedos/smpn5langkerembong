
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Settings, 
  Save, 
  Phone, 
  School, 
  BookOpen, 
  Target, 
  Plus, 
  Trash2, 
  BarChart3, 
  FileText, 
  Users,
  GraduationCap,
  Award,
  ImageIcon,
  Type,
  Upload,
  UserCircle,
  Clock,
  CheckCircle2,
  Info,
  MousePointer2,
  Loader2
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
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { cn } from "@/lib/utils";

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
    stats: [],
    ppdbYear: "",
    ppdbIsActive: true,
    ppdbMenuTitle: "SPMB ONLINE",
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
      if (file.size > 200 * 1024) { 
        toast({ 
          title: "File Terlalu Besar", 
          description: "Maksimal 200KB per gambar untuk menjaga integritas dokumen Firestore.", 
          variant: "destructive" 
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev: any) => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!db) {
      toast({ title: "Gagal", description: "Database belum terhubung.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    const docRef = doc(db, "settings", "general");
    
    setDoc(docRef, formData, { merge: true })
      .then(() => {
        setIsSaving(false);
        toast({ 
          title: "Berhasil Disimpan", 
          description: "Pengaturan website telah diperbarui secara otomatis.",
        });
      })
      .catch(async (error: any) => {
        setIsSaving(false);
        if (error.code === 'permission-denied') {
          const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'write',
            requestResourceData: formData,
          } satisfies SecurityRuleContext);
          errorEmitter.emit('permission-error', permissionError);
        } else {
          toast({ 
            title: "Gagal Menyimpan", 
            description: error.message || "Gagal menyimpan data.", 
            variant: "destructive" 
          });
        }
      });
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
        <div className="flex items-center gap-4">
          <div className="bg-primary p-3 rounded-2xl shadow-lg">
            <Settings className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold font-headline text-primary tracking-tight">
              Konfigurasi Website
            </h1>
            <p className="text-muted-foreground text-sm font-medium">Sinkronisasi data otomatis oleh Goetnik Nusantara (GN Nusantara).</p>
          </div>
        </div>
        <Button 
          size="lg"
          className="bg-primary hover:bg-primary/90 shadow-xl flex gap-2 h-14 px-10 rounded-2xl font-bold text-lg transition-all active:scale-95" 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-8">
        <TabsList className="bg-slate-100/50 p-1.5 rounded-2xl w-full flex flex-wrap h-auto border border-slate-200 gap-1">
          <TabsTrigger value="general" className="rounded-xl px-6 py-3 font-bold flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">Identitas</TabsTrigger>
          <TabsTrigger value="hero" className="rounded-xl px-6 py-3 font-bold flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">Hero</TabsTrigger>
          <TabsTrigger value="welcome" className="rounded-xl px-6 py-3 font-bold flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">Sambutan</TabsTrigger>
          <TabsTrigger value="profile" className="rounded-xl px-6 py-3 font-bold flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">Visi Misi</TabsTrigger>
          <TabsTrigger value="stats" className="rounded-xl px-6 py-3 font-bold flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">Statistik</TabsTrigger>
          <TabsTrigger value="spmb" className="rounded-xl px-6 py-3 font-bold flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">SPMB Online</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b p-8">
                <CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><School className="h-6 w-6 text-secondary" /> Identitas Sekolah</CardTitle>
                <CardDescription>Nama resmi dan logo yang akan tampil di navigasi.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Nama Sekolah</Label>
                  <Input 
                    value={formData.schoolName} 
                    onChange={(e) => setFormData({...formData, schoolName: e.target.value})} 
                    className="h-14 bg-slate-50 border-slate-100 rounded-2xl font-bold" 
                    placeholder="E.g. GN Nusantara"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Logo Sekolah (PNG/SVG)</Label>
                  <div className="flex flex-col gap-4">
                    {formData.schoolLogoUrl && (
                      <div className="h-24 w-24 relative border-2 border-slate-100 rounded-2xl bg-white p-2 flex items-center justify-center">
                        <img src={formData.schoolLogoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                      </div>
                    )}
                    <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "schoolLogoUrl")} className="h-12 cursor-pointer bg-slate-50 border-slate-100 rounded-2xl" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b p-8">
                <CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><Phone className="h-6 w-6 text-secondary" /> Kontak & Alamat</CardTitle>
                <CardDescription>Informasi kontak resmi sekolah untuk footer.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">WhatsApp Admin (Format: 628...)</Label>
                  <Input 
                    value={formData.whatsappNumber} 
                    onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})} 
                    className="h-14 bg-slate-50 border-slate-100 rounded-2xl" 
                    placeholder="628123456789"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Email Resmi</Label>
                    <Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="h-12 bg-slate-50 border-slate-100 rounded-xl" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Telepon Kantor</Label>
                    <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="h-12 bg-slate-50 border-slate-100 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Alamat Lengkap</Label>
                  <Textarea 
                    value={formData.address} 
                    onChange={(e) => setFormData({...formData, address: e.target.value})} 
                    className="min-h-[100px] bg-slate-50 border-slate-100 rounded-2xl" 
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="hero" className="space-y-8">
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b p-8">
              <CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><ImageIcon className="h-6 w-6 text-secondary" /> Visual Beranda Utama</CardTitle>
              <CardDescription>Teks headline dan foto latar belakang utama website.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Judul Utama (Headline)</Label>
                    <Input 
                      value={formData.heroTitle} 
                      onChange={(e) => setFormData({...formData, heroTitle: e.target.value})} 
                      className="h-16 font-bold text-xl bg-slate-50 border-slate-100 rounded-2xl" 
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Sub-judul / Deskripsi Singkat</Label>
                    <Textarea 
                      value={formData.heroSubtitle} 
                      onChange={(e) => setFormData({...formData, heroSubtitle: e.target.value})} 
                      className="min-h-[180px] bg-slate-50 border-slate-100 rounded-2xl text-lg" 
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Foto Latar Belakang (Rekomendasi Landscape)</Label>
                  <div className="relative aspect-video w-full border-2 border-dashed border-slate-200 rounded-[2rem] overflow-hidden bg-slate-50 mb-4 flex items-center justify-center">
                    {formData.heroImageUrl ? (
                      <img src={formData.heroImageUrl} alt="Hero Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="h-10 w-10 text-slate-200" />
                    )}
                  </div>
                  <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "heroImageUrl")} className="h-12 rounded-2xl cursor-pointer" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="welcome" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <Card className="md:col-span-3 border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b p-8">
                <CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><Type className="h-6 w-6 text-secondary" /> Pesan Sambutan</CardTitle>
                <CardDescription>Pesan pembuka dari Kepala Sekolah di halaman utama.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Label Judul (Kecil)</Label>
                  <Input value={formData.welcomeTitle} onChange={(e) => setFormData({...formData, welcomeTitle: e.target.value})} className="h-14 bg-slate-50 border-slate-100 rounded-2xl font-bold" />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Teks Lengkap Sambutan</Label>
                  <Textarea value={formData.welcomeMessage} onChange={(e) => setFormData({...formData, welcomeMessage: e.target.value})} className="min-h-[250px] bg-slate-50 border-slate-100 rounded-3xl p-6 text-lg italic leading-relaxed" />
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b p-8">
                <CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><UserCircle className="h-6 w-6 text-secondary" /> Kepala Sekolah</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Foto Resmi</Label>
                  <div className="relative aspect-[3/4] w-full border-2 border-slate-100 rounded-[2rem] overflow-hidden bg-slate-50 mb-4 flex items-center justify-center">
                    {formData.headmasterPhotoUrl ? (
                      <img src={formData.headmasterPhotoUrl} alt="Kepsek" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="h-10 w-10 text-slate-200" />
                    )}
                  </div>
                  <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "headmasterPhotoUrl")} className="h-12 rounded-2xl" />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Nama Lengkap & Gelar</Label>
                  <Input value={formData.headmasterName} onChange={(e) => setFormData({...formData, headmasterName: e.target.value})} className="h-14 bg-slate-50 border-slate-100 rounded-2xl font-bold" />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Jabatan</Label>
                  <Input value={formData.headmasterTitle} onChange={(e) => setFormData({...formData, headmasterTitle: e.target.value})} className="h-14 bg-slate-50 border-slate-100 rounded-2xl" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b p-8">
                <CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><Target className="h-6 w-6 text-secondary" /> Visi & Sejarah</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Visi Sekolah</Label>
                  <Textarea value={formData.vision} onChange={(e) => setFormData({...formData, vision: e.target.value})} className="min-h-[120px] bg-slate-50 border-slate-100 rounded-2xl p-4 font-medium italic" />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Sejarah Sekolah</Label>
                  <Textarea value={formData.history} onChange={(e) => setFormData({...formData, history: e.target.value})} className="min-h-[200px] bg-slate-50 border-slate-100 rounded-2xl p-4" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b p-8 flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><CheckCircle2 className="h-6 w-6 text-secondary" /> Misi Sekolah</CardTitle>
                <Button variant="outline" size="sm" className="rounded-xl font-bold h-10 px-4" onClick={() => addItem("mission", "")}>
                  <Plus className="h-4 w-4 mr-2" /> Tambah Misi
                </Button>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                {formData.mission?.map((m: string, i: number) => (
                  <div key={i} className="flex gap-4 items-start group">
                    <Input 
                      value={m} 
                      onChange={(e) => updateItem("mission", i, e.target.value)} 
                      className="bg-slate-50 border-slate-100 h-12 rounded-xl"
                      placeholder={`Misi ${i + 1}`}
                    />
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 rounded-xl shrink-0" onClick={() => removeItem("mission", i)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {formData.mission?.length === 0 && <p className="text-center py-10 text-slate-400 italic">Belum ada misi yang ditambahkan.</p>}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-8">
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b p-8 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><BarChart3 className="h-6 w-6 text-secondary" /> Statistik Sekolah</CardTitle>
                <CardDescription>Edit data numerik pencapaian sekolah yang tampil di Beranda.</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl font-bold border-primary text-primary hover:bg-primary/5 h-12 px-6" onClick={() => addItem("stats", { label: "Item Baru", value: "0", icon: "Users" })}>
                <Plus className="h-4 w-4 mr-2" /> Tambah Item
              </Button>
            </CardHeader>
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {formData.stats?.map((stat: any, i: number) => (
                <div key={i} className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 space-y-4 relative group hover:bg-white hover:shadow-md transition-all">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-4 right-4 text-destructive hover:bg-destructive/10 rounded-full h-8 w-8"
                    onClick={() => removeItem("stats", i)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-extrabold uppercase text-slate-400">Label Statistik</Label>
                      <Input value={stat.label} onChange={(e) => updateItem("stats", i, {...stat, label: e.target.value})} className="bg-white rounded-xl h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-extrabold uppercase text-slate-400">Nilai (E.g. 100+)</Label>
                      <Input value={stat.value} onChange={(e) => updateItem("stats", i, {...stat, value: e.target.value})} className="bg-white rounded-xl h-12 font-bold" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-[10px] font-extrabold uppercase text-slate-400">Pilih Ikon</Label>
                    <Select value={stat.icon} onValueChange={(val) => updateItem("stats", i, {...stat, icon: val})}>
                      <SelectTrigger className="bg-white h-12 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Users">Siswa (Users)</SelectItem>
                        <SelectItem value="GraduationCap">Guru (Graduation)</SelectItem>
                        <SelectItem value="Award">Prestasi (Award)</SelectItem>
                        <SelectItem value="BookOpen">Kegiatan (Book)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spmb" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b p-8">
                <CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><Clock className="h-6 w-6 text-secondary" /> Status & Judul Menu</CardTitle>
                <CardDescription>Atur ketersediaan dan label tombol pendaftaran.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="space-y-1">
                    <Label className="text-lg font-bold">Aktifkan Menu SPMB</Label>
                    <p className="text-sm text-slate-400">Muncul di navigasi utama dan beranda.</p>
                  </div>
                  <Switch 
                    checked={formData.ppdbIsActive} 
                    onCheckedChange={(checked) => setFormData({...formData, ppdbIsActive: checked})} 
                  />
                </div>
                
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    <MousePointer2 className="h-3 w-3 text-secondary" /> Judul Tombol Navigasi
                  </Label>
                  <Input 
                    value={formData.ppdbMenuTitle} 
                    onChange={(e) => setFormData({...formData, ppdbMenuTitle: e.target.value})} 
                    className="h-14 bg-slate-50 border-slate-100 rounded-2xl font-bold" 
                    placeholder="E.g. SPMB ONLINE"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Tahun Ajaran Aktif</Label>
                  <Input value={formData.ppdbYear} onChange={(e) => setFormData({...formData, ppdbYear: e.target.value})} className="h-14 bg-slate-50 border-slate-100 rounded-2xl font-bold" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b p-8 flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><FileText className="h-6 w-6 text-secondary" /> Persyaratan Berkas</CardTitle>
                <Button variant="outline" size="sm" className="rounded-xl font-bold" onClick={() => addItem("ppdbRequirements", "")}>
                  <Plus className="h-4 w-4 mr-2" /> Tambah Syarat
                </Button>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                {formData.ppdbRequirements?.map((req: string, i: number) => (
                  <div key={i} className="flex gap-4 items-start">
                    <Input 
                      value={req} 
                      onChange={(e) => updateItem("ppdbRequirements", i, e.target.value)} 
                      className="bg-slate-50 border-slate-100 h-12 rounded-xl"
                      placeholder={`Persyaratan ${i + 1}`}
                    />
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 rounded-xl" onClick={() => removeItem("ppdbRequirements", i)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {formData.ppdbRequirements?.length === 0 && <p className="text-center py-10 text-slate-400 italic">Belum ada persyaratan diatur.</p>}
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b p-8 flex flex-row items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><Info className="h-6 w-6 text-secondary" /> Jalur Pendaftaran & Kuota</CardTitle>
              <Button variant="outline" size="sm" className="rounded-xl font-bold" onClick={() => addItem("ppdbQuotas", { label: "", value: "", description: "" })}>
                <Plus className="h-4 w-4 mr-2" /> Tambah Jalur
              </Button>
            </CardHeader>
            <CardContent className="p-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {formData.ppdbQuotas?.map((q: any, i: number) => (
                   <div key={i} className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 relative group">
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => removeItem("ppdbQuotas", i)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                          <div className="col-span-2 space-y-2">
                            <Label className="text-[10px] font-bold uppercase text-slate-400">Nama Jalur</Label>
                            <Input value={q.label} onChange={(e) => updateItem("ppdbQuotas", i, {...q, label: e.target.value})} className="bg-white" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase text-slate-400">Kuota (%)</Label>
                            <Input value={q.value} onChange={(e) => updateItem("ppdbQuotas", i, {...q, value: e.target.value})} className="bg-white" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase text-slate-400">Deskripsi Singkat</Label>
                          <Input value={q.description} onChange={(e) => updateItem("ppdbQuotas", i, {...q, description: e.target.value})} className="bg-white" />
                        </div>
                      </div>
                   </div>
                 ))}
               </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
