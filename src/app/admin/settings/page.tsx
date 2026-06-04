
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Settings, 
  Save, 
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
  User,
  Search,
  Map as MapIcon,
  Copyright,
  Calendar,
  Globe,
  Link as LinkIcon,
  ExternalLink
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
    officialWebsites: [],
    copyrightYear: new Date().getFullYear().toString(),
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
    history: "",
    vision: "",
    mission: [],
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
    ppdbSubtitle: "",
    ppdbRequirements: [],
    ppdbQuotas: []
  };

  const [formData, setFormData] = useState<any>(defaultValues);
  const [isSaving, setIsSaving] = useState(false);
  const [newMission, setNewMission] = useState("");
  const [newRequirement, setNewRequirement] = useState("");
  const [addressSearch, setAddressSearch] = useState("");

  const [newOfficialTitle, setNewOfficialTitle] = useState("");
  const [newOfficialUrl, setNewOfficialUrl] = useState("");

  useEffect(() => {
    if (currentSettings) {
      setFormData((prev: any) => ({
        ...prev,
        ...currentSettings,
        officialWebsites: currentSettings.officialWebsites || [],
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

  const handleSearchLocation = () => {
    if (!addressSearch.trim()) return;
    const encodedAddress = encodeURIComponent(addressSearch);
    const simpleUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    
    setFormData({ ...formData, googleMapsEmbedUrl: simpleUrl });
    toast({ title: "Lokasi Ditemukan", description: "URL peta telah diperbarui." });
  };

  const handleAddOfficialWebsite = () => {
    if (newOfficialTitle.trim() && newOfficialUrl.trim()) {
      const newList = [...(formData.officialWebsites || []), { title: newOfficialTitle.trim(), url: newOfficialUrl.trim() }];
      setFormData({ ...formData, officialWebsites: newList });
      setNewOfficialTitle("");
      setNewOfficialUrl("");
      toast({ title: "Website Ditambahkan" });
    } else {
      toast({ title: "Gagal Menambah", description: "Label dan URL wajib diisi.", variant: "destructive" });
    }
  };

  const handleRemoveOfficialWebsite = (index: number) => {
    const newList = (formData.officialWebsites || []).filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, officialWebsites: newList });
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
    
    const dataToSave = { 
      ...formData, 
      schoolId: targetSchoolId,
      updatedAt: serverTimestamp()
    };

    setDoc(settingsRef, dataToSave, { merge: true })
      .then(() => {
        setIsSaving(false);
        toast({ 
          title: "Berhasil!", 
          description: "Pengaturan telah disimpan secara permanen." 
        });
      })
      .catch(async (error: any) => {
        setIsSaving(false);
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: settingsRef.path,
          operation: 'write',
          requestResourceData: dataToSave,
        } satisfies SecurityRuleContext));
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
            <p className="text-muted-foreground text-sm font-medium">Kelola identitas dan tampilan utama sekolah.</p>
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
              <CardHeader className="bg-slate-50/50 border-b p-8"><CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><School className="h-6 w-6 text-secondary" /> Identitas Sekolah</CardTitle></CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400">Nama Lengkap Sekolah</Label>
                  <Input 
                    value={formData.schoolName} 
                    onChange={(e) => setFormData({...formData, schoolName: e.target.value})} 
                    className="h-14 bg-slate-50 rounded-2xl font-bold" 
                  />
                </div>

                <div className="space-y-3 pt-4 border-t">
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

                <div className="space-y-4 pt-4 border-t">
                  <Label className="text-xs font-bold uppercase text-slate-400">Portal Resmi Instansi (Website Terkait)</Label>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold text-slate-400 uppercase">Label (Contoh: DINAS PENDIDIKAN)</Label>
                        <Input 
                          value={newOfficialTitle} 
                          onChange={(e) => setNewOfficialTitle(e.target.value)} 
                          className="h-10 bg-white rounded-xl font-bold" 
                          placeholder="Label tombol..."
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold text-slate-400 uppercase">URL Website</Label>
                        <div className="flex gap-2">
                          <Input 
                            value={newOfficialUrl} 
                            onChange={(e) => setNewOfficialUrl(e.target.value)} 
                            className="h-10 bg-white rounded-xl flex-1" 
                            placeholder="https://www.instansi.go.id"
                          />
                          <Button onClick={handleAddOfficialWebsite} className="h-10 px-4 rounded-xl bg-secondary text-primary font-bold">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                      {formData.officialWebsites?.map((web: any, i: number) => (
                        <div key={i} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-primary uppercase tracking-tighter">{web.title}</span>
                            <span className="text-[9px] text-slate-400 truncate max-w-[150px]">{web.url}</span>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveOfficialWebsite(i)} className="text-destructive h-8 w-8">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                      {(!formData.officialWebsites || formData.officialWebsites.length === 0) && (
                        <div className="text-center py-4 text-xs text-slate-400 italic">Belum ada website instansi ditambahkan.</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <Label className="text-xs font-bold uppercase text-slate-400">Tahun Copyright Footer</Label>
                  <Input 
                    value={formData.copyrightYear} 
                    onChange={(e) => setFormData({...formData, copyrightYear: e.target.value})} 
                    className="h-14 bg-slate-50 rounded-2xl font-bold" 
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b p-8"><CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><MapIcon className="h-6 w-6 text-secondary" /> Kontak & Lokasi</CardTitle></CardHeader>
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
                
                <div className="space-y-4 pt-4 border-t">
                  <Label className="text-xs font-bold uppercase text-slate-400">Cari & Preview Peta</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Alamat atau Nama Sekolah..." 
                      value={addressSearch} 
                      onChange={(e) => setAddressSearch(e.target.value)}
                      className="h-12 bg-slate-50 rounded-xl"
                    />
                    <Button variant="secondary" className="h-12 px-6 rounded-xl font-bold" onClick={handleSearchLocation}>
                      <Search className="h-4 w-4 mr-2" /> Cari
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase text-slate-400">URL Google Maps Embed</Label>
                    <Input 
                      value={formData.googleMapsEmbedUrl} 
                      onChange={(e) => setFormData({...formData, googleMapsEmbedUrl: e.target.value})} 
                      className="h-12 bg-slate-50 rounded-xl font-mono text-[10px]" 
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <Label className="text-xs font-bold uppercase text-slate-400">Alamat Lengkap</Label>
                  <Textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="min-h-[80px] bg-slate-50 rounded-xl" />
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
                    <Label className="text-xs font-bold uppercase text-slate-400">Judul Utama</Label>
                    <Input value={formData.heroTitle} onChange={(e) => setFormData({...formData, heroTitle: e.target.value})} className="h-14 bg-slate-50 rounded-2xl font-extrabold" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase text-slate-400">Sub-judul</Label>
                    <Textarea value={formData.heroSubtitle} onChange={(e) => setFormData({...formData, heroSubtitle: e.target.value})} className="min-h-[120px] bg-slate-50 rounded-2xl" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400">Foto Hero Utama</Label>
                  <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden border-2 border-dashed bg-slate-50 flex items-center justify-center">
                    {formData.heroImageUrl ? <img src={formData.heroImageUrl} className="w-full h-full object-cover" /> : <ImageIcon className="h-12 w-12 text-slate-300" />}
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "heroImageUrl")} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="welcome" className="space-y-8">
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b p-8"><CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><UserCircle className="h-6 w-6 text-secondary" /> Sambutan</CardTitle></CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <Input value={formData.welcomeSectionLabel} onChange={(e) => setFormData({...formData, welcomeSectionLabel: e.target.value})} placeholder="Label Sambutan" className="h-12 bg-slate-50" />
                  <Input value={formData.welcomeTitle} onChange={(e) => setFormData({...formData, welcomeTitle: e.target.value})} placeholder="Judul Sambutan" className="h-14 bg-slate-50 font-bold" />
                  <Textarea value={formData.welcomeMessage} onChange={(e) => setFormData({...formData, welcomeMessage: e.target.value})} placeholder="Isi Pesan" className="min-h-[180px] bg-slate-50" />
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Input value={formData.headmasterName} onChange={(e) => setFormData({...formData, headmasterName: e.target.value})} placeholder="Nama Kepala Sekolah" className="h-12" />
                    <Input value={formData.headmasterTitle} onChange={(e) => setFormData({...formData, headmasterTitle: e.target.value})} placeholder="Gelar" className="h-12" />
                  </div>
                  <div className="relative aspect-[2/3] w-48 rounded-[2rem] overflow-hidden border-2 border-dashed bg-slate-50 flex items-center justify-center">
                    {formData.headmasterPhotoUrl ? <img src={formData.headmasterPhotoUrl} className="w-full h-full object-cover" /> : <User className="h-12 w-12 text-slate-300" />}
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "headmasterPhotoUrl")} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b p-8"><CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><BarChart3 className="h-6 w-6 text-secondary" /> Statistik</CardTitle></CardHeader>
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              {formData.stats?.map((stat: any, idx: number) => (
                <div key={idx} className="bg-slate-50 p-6 rounded-[2rem] border space-y-4">
                  <Label className="text-xs font-bold uppercase">{stat.label}</Label>
                  <Input value={stat.value} onChange={(e) => handleStatChange(idx, "value", e.target.value)} className="h-12 bg-white font-bold" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spmb">
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b p-8">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><UserPlus className="h-6 w-6 text-secondary" /> SPMB Online</CardTitle>
                <Switch checked={formData.ppdbIsActive} onCheckedChange={(checked) => setFormData({...formData, ppdbIsActive: checked})} />
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <Input value={formData.ppdbMenuTitle} onChange={(e) => setFormData({...formData, ppdbMenuTitle: e.target.value})} placeholder="Label Menu SPMB" className="h-12" />
              <Input value={formData.ppdbYear} onChange={(e) => setFormData({...formData, ppdbYear: e.target.value})} placeholder="Tahun Ajaran" className="h-12" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-8">
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b p-8"><CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><History className="h-6 w-6 text-secondary" /> Sejarah</CardTitle></CardHeader>
            <CardContent className="p-8">
              <Textarea value={formData.history} onChange={(e) => setFormData({...formData, history: e.target.value})} className="min-h-[200px] bg-slate-50" />
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b p-8"><CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><Target className="h-6 w-6 text-secondary" /> Visi</CardTitle></CardHeader>
              <CardContent className="p-8"><Textarea value={formData.vision} onChange={(e) => setFormData({...formData, vision: e.target.value})} className="min-h-[120px] bg-slate-50" /></CardContent>
            </Card>
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b p-8"><CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><BookOpen className="h-6 w-6 text-secondary" /> Misi</CardTitle></CardHeader>
              <CardContent className="p-8 space-y-4">
                <div className="flex gap-2">
                  <Input value={newMission} onChange={(e) => setNewMission(e.target.value)} placeholder="Misi baru..." className="h-12" />
                  <Button onClick={handleAddMission} className="h-12 bg-secondary text-primary font-bold"><Plus /></Button>
                </div>
                {formData.mission?.map((m: string, i: number) => (
                  <div key={i} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl">
                    <span className="text-sm font-medium">{m}</span>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveMission(i)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="social">
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b p-8"><CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><Share2 className="h-6 w-6 text-secondary" /> Media Sosial</CardTitle></CardHeader>
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input value={formData.facebookUrl} onChange={(e) => setFormData({...formData, facebookUrl: e.target.value})} placeholder="Facebook URL" className="h-14 bg-slate-50" />
              <Input value={formData.instagramUrl} onChange={(e) => setFormData({...formData, instagramUrl: e.target.value})} placeholder="Instagram URL" className="h-14 bg-slate-50" />
              <Input value={formData.tiktokUrl} onChange={(e) => setFormData({...formData, tiktokUrl: e.target.value})} placeholder="TikTok URL" className="h-14 bg-slate-50" />
              <Input value={formData.youtubeUrl} onChange={(e) => setFormData({...formData, youtubeUrl: e.target.value})} placeholder="YouTube URL" className="h-14 bg-slate-50" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
