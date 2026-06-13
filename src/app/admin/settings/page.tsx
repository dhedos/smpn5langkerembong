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
  UserPlus,
  User,
  Search,
  Map as MapIcon,
  Globe,
  Link as LinkIcon,
  SearchCode,
  ShieldCheck,
  Upload
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useFirestore, useDoc } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { optimizeImage } from "@/lib/image-optimizer";

export default function AdminSettings() {
  const db = useFirestore();
  
  const targetSchoolId = 'smpn5-langke-rembong';
  const settingsRef = useMemo(() => db ? doc(db, "schools", targetSchoolId) : null, [db, targetSchoolId]);
  const { data: currentSettings, loading } = useDoc(settingsRef);

  const defaultValues = {
    schoolName: "SMPN 5 Langke Rembong",
    schoolLogoUrl: "",
    officialWebsites: [],
    otherMedia: [],
    copyrightYear: "2024",
    heroBadgeText: "Selamat Datang di Website Resmi Kami",
    heroTitle: "Membangun Masa Depan Bersama Kami",
    heroSubtitle: "Pendidikan berkualitas untuk generasi emas bangsa melalui kurikulum yang inovatif.",
    heroImageUrl: "",
    welcomeSectionLabel: "Sambutan Kepala Sekolah",
    welcomeTitle: "Mendidik dengan Hati & Teknologi",
    welcomeMessage: "",
    headmasterName: "",
    headmasterTitle: "Kepala Sekolah",
    headmasterPhotoUrl: "",
    whatsappNumber: "628123456789",
    address: "",
    phone: "",
    email: "",
    googleMapsEmbedUrl: "",
    history: "",
    historyPhotoUrl: "",
    vision: "",
    mission: [],
    seoDescription: "",
    seoKeywords: "",
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
  const [addressSearch, setAddressSearch] = useState("");
  const [optimizingField, setOptimizingField] = useState<string | null>(null);

  const [newOfficialTitle, setNewOfficialTitle] = useState("");
  const [newOfficialUrl, setNewOfficialUrl] = useState("");

  const [newOtherTitle, setNewOtherTitle] = useState("");
  const [newOtherUrl, setNewOtherUrl] = useState("");

  useEffect(() => {
    if (currentSettings) {
      setFormData((prev: any) => ({
        ...prev,
        ...currentSettings,
        officialWebsites: currentSettings.officialWebsites || [],
        otherMedia: currentSettings.otherMedia || [],
      }));
    }
  }, [currentSettings]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setOptimizingField(field);
      try {
        const optimized = await optimizeImage(file);
        setFormData((prev: any) => ({ ...prev, [field]: optimized }));
        toast({ title: "Optimasi WebP Berhasil", description: "Gambar telah dikompres otomatis." });
      } catch (err: any) {
        toast({ title: "Gagal Mengunggah", description: err.message, variant: "destructive" });
      } finally {
        setOptimizingField(null);
      }
    }
  };

  const handleSearchLocation = () => {
    if (!addressSearch.trim()) return;
    const encodedAddress = encodeURIComponent(addressSearch);
    const simpleUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    setFormData({ ...formData, googleMapsEmbedUrl: simpleUrl });
    toast({ title: "Lokasi Ditemukan" });
  };

  const handleAddOfficialWebsite = () => {
    if (newOfficialTitle.trim() && newOfficialUrl.trim()) {
      const newList = [...(formData.officialWebsites || []), { title: newOfficialTitle.trim(), url: newOfficialUrl.trim() }];
      setFormData({ ...formData, officialWebsites: newList });
      setNewOfficialTitle("");
      setNewOfficialUrl("");
    }
  };

  const handleRemoveOfficialWebsite = (index: number) => {
    const newList = (formData.officialWebsites || []).filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, officialWebsites: newList });
  };

  const handleAddOtherMedia = () => {
    if (newOtherTitle.trim() && newOtherUrl.trim()) {
      const newList = [...(formData.otherMedia || []), { title: newOtherTitle.trim(), url: newOtherUrl.trim() }];
      setFormData({ ...formData, otherMedia: newList });
      setNewOtherTitle("");
      setNewOtherUrl("");
    }
  };

  const handleRemoveOtherMedia = (index: number) => {
    const newList = (formData.otherMedia || []).filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, otherMedia: newList });
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
        toast({ title: "Berhasil!", description: "Pengaturan telah disimpan secara permanen." });
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
            <h1 className="text-4xl font-bold font-headline text-primary tracking-tight uppercase">Pengaturan Global</h1>
            <p className="text-muted-foreground text-sm font-medium">Semua unggahan gambar otomatis dikompresi ke WebP.</p>
          </div>
        </div>
        <Button 
          size="lg" 
          className="bg-primary hover:bg-primary/90 shadow-xl flex gap-2 h-14 px-10 rounded-2xl font-bold" 
          onClick={handleSave} 
          disabled={isSaving || optimizingField !== null}
        >
          {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-8">
        <TabsList className="bg-slate-100/50 p-1.5 rounded-2xl w-full flex flex-wrap h-auto border border-slate-200 gap-1">
          <TabsTrigger value="general" className="rounded-xl px-4 py-3 font-bold flex-1 data-[state=active]:bg-white text-[10px] uppercase">Identitas</TabsTrigger>
          <TabsTrigger value="seo" className="rounded-xl px-4 py-3 font-bold flex-1 data-[state=active]:bg-white text-[10px] uppercase">SEO</TabsTrigger>
          <TabsTrigger value="hero" className="rounded-xl px-4 py-3 font-bold flex-1 data-[state=active]:bg-white text-[10px] uppercase">Beranda</TabsTrigger>
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

                <div className="space-y-3 pt-4 border-t">
                  <Label className="text-xs font-bold uppercase text-slate-400">Logo Sekolah (WebP Optimization)</Label>
                  <div className="flex flex-col gap-4">
                    <div className="h-24 w-24 relative bg-slate-50 rounded-xl border p-2 flex items-center justify-center">
                      {optimizingField === "schoolLogoUrl" ? (
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      ) : formData.schoolLogoUrl ? (
                        <img src={formData.schoolLogoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-slate-300" />
                      )}
                    </div>
                    <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "schoolLogoUrl")} className="h-12 bg-slate-50 rounded-2xl" disabled={optimizingField !== null} />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <Label className="text-xs font-bold uppercase text-slate-400">Portal Resmi Instansi</Label>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <Input value={newOfficialTitle} onChange={(e) => setNewOfficialTitle(e.target.value)} className="h-10 bg-white rounded-xl" placeholder="Label Portal" />
                      <div className="flex gap-2">
                        <Input value={newOfficialUrl} onChange={(e) => setNewOfficialUrl(e.target.value)} className="h-10 bg-white rounded-xl flex-1" placeholder="https://..." />
                        <Button onClick={handleAddOfficialWebsite} className="h-10 px-4 rounded-xl bg-secondary text-primary font-bold"><Plus /></Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {formData.officialWebsites?.map((web: any, i: number) => (
                        <div key={i} className="flex items-center justify-between bg-white p-3 rounded-xl border">
                          <span className="text-[10px] font-black uppercase">{web.title}</span>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveOfficialWebsite(i)} className="text-destructive h-8 w-8"><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b p-8"><CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><MapIcon className="h-6 w-6 text-secondary" /> Kontak & Lokasi</CardTitle></CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="Telepon" className="h-12 bg-slate-50" />
                  <Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Email" className="h-12 bg-slate-50" />
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Cari Alamat..." value={addressSearch} onChange={(e) => setAddressSearch(e.target.value)} className="h-12 bg-slate-50" />
                  <Button variant="secondary" className="h-12 px-6 rounded-xl font-bold" onClick={handleSearchLocation}>Cari</Button>
                </div>
                <Textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Alamat Lengkap" className="min-h-[80px] bg-slate-50" />
              </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b p-8">
              <CardTitle className="text-xl flex items-center gap-3 font-headline text-primary">
                <SearchCode className="h-6 w-6 text-secondary" /> SEO & Meta Data
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase text-slate-400">Deskripsi Meta</Label>
                <Textarea 
                  value={formData.seoDescription} 
                  onChange={(e) => setFormData({...formData, seoDescription: e.target.value})} 
                  placeholder="Ringkasan singkat sekolah untuk pencarian..." 
                  className="min-h-[120px] bg-slate-50 rounded-2xl"
                />
              </div>
              <div className="space-y-3 pt-4 border-t">
                <Label className="text-xs font-bold uppercase text-slate-400">Keywords (pisahkan dengan koma)</Label>
                <Input 
                  value={formData.seoKeywords} 
                  onChange={(e) => setFormData({...formData, seoKeywords: e.target.value})} 
                  placeholder="sekolah, pendidikan, smpn 5" 
                  className="h-14 bg-slate-50 rounded-2xl" 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hero" className="space-y-8">
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b p-8"><CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><Layout className="h-6 w-6 text-secondary" /> Tampilan Beranda</CardTitle></CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-400">Teks Lencana (Hero Badge)</Label>
                    <Input value={formData.heroBadgeText} onChange={(e) => setFormData({...formData, heroBadgeText: e.target.value})} className="h-14 bg-slate-50 font-bold rounded-2xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-400">Judul Utama (Hero Title)</Label>
                    <Input value={formData.heroTitle} onChange={(e) => setFormData({...formData, heroTitle: e.target.value})} className="h-14 bg-slate-50 font-extrabold rounded-2xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-400">Sub-judul</Label>
                    <Textarea value={formData.heroSubtitle} onChange={(e) => setFormData({...formData, heroSubtitle: e.target.value})} className="min-h-[120px] bg-slate-50 rounded-2xl" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400">Background Utama (WebP 1920px)</Label>
                  <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden border-2 border-dashed bg-slate-50 flex items-center justify-center cursor-pointer">
                    {optimizingField === "heroImageUrl" ? (
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    ) : formData.heroImageUrl ? (
                      <img src={formData.heroImageUrl} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-slate-300" />
                    )}
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "heroImageUrl")} className="absolute inset-0 opacity-0 cursor-pointer" disabled={optimizingField !== null} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-8">
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b p-8"><CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><History className="h-6 w-6 text-secondary" /> Sejarah</CardTitle></CardHeader>
            <CardContent className="p-8"><Textarea value={formData.history} onChange={(e) => setFormData({...formData, history: e.target.value})} className="min-h-[250px] bg-slate-50" /></CardContent>
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

        <TabsContent value="social" className="space-y-8">
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b p-8"><CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><Share2 className="h-6 w-6 text-secondary" /> Media Sosial Utama</CardTitle></CardHeader>
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-slate-400">Facebook URL</Label>
                <Input value={formData.facebookUrl} onChange={(e) => setFormData({...formData, facebookUrl: e.target.value})} placeholder="https://facebook.com/..." className="h-12 bg-slate-50" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-slate-400">Instagram URL</Label>
                <Input value={formData.instagramUrl} onChange={(e) => setFormData({...formData, instagramUrl: e.target.value})} placeholder="https://instagram.com/..." className="h-12 bg-slate-50" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-slate-400">TikTok URL</Label>
                <Input value={formData.tiktokUrl} onChange={(e) => setFormData({...formData, tiktokUrl: e.target.value})} placeholder="https://tiktok.com/@..." className="h-12 bg-slate-50" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-slate-400">YouTube URL</Label>
                <Input value={formData.youtubeUrl} onChange={(e) => setFormData({...formData, youtubeUrl: e.target.value})} placeholder="https://youtube.com/c/..." className="h-12 bg-slate-50" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
