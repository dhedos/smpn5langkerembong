
"use client";

import React, { useState, useMemo } from "react";
import { Plus, Trash2, Upload, Camera, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFirestore, useCollection, useStorage } from "@/firebase";
import { collection, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy, where } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { optimizeImage } from "@/lib/image-optimizer";
import { uploadOptimizedImage } from "@/lib/storage-upload";

export default function AdminGaleri() {
  const db = useFirestore();
  const storage = useStorage();
  const schoolId = 'smpn5-langke-rembong';

  const galleryRef = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "gallery"), where("schoolId", "==", schoolId), orderBy("createdAt", "desc"));
  }, [db, schoolId]);

  const { data: photos, loading } = useCollection(galleryRef);

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && storage) {
      setIsProcessingFile(true);
      try {
        const base64 = await optimizeImage(file);
        const cloudUrl = await uploadOptimizedImage(storage, base64, 'gallery');
        setImageUrl(cloudUrl);
        toast({ title: "Berhasil Unggah", description: "Foto tersimpan di cloud storage." });
      } catch (err: any) {
        toast({ title: "Gagal", description: err.message, variant: "destructive" });
      } finally {
        setIsProcessingFile(false);
      }
    }
  };

  const handleSave = () => {
    if (!db || !title || !imageUrl) {
      toast({ title: "Gagal", description: "Judul dan foto wajib ada.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    const data = {
      title,
      imageUrl,
      schoolId,
      date: new Date().toLocaleDateString('id-ID'),
      createdAt: serverTimestamp()
    };

    addDoc(collection(db, "gallery"), data)
      .then(() => {
        setIsSaving(false);
        setTitle(""); setImageUrl("");
        toast({ title: "Berhasil", description: "Foto telah masuk koleksi." });
      })
      .catch(async () => {
        setIsSaving(false);
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: 'gallery', operation: 'create' }));
      });
  };

  const handleDelete = (id: string) => {
    if (!db || !confirm("Hapus?")) return;
    deleteDoc(doc(db, "gallery", id))
      .then(() => toast({ title: "Dihapus" }))
      .catch(async () => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: `gallery/${id}`, operation: 'delete' })));
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-3 uppercase tracking-tighter">
          <Camera className="h-8 w-8 text-secondary" /> Manajemen Galeri
        </h1>
        <p className="text-muted-foreground text-sm font-medium">Gambar disimpan di Cloud Storage, bukan lagi sebagai URI data besar.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white h-fit">
          <CardHeader className="bg-slate-50/50 border-b p-8"><CardTitle className="text-lg">Tambah Foto</CardTitle></CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-400">Judul</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nama Kegiatan..." className="h-12 bg-slate-50" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-400">Unggah Foto (WebP)</Label>
              <div className="relative aspect-square rounded-2xl border-2 border-dashed bg-slate-50 flex items-center justify-center overflow-hidden">
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
            <Button onClick={handleSave} className="w-full h-14 rounded-2xl font-bold" disabled={isSaving || isProcessingFile}>
              {isSaving ? <Loader2 className="animate-spin" /> : <Plus />} Simpan Foto
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 border-b p-8"><CardTitle className="text-lg">Koleksi Galeri</CardTitle></CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {loading ? <p className="col-span-full text-center italic">Memuat...</p> : photos?.map((p: any) => (
                <div key={p.id} className="relative aspect-square rounded-xl overflow-hidden border group">
                  <img src={p.imageUrl} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
