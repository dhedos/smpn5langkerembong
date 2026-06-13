
"use client";

import React, { useState, useMemo } from "react";
import { Building2, Trash2, Upload, Eye, EyeOff, Loader2, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFirestore, useCollection, useStorage } from "@/firebase";
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, query, where } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { cn } from "@/lib/utils";
import { optimizeImage } from "@/lib/image-optimizer";
import { uploadOptimizedImage } from "@/lib/storage-upload";

export default function AdminFasilitas() {
  const db = useFirestore();
  const storage = useStorage();
  const schoolId = 'smpn5-langke-rembong';

  const facilitiesRef = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "facilities"), where("schoolId", "==", schoolId));
  }, [db, schoolId]);

  const { data: facilities, loading } = useCollection(facilitiesRef);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && storage) {
      setIsProcessingFile(true);
      try {
        const base64 = await optimizeImage(file);
        const cloudUrl = await uploadOptimizedImage(storage, base64, 'facilities');
        setImageUrl(cloudUrl);
        toast({ title: "Berhasil Unggah", description: "Gambar tersimpan di cloud storage." });
      } catch (err: any) {
        toast({ title: "Gagal", description: err.message, variant: "destructive" });
      } finally {
        setIsProcessingFile(false);
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
        toast({ title: "Berhasil!", description: "Fasilitas telah ditambahkan." });
      })
      .catch(async () => {
        setIsSaving(false);
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: 'facilities', operation: 'create' }));
      });
  };

  const toggleStatus = (id: string, currentStatus: string) => {
    if (!db) return;
    const newStatus = currentStatus === "Published" ? "Draft" : "Published";
    updateDoc(doc(db, "facilities", id), { status: newStatus })
      .then(() => toast({ title: "Status Diperbarui" }))
      .catch(async () => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: `facilities/${id}`, operation: 'update' })));
  };

  const handleDelete = (id: string) => {
    if (!db || !confirm("Hapus fasilitas ini?")) return;
    deleteDoc(doc(db, "facilities", id))
      .then(() => toast({ title: "Dihapus" }))
      .catch(async () => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: `facilities/${id}`, operation: 'delete' })));
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-3 uppercase tracking-tighter">
          <Building2 className="h-8 w-8 text-secondary" /> Manajemen Fasilitas
        </h1>
        <p className="text-muted-foreground text-sm font-medium">Data dioptimalkan dan disimpan di Firebase Storage.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white h-fit">
          <CardHeader className="bg-slate-50/50 border-b p-8"><CardTitle className="text-xl">Form Fasilitas</CardTitle></CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-400">Nama Fasilitas</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama..." className="h-12 bg-slate-50" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-400">Unggah Foto (Cloud)</Label>
              <div className="relative aspect-video rounded-2xl border-2 border-dashed bg-slate-50 flex items-center justify-center overflow-hidden">
                {isProcessingFile ? (
                  <Loader2 className="animate-spin text-primary" />
                ) : imageUrl ? (
                  <img src={imageUrl} className="w-full h-full object-cover" />
                ) : (
                  <Upload className="text-slate-300" />
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-400">Deskripsi</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[100px] bg-slate-50" />
            </div>
            <Button onClick={() => handleSave("Published")} className="w-full h-14 rounded-2xl font-bold" disabled={isSaving || isProcessingFile}>
              {isSaving ? <Loader2 className="animate-spin" /> : <Save />} Simpan Fasilitas
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-none shadow-xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b p-8"><CardTitle className="text-xl">Daftar Fasilitas</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-8">Fasilitas</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right px-8">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={3} className="text-center py-10 italic">Memuat...</TableCell></TableRow>
                ) : facilities?.map((f: any) => (
                  <TableRow key={f.id}>
                    <TableCell className="px-8 py-4 font-bold">{f.name}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm" onClick={() => toggleStatus(f.id, f.status)} className={cn("rounded-full h-10 px-4", f.status === "Published" ? "bg-green-50 text-green-600" : "bg-slate-50 text-slate-400")}>
                        <span className="text-[10px] font-black uppercase">{f.status}</span>
                      </Button>
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(f.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
