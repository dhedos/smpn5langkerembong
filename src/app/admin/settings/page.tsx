"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Settings, 
  Save, 
  Phone, 
  School, 
  Loader2,
  Image as ImageIcon,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useFirestore, useDoc, useUser } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

export default function AdminSettings() {
  const db = useFirestore();
  const { profile } = useUser();
  
  const targetSchoolId = profile?.schoolId || 'default-school';
  const settingsRef = useMemo(() => db ? doc(db, "schools", targetSchoolId) : null, [db, targetSchoolId]);
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
    ppdbYear: "2024/2025",
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
      }));
    }
  }, [currentSettings]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 200 * 1024) { 
        toast({ title: "Gagal Unggah", description: "Ukuran file maksimal 200KB.", variant: "destructive" });
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
          description: `Konfigurasi sekolah "${formData.schoolName || targetSchoolId}" telah diperbarui.` 
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
      <p className="text-muted-foreground animate-pulse font-medium italic">Sinkronisasi GN Nusantara Global...</p>
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
            <h1 className="text-4xl font-bold font-headline text-primary tracking-tight uppercase">Pengaturan Situs Sekolah</h1>
            <p className="text-muted-foreground text-sm font-medium">Data di bawah ini akan tampil pada halaman publik sekolah Anda.</p>
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
          <TabsTrigger value="general" className="rounded-xl px-6 py-3 font-bold flex-1 data-[state=active]:bg-white">Identitas Dasar</TabsTrigger>
          <TabsTrigger value="hero" className="rounded-xl px-6 py-3 font-bold flex-1 data-[state=active]:bg-white">Banner Utama</TabsTrigger>
          <TabsTrigger value="profile" className="rounded-xl px-6 py-3 font-bold flex-1 data-[state=active]:bg-white">Visi & Misi</TabsTrigger>
          <TabsTrigger value="spmb" className="rounded-xl px-6 py-3 font-bold flex-1 data-[state=active]:bg-white">Pengaturan SPMB</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b p-8"><CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><School className="h-6 w-6 text-secondary" /> Identitas Sekolah</CardTitle></CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400">Nama Sekolah</Label>
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
              <CardHeader className="bg-slate-50/50 border-b p-8"><CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><Phone className="h-6 w-6 text-secondary" /> Kontak Resmi</CardTitle></CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400">WhatsApp Admin (Format: 628...)</Label>
                  <Input value={formData.whatsappNumber} onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})} className="h-14 bg-slate-50 rounded-2xl" placeholder="628123456789" />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400">Alamat Lengkap Kantor</Label>
                  <Textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="min-h-[120px] bg-slate-50 rounded-2xl" />
                </div>
              </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="spmb">
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b p-8">
              <CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><CheckCircle2 className="h-6 w-6 text-secondary" /> Konfigurasi SPMB Online</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400">Tahun Akademik</Label>
                  <Input value={formData.ppdbYear} onChange={(e) => setFormData({...formData, ppdbYear: e.target.value})} className="h-14 bg-slate-50 rounded-2xl" placeholder="2024/2025" />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400">Label Menu di Website</Label>
                  <Input value={formData.ppdbMenuTitle} onChange={(e) => setFormData({...formData, ppdbMenuTitle: e.target.value})} className="h-14 bg-slate-50 rounded-2xl font-bold" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="hero">
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b p-8">
              <CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><ImageIcon className="h-6 w-6 text-secondary" /> Visual Banner Utama</CardTitle>
            </CardHeader>
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400">Judul Besar (Hero Title)</Label>
                  <Input value={formData.heroTitle} onChange={(e) => setFormData({...formData, heroTitle: e.target.value})} className="h-14 bg-slate-50 rounded-2xl font-bold" />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400">Sub-judul Penjelas</Label>
                  <Textarea value={formData.heroSubtitle} onChange={(e) => setFormData({...formData, heroSubtitle: e.target.value})} className="h-24 bg-slate-50 rounded-2xl" />
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase text-slate-400">Foto Latar Belakang</Label>
                <div className="space-y-4">
                  {formData.heroImageUrl && (
                    <div className="aspect-video w-full relative rounded-[2rem] overflow-hidden shadow-md">
                      <img src={formData.heroImageUrl} alt="Hero" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "heroImageUrl")} className="h-12 bg-slate-50 rounded-2xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
