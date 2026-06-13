"use client";

import React, { useState, useMemo } from "react";
import { Building2, Trash2, Upload, Eye, EyeOff, Loader2, AlertTriangle, Plus, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFirestore, useCollection, useUser } from "@/firebase";
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, query, where } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { cn } from "@/lib/utils";
import { optimizeImage } from "@/lib/image-optimizer";

export default function AdminFasilitas() {
  const db = useFirestore();
  const { profile } = useUser();
  const schoolId = profile?.schoolId || 'smpn5-langke-rembong';

  const facilitiesRef = useMemo(() => {
    if (!db) return null;
    return query(
      collection(db, "facilities"), 
      where("schoolId", "==", schoolId)
    );
  }, [db, schoolId]);

  const { data: facilities, loading, error } = useCollection(facilitiesRef);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsOptimizing(true);
      try {
        const optimized = await optimizeImage(file);
        setImageUrl(optimized);
        toast({ title: "Optimasi Selesai", description: "Gambar telah dikonversi ke WebP." });
      } catch (err: any) {
        toast({ title: "Gagal Mengunggah", description: err.message, variant: "destructive" });
      } finally {
        setIsOptimizing(false);
      }
    }
  };

  const handleSave = (status: "Draft" | "Published") => {
    if (!db || !name || !description) {
      toast({ title: "Data Tidak Lengkap", description: "Nama dan deskripsi wajib diisi.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    const data = {
      name,
      description,
      imageUrl: imageUrl || "https://picsum.photos/seed/facility/800/600",
      status: status,
      schoolId: schoolId,
      createdAt: serverTimestamp()
    };

    addDoc(collection(db, "facilities"), data)
      .then(() => {
        setIsSaving(false);
        setName("");
        setDescription("");
        setImageUrl("");
        toast({ 
          title: status === "Published" ? "Berhasil Publikasi" : "Draft Tersimpan", 
          description: `Fasilitas "${name}" telah ditambahkan.` 
        });
      })
      .catch(async (serverError) => {
        setIsSaving(false);
        const permissionError = new FirestorePermissionError({
          path: 'facilities',
          operation: 'create',
          requestResourceData: data,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const toggleStatus = (id: string, currentStatus: string) => {
    if (!db) return;
    const newStatus = currentStatus === "Published" ? "Draft" : "Published";
    const docRef = doc(db, "facilities", id);

    updateDoc(docRef, { status: newStatus })
      .then(() => {
        toast({ title: "Status Diperbarui", description: `Fasilitas kini berstatus ${newStatus}.` });
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: { status: newStatus },
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const handleDelete = (id: string) => {
    if (!db) return;
    const docRef = doc(db, "facilities", id);

    deleteDoc(docRef)
      .then(() => {
        toast({ title: "Dihapus", description: "Data fasilitas telah dihapus." });
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'delete',
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold font-headline text-primary flex items-center gap-3 uppercase tracking-tighter">
            <div className="bg-secondary p-2 rounded-xl shadow-lg">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            Manajemen Fasilitas
          </h1>
          <p className="text-muted-foreground text-sm font-medium">Kelola infrastruktur sekolah.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="lg:col-span-1 border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white h-fit border border-slate-100">
          <CardHeader className="bg-slate-50/50 border-b p-8">
            <CardTitle className="text-xl">Form Fasilitas Baru</CardTitle>
            <CardDescription>Gambar dioptimalkan otomatis untuk kecepatan website.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Nama Fasilitas</Label>
              <Input 
                className="h-12 bg-slate-50 border-slate-100 rounded-xl font-bold"
                placeholder="Contoh: Laboratorium Komputer" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                disabled={isSaving}
              />
            </div>
            
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Unggah Foto</Label>
              <div className="space-y-4">
                <div className="relative aspect-video w-full border-2 border-dashed border-slate-200 rounded-[2rem] overflow-hidden bg-slate-50 flex items-center justify-center group cursor-pointer">
                  {isOptimizing ? (
                    <div className="text-center p-6">
                      <Loader2 className="mx-auto h-10 w-10 text-primary animate-spin mb-2" />
                      <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Mengoptimalkan...</span>
                    </div>
                  ) : imageUrl ? (
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-6">
                      <Upload className="mx-auto h-10 w-10 text-slate-300 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Pilih Gambar</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" disabled={isSaving || isOptimizing} />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Deskripsi Fasilitas</Label>
              <Textarea 
                placeholder="Jelaskan keunggulan fasilitas ini..." 
                className="min-h-[120px] bg-slate-50 border-slate-100 rounded-2xl p-4"
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                disabled={isSaving}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 pt-4">
              <Button 
                className="w-full h-14 rounded-2xl font-bold bg-primary shadow-xl shadow-primary/20 gap-2 text-lg" 
                onClick={() => handleSave("Published")}
                disabled={isSaving || isOptimizing}
              >
                {isSaving ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
                {isSaving ? "Menyimpan..." : "Simpan & Publikasikan"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white border border-slate-100">
          <CardHeader className="bg-slate-50/50 border-b p-8">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">Daftar Fasilitas</CardTitle>
                <CardDescription>Semua gambar menggunakan format WebP hemat kuota.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="px-8 font-bold w-32">Foto</TableHead>
                  <TableHead className="font-bold">Nama Fasilitas</TableHead>
                  <TableHead className="font-bold text-center">Tampilkan</TableHead>
                  <TableHead className="text-right px-8 font-bold">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-20 text-slate-400 animate-pulse italic font-medium">Memuat data...</TableCell></TableRow>
                ) : facilities && facilities.length > 0 ? facilities.map((f: any) => (
                  <TableRow key={f.id} className="hover:bg-slate-50/30 transition-colors">
                    <TableCell className="px-8 py-5">
                      <div className="relative h-16 w-24 rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-100">
                        <img src={f.imageUrl} alt={f.name} className="w-full h-full object-cover" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-slate-900 text-base">{f.name}</div>
                      <div className="text-xs text-slate-400 line-clamp-1 mt-1">{f.description}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={cn(
                          "rounded-full h-11 px-4 gap-2 border shadow-sm transition-all", 
                          f.status === "Published" 
                            ? "text-green-600 bg-green-50 border-green-100 hover:bg-green-100" 
                            : "text-slate-400 bg-slate-50 border-slate-100 hover:bg-slate-100"
                        )}
                        onClick={() => toggleStatus(f.id, f.status || "Draft")}
                      >
                        {f.status === "Published" ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        <span className="text-[10px] font-black uppercase tracking-widest">{f.status || "Draft"}</span>
                      </Button>
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 text-destructive hover:bg-destructive/10 rounded-xl" 
                        onClick={() => handleDelete(f.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-32 text-slate-300 italic font-medium">Belum ada fasilitas.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
