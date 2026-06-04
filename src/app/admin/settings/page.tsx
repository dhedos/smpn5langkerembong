"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Settings, 
  Save, 
  Phone, 
  School, 
  Plus, 
  Trash2, 
  BarChart3, 
  FileText, 
  ImageIcon,
  Type,
  Upload,
  UserCircle,
  Clock,
  CheckCircle2,
  Info,
  MousePointer2,
  Loader2,
  Target,
  History
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useFirestore, useDoc, useUser } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function AdminSettings() {
  const db = useFirestore();
  const { profile } = useUser();
  
  // Gunakan schoolId dari profil user untuk multi-tenancy
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
      }));
    }
  }, [currentSettings]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 200 * 1024) { 
        toast({ title: "File Terlalu Besar", description: "Maksimal 200KB per gambar untuk performa optimal.", variant: "destructive" });
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
    if (!db) return;
    setIsSaving(true);
    const docRef = doc(db, "schools", targetSchoolId);
    
    // Pastikan schoolId disertakan dalam data yang disimpan
    setDoc(docRef, { ...formData, schoolId: targetSchoolId }, { merge: true })
      .then(() => {
        setIsSaving(false);
        toast({ title: "Berhasil Disimpan", description: `Konfigurasi sekolah "${formData.schoolName}" telah diperbarui.` });
      })
      .catch((error: any) => {
        setIsSaving(false);
        console.error("Save error:", error);
        toast({ title: "Gagal Menyimpan", description: "Cek izin akses atau koneksi Anda.", variant: "destructive" });
      });
  };

  if (loading) return <div className="p-12 text-center text-muted-foreground animate-pulse font-medium italic">Sinkronisasi Cloud...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary p-3 rounded-2xl shadow-lg">
            <Settings className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold font-headline text-primary tracking-tight uppercase">Manajemen Website Sekolah</h1>
            <p className="text-muted-foreground text-sm font-medium">Pengaturan dikelola oleh GN Nusantara Global Console.</p>
          </div>
        </div>
        <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-xl flex gap-2 h-14 px-10 rounded-2xl font-bold" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          {isSaving ? "Menyimpan..." : "Simpan Konfigurasi"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-8">
        <TabsList className="bg-slate-100/50 p-1.5 rounded-2xl w-full flex flex-wrap h-auto border border-slate-200 gap-1">
          <TabsTrigger value="general" className="rounded-xl px-6 py-3 font-bold flex-1 data-[state=active]:bg-white">Identitas</TabsTrigger>
          <TabsTrigger value="hero" className="rounded-xl px-6 py-3 font-bold flex-1 data-[state=active]:bg-white">Hero</TabsTrigger>
          <TabsTrigger value="profile" className="rounded-xl px-6 py-3 font-bold flex-1 data-[state=active]:bg-white">Visi Misi</TabsTrigger>
          <TabsTrigger value="spmb" className="rounded-xl px-6 py-3 font-bold flex-1 data-[state=active]:bg-white">SPMB</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b p-8"><CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><School className="h-6 w-6 text-secondary" /> Profil Sekolah</CardTitle></CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400">Nama Sekolah</Label>
                  <Input value={formData.schoolName} onChange={(e) => setFormData({...formData, schoolName: e.target.value})} className="h-14 bg-slate-50 rounded-2xl font-bold" />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400">Logo Sekolah</Label>
                  <div className="flex flex-col gap-4">
                    {formData.schoolLogoUrl && <img src={formData.schoolLogoUrl} alt="Logo" className="h-20 w-20 object-contain" />}
                    <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "schoolLogoUrl")} className="h-12 bg-slate-50 rounded-2xl" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b p-8"><CardTitle className="text-xl flex items-center gap-3 font-headline text-primary"><Phone className="h-6 w-6 text-secondary" /> Kontak Resmi</CardTitle></CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400">WhatsApp Admin</Label>
                  <Input value={formData.whatsappNumber} onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})} className="h-14 bg-slate-50 rounded-2xl" placeholder="628..." />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-400">Alamat Lengkap</Label>
                  <Textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="min-h-[100px] bg-slate-50 rounded-2xl" />
                </div>
              </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}