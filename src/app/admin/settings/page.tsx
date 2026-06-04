
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Settings, 
  Save, 
  Phone, 
  School, 
  Loader2,
  Image as ImageIcon,
  Share2,
  BookOpen,
  Plus,
  Trash2,
  History,
  Target,
  Layout,
  UserCircle,
  BarChart3,
  Users,
  UserPlus,
  MapPin,
  User
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useFirestore, useDoc, useUser } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

export default function AdminSettings() {
  const db = useFirestore();
  const { profile } = useUser();
  
  const targetSchoolId = 'smpn5-langke-rembong';
  const settingsRef = useMemo(() => db ? doc(db, "schools", targetSchoolId) : null, [db, targetSchoolId]);
  const { data: currentSettings, loading } = useDoc(settingsRef);

  const defaultValues = {
    schoolName: "SMPN 5 Langke Rembong",
    schoolLogoUrl: "",
    heroTitle: "Membangun Masa Depan Bersama Kami",
    heroSubtitle: "Pendidikan berkualitas untuk generasi emas bangsa melalui kurikulum yang inovatif dan lingkungan yang mendukung.",
    heroImageUrl: "",
    welcomeSectionLabel: "Sambutan Kepala Sekolah",
    welcomeTitle: "Mendidik dengan Hati & Teknologi",
    welcomeMessage: "Kami berkomitmen untuk memberikan pengalaman belajar terbaik bagi putra-putri Anda melalui kurikulum yang inovatif dan lingkungan yang mendukung.",
    headmasterName: "Kepala Sekolah",
    headmasterTitle: "Pimpinan Sekolah",
    headmasterPhotoUrl: "",
    whatsappNumber: "628123456789",
    address: "Jl. Pendidikan No. 5, Langke Rembong",
    phone: "(0385) 12345",
    email: "admin@smpn5langkerembong.sch.id",
    googleMapsEmbedUrl: "",
    history: "SMPN 5 Langke Rembong didirikan dengan komitmen untuk mencerdaskan kehidupan bangsa melalui pendidikan yang inklusif dan berstandar nasional.",
    vision: "Menjadi lembaga pendidikan unggulan yang mencetak generasi bertakwa, berkarakter, dan berdaya saing global.",
    mission: [
      "Menyelenggarakan proses pembelajaran yang inovatif berbasis teknologi.",
      "Membangun lingkungan sekolah yang aman, nyaman, dan inspiratif.",
      "Mengembangkan potensi siswa baik di bidang akademik maupun non-akademik."
    ],
    stats: [
      { label: "Guru", value: "0", icon: "GraduationCap" },
      { label: "Tenaga Pendidik", value: "0", icon: "Users" },
      { label: "Siswa", value: "0", icon: "UserCircle" }
    ],
    facebookUrl: "",
    instagramUrl: "",
    tiktokUrl: "",
    youtubeUrl: "",
    ppdbYear: "2024/2025",
    ppdbIsActive: true,
    ppdbMenuTitle: "SPMB ONLINE",
    ppdbRequirements: ["Scan Ijazah Asli", "Scan Akta Kelahiran", "Pas Foto 3x4"],
    ppdbQuotas: [
      { label: "Zonasi", value: "50%", description: "Berdasarkan jarak tempat tinggal" },
      { label: "Prestasi", value: "30%", description: "Akademik & Non-Akademik" },
      { label: "Afirmasi", value: "20%", description: "Keluarga kurang mampu" }
    ]
  };

  const [formData, setFormData] = useState<any>(defaultValues);
  const [isSaving, setIsSaving] = useState(false);
  const [newMission, setNewMission] = useState("");
  const [newRequirement, setNewRequirement] = useState("");

  useEffect(() => {
    if (currentSettings) {
      setFormData((prev: any) => ({
        ...prev,
        ...currentSettings,
        stats: (currentSettings.stats && currentSettings.stats.length > 0) ? currentSettings.stats : prev.stats,
        mission: currentSettings.mission || prev.mission,
        ppdbRequirements: currentSettings.ppdbRequirements || prev.ppdbRequirements,
        ppdbQuotas: currentSettings.ppdbQuotas || prev.ppdbQuotas,
      }));
    }
  }, [currentSettings]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) { 
        toast({ title: "File Terlalu Besar", description: "Maksimal 800KB.", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev: any) => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMission = () => {
    if (newMission.trim()) {
      setFormData((prev: any) => ({
        ...prev,
        mission: [...(prev.mission || []), newMission.trim()]
      }));
      setNewMission("");
    }
  };

  const handleRemoveMission = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      mission: prev.mission.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      setFormData((prev: any) => ({
        ...prev,
        ppdbRequirements: [...(prev.ppdbRequirements || []), newRequirement.trim()]
      }));
      setNewRequirement("");
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      ppdbRequirements: prev.ppdbRequirements.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleStatChange = (index: number, field: string, value: string) => {
    const updatedStats = [...(formData.stats || [])];
    updatedStats[index] = { ...updatedStats[index], [field]: value };
    setFormData({ ...formData, stats: updatedStats });
  };

  const handleSave = () => {
    if (!db || !settingsRef) return;
    setIsSaving(true);
    
    // Clean URL
    const cleanMapUrl = formData.googleMapsEmbedUrl?.trim() || "";

    const dataToSave = { 
      ...formData, 
      googleMapsEmbedUrl: cleanMapUrl,
      schoolId: targetSchoolId,
      updatedAt: serverTimestamp()
    };

    setDoc(settingsRef, dataToSave, { merge: true })
      .then(() => {
        setIsSaving(false);
        toast({ 
          title: "Berhasil!", 
          description: `Pengaturan sekolah "${formData.schoolName}" telah diperbarui.` 
        });
      })
      .catch(async (error: any) => {
        setIsSaving(false);
        const permissionError = new FirestorePermissionError({
          path: settingsRef.path,
          operation: 'write',
          requestResourceData: dataToSave,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  if (loading) return (
    <div className="p-12 text-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
      <p className="text-muted-foreground animate-pulse font-medium italic">Sinkronisasi Pengaturan...</p>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary p-3 rounded-2xl shadow-lg">
            <Settings className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold font-headline text-primary tracking-tight uppercase">Pengaturan Situs</h1>
            <p className="text-muted-foreground text-sm font-medium">Kelola identitas, profil, dan tampilan utama sekolah.</p>
          </div>
        </div>
        <Button 
          size="lg" 
          className="bg-primary hover:bg-primary/90 shadow-xl flex gap-2 h-14 px-10 rounded-2xl font-bold" 
          onClick={handleSave} 
          disabled={isSaving}
        >
          {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-8">
        <TabsList className="bg-slate-100/50 p-1.5 rounded-2xl w-full flex flex-wrap h-auto border border-slate-200 gap-1">
          <TabsTrigger value="general" className="rounded-xl px-4 py-3 font-bold flex-1 data-[state=active]:bg-white text-[10px] uppercase">Identitas</TabsTrigger>
          <TabsTrigger value="hero" className="rounded-xl px-4 py-3 font-bold flex-1 data-[state=active]:bg-white text-[10px] uppercase">Beranda</TabsTrigger>
          <TabsTrigger value="welcome" className="rounded-xl px-4 py-3 font-bold flex-1 data-[state=active]:bg-white text-[10px] uppercase">Sambutan</TabsTrigger>
          <TabsTrigger value="stats" className="rounded-xl px-4 py-3 font-bold flex-1 data-[state=active]:bg-white text-[10px] uppercase">Statistik</TabsTrigger>
          <TabsTrigger value="profile" className="rounded-xl px-4 py-3 font-bold flex-1 data-[state=active]:bg-white text-[10px] uppercase">Profil</TabsTrigger>
          <TabsTrigger value="spmb" className="rounded-xl px-4 py-3 font-bold flex-1 data-[state=active]:bg-white text-[10px] uppercase">SPMB</TabsTrigger>
          <TabsTrigger value="social" className="rounded-xl px-4 py-3 font-bold flex-1 data-[state=active]:bg-white text-[10px] uppercase">Sosmed</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b p-8"><CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><School className="h-6 w-6 text-secondary" /> Nama & Logo</CardTitle></CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400">Nama Lengkap Sekolah</Label>
                  <Input 
                    value={formData.schoolName} 
                    onChange={(e) => setFormData({...formData, schoolName: e.target.value})} 
                    className="h-14 bg-slate-50 rounded-2xl font-bold" 
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400">Logo Sekolah</Label>
                  <div className="flex flex-col gap-4">
                    {formData.schoolLogoUrl && (
                      <div className="h-24 w-24 relative bg-slate-50 rounded-xl border p-2 flex items-center justify-center">
                        <img src={formData.schoolLogoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                      </div>
                    )}
                    <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "schoolLogoUrl")} className="h-12 bg-slate-50 rounded-2xl" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b p-8"><CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><Phone className="h-6 w-6 text-secondary" /> Kontak & Lokasi</CardTitle></CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase text-slate-400">Telepon Kantor</Label>
                    <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="h-12 bg-slate-50 rounded-xl" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase text-slate-400">Email Resmi</Label>
                    <Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="h-12 bg-slate-50 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400">WhatsApp (62...)</Label>
                  <Input value={formData.whatsappNumber} onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})} className="h-12 bg-slate-50 rounded-xl" />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400">Alamat Sekolah</Label>
                  <Textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="min-h-[100px] bg-slate-50 rounded-xl" />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400">Google Maps Embed URL</Label>
                  <Input 
                    value={formData.googleMapsEmbedUrl} 
                    onChange={(e) => setFormData({...formData, googleMapsEmbedUrl: e.target.value})} 
                    placeholder="https://www.google.com/maps/embed?..."
                    className="h-12 bg-slate-50 rounded-xl" 
                  />
                  <p className="text-[10px] text-slate-400 italic">Dapatkan URL dari 'Share' &gt; 'Embed a map' &gt; ambil nilai atribut 'src'. Pastikan hanya URL saja yang dimasukkan.</p>
                </div>
              </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="hero" className="space-y-8">
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b p-8">
              <CardTitle className="text-xl flex items-center gap-3 font-headline text-primary">
                <Layout className="h-6 w-6 text-secondary" /> Tampilan Beranda
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase text-slate-400">Judul Gambar Utama (Hero Title)</Label>
                    <Input 
                      value={formData.heroTitle} 
                      onChange={(e) => setFormData({...formData, heroTitle: e.target.value})} 
                      className="h-14 bg-slate-50 rounded-2xl font-extrabold text-lg" 
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase text-slate-400">Sub-judul Utama</Label>
                    <Textarea 
                      value={formData.heroSubtitle} 
                      onChange={(e) => setFormData({...formData, heroSubtitle: e.target.value})} 
                      className="min-h-[120px] bg-slate-50 rounded-2xl"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400">Foto Latar Belakang (Maks 800KB)</Label>
                  <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center">
                    {formData.heroImageUrl ? (
                      <img src={formData.heroImageUrl} alt="Hero" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-slate-400">
                        <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
                        <span className="text-xs font-bold">Klik untuk Unggah Foto</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "heroImageUrl")} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="welcome" className="space-y-8">
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b p-8">
              <CardTitle className="text-xl flex items-center gap-3 font-headline text-primary">
                <UserCircle className="h-6 w-6 text-secondary" /> {formData.welcomeSectionLabel || "Sambutan Kepala Sekolah"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase text-slate-400">Label Bagian (Contoh: Sambutan Kepala Sekolah)</Label>
                    <Input 
                      value={formData.welcomeSectionLabel} 
                      onChange={(e) => setFormData({...formData, welcomeSectionLabel: e.target.value})} 
                      className="h-12 bg-slate-50 rounded-xl"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase text-slate-400">Judul Sambutan</Label>
                    <Input 
                      value={formData.welcomeTitle} 
                      onChange={(e) => setFormData({...formData, welcomeTitle: e.target.value})} 
                      className="h-14 bg-slate-50 rounded-2xl font-bold"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase text-slate-400">Isi Pesan Sambutan</Label>
                    <Textarea 
                      value={formData.welcomeMessage} 
                      onChange={(e) => setFormData({...formData, welcomeMessage: e.target.value})} 
                      className="min-h-[180px] bg-slate-50 rounded-2xl"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label className="text-xs font-bold uppercase text-slate-400">Nama Kepala Sekolah</Label>
                      <Input 
                        value={formData.headmasterName} 
                        onChange={(e) => setFormData({...formData, headmasterName: e.target.value})} 
                        className="h-12 bg-slate-50 rounded-xl font-bold"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs font-bold uppercase text-slate-400">Gelar / Jabatan</Label>
                      <Input 
                        value={formData.headmasterTitle} 
                        onChange={(e) => setFormData({...formData, headmasterTitle: e.target.value})} 
                        className="h-12 bg-slate-50 rounded-xl"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase text-slate-400">Foto Kepala Sekolah (Rasio 4:6)</Label>
                    <div className="relative aspect-[2/3] w-48 rounded-[2rem] overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center">
                      {formData.headmasterPhotoUrl ? (
                        <img src={formData.headmasterPhotoUrl} alt="Kepala Sekolah" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center text-slate-300">
                          <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Unggah Foto</span>
                        </div>
                      )}
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "headmasterPhotoUrl")} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-8">
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b p-8">
              <CardTitle className="text-xl flex items-center gap-3 font-headline text-primary">
                <BarChart3 className="h-6 w-6 text-secondary" /> Statistik Sekolah
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {formData.stats?.map((stat: any, idx: number) => (
                  <div key={idx} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <Label className="text-xs font-bold uppercase text-primary">{stat.label}</Label>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jumlah</Label>
                      <Input 
                        type="text"
                        value={stat.value} 
                        onChange={(e) => handleStatChange(idx, "value", e.target.value)} 
                        className="h-12 bg-white rounded-xl font-bold"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spmb" className="space-y-8">
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b p-8">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl flex items-center gap-3 font-headline text-primary">
                  <UserPlus className="h-6 w-6 text-secondary" /> Manajemen SPMB Online
                </CardTitle>
                <div className="flex items-center gap-3">
                  <Label className="text-xs font-bold uppercase text-slate-400">Status Pendaftaran</Label>
                  <Switch 
                    checked={formData.ppdbIsActive} 
                    onCheckedChange={(checked) => setFormData({...formData, ppdbIsActive: checked})} 
                  />
                  <Badge className={formData.ppdbIsActive ? "bg-green-500" : "bg-slate-400"}>
                    {formData.ppdbIsActive ? "AKTIF" : "NON-AKTIF"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase text-slate-400">Judul Tombol Navigasi</Label>
                    <Input 
                      value={formData.ppdbMenuTitle} 
                      onChange={(e) => setFormData({...formData, ppdbMenuTitle: e.target.value})} 
                      className="h-12 bg-slate-50 rounded-xl"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase text-slate-400">Tahun Ajaran</Label>
                    <Input 
                      value={formData.ppdbYear} 
                      onChange={(e) => setFormData({...formData, ppdbYear: e.target.value})} 
                      className="h-12 bg-slate-50 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-xs font-bold uppercase text-slate-400">Daftar Persyaratan</Label>
                  <div className="flex gap-2">
                    <Input value={newRequirement} onChange={(e) => setNewRequirement(e.target.value)} placeholder="Contoh: Akta Kelahiran..." className="h-12 bg-slate-50 rounded-xl" />
                    <Button onClick={handleAddRequirement} className="h-12 bg-secondary text-primary font-bold rounded-xl"><Plus /></Button>
                  </div>
                  <div className="space-y-2">
                    {formData.ppdbRequirements?.map((r: string, i: number) => (
                      <div key={i} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border">
                        <span className="text-sm font-medium">{r}</span>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveRequirement(i)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-8">
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b p-8"><CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><History className="h-6 w-6 text-secondary" /> Sejarah</CardTitle></CardHeader>
            <CardContent className="p-8">
              <Textarea 
                value={formData.history} 
                onChange={(e) => setFormData({...formData, history: e.target.value})} 
                className="min-h-[200px] bg-slate-50 rounded-2xl"
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b p-8"><CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><Target className="h-6 w-6 text-secondary" /> Visi</CardTitle></CardHeader>
              <CardContent className="p-8">
                <Textarea value={formData.vision} onChange={(e) => setFormData({...formData, vision: e.target.value})} className="min-h-[120px] bg-slate-50 rounded-xl" />
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b p-8"><CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><BookOpen className="h-6 w-6 text-secondary" /> Misi</CardTitle></CardHeader>
              <CardContent className="p-8 space-y-4">
                <div className="flex gap-2">
                  <Input value={newMission} onChange={(e) => setNewMission(e.target.value)} placeholder="Tambah misi baru..." className="h-12 bg-slate-50 rounded-xl" />
                  <Button onClick={handleAddMission} className="h-12 bg-secondary text-primary font-bold rounded-xl"><Plus /></Button>
                </div>
                <div className="space-y-2">
                  {formData.mission?.map((m: string, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border group">
                      <span className="text-sm font-medium">{m}</span>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveMission(i)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="social">
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b p-8">
              <CardTitle className="text-xl flex items-center gap-3 font-headline text-primary">
                <Share2 className="h-6 w-6 text-secondary" /> Link Media Sosial
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400">Facebook URL</Label>
                  <Input value={formData.facebookUrl} onChange={(e) => setFormData({...formData, facebookUrl: e.target.value})} placeholder="https://facebook.com/..." className="h-14 bg-slate-50 rounded-2xl" />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400">Instagram URL</Label>
                  <Input value={formData.instagramUrl} onChange={(e) => setFormData({...formData, instagramUrl: e.target.value})} placeholder="https://instagram.com/..." className="h-14 bg-slate-50 rounded-2xl" />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400">TikTok URL</Label>
                  <Input value={formData.tiktokUrl} onChange={(e) => setFormData({...formData, tiktokUrl: e.target.value})} placeholder="https://tiktok.com/@..." className="h-14 bg-slate-50 rounded-2xl" />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400">YouTube URL</Label>
                  <Input value={formData.youtubeUrl} onChange={(e) => setFormData({...formData, youtubeUrl: e.target.value})} placeholder="https://youtube.com/..." className="h-14 bg-slate-50 rounded-2xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
