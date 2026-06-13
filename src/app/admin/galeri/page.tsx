"use client";

import React, { useState, useMemo } from "react";
import { Plus, Trash2, Upload, Camera, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFirestore, useCollection, useUser } from "@/firebase";
import { collection, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy, where } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { optimizeImage } from "@/lib/image-optimizer";

export default function AdminGaleri() {
  const db = useFirestore();
  const { profile } = useUser();
  const schoolId = profile?.schoolId || 'smpn5-langke-rembong';

  const galleryRef = useMemo(() => {
    if (!db) return null;
    return query(
      collection(db, "gallery"), 
      where("schoolId", "==", schoolId),
      orderBy("date", "desc")
    );
  }, [db, schoolId]);

  const { data: photos, loading } = useCollection(galleryRef);

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsOptimizing(true);
      try {
        const optimized = await optimizeImage(file);
        setImageUrl(optimized);
        toast({ title: "Optimasi Berhasil", description: "Foto dikonversi ke WebP untuk performa maksimal." });
      } catch (err: any) {
        toast({ title: "Gagal Mengunggah", description: err.message, variant: "destructive" });
      } finally {
        setIsOptimizing(false);
      }
    }
  };

  const handleSave = () => {
    if (!db || !title || !imageUrl) {
      toast({ title: "Gagal", description: "Judul dan foto wajib diisi.", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    const data = {
      title,
      imageUrl,
      schoolId,
      date: new Date().toLocaleDateString('id-ID'),
      createdAt: serverTimestamp()
    };

    addDoc(collection(db, "gallery"), data)
      .then(() => {
        setIsUploading(false);
        setTitle("");
        setImageUrl("");
        toast({ title: "Berhasil", description: "Foto galeri telah ditambahkan." });
      })
      .catch(async (error) => {
        setIsUploading(false);
        const permissionError = new FirestorePermissionError({
          path: 'gallery',
          operation: 'create',
          requestResourceData: data,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const handleDelete = (id: string) => {
    if (!db) return;
    const docRef = doc(db, "gallery", id);
    
    deleteDoc(docRef)
      .then(() => {
        toast({ title: "Dihapus", description: "Foto telah dihapus." });
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
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-3 uppercase tracking-tighter">
            <div className="bg-secondary p-2 rounded-xl">
              <Camera className="h-6 w-6 text-primary" />
            </div>
            Manajemen Galeri
          </h1>
          <p className="text-muted-foreground text-sm font-medium">Dokumentasi kegiatan sekolah.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 border-none shadow-xl rounded-[2.5rem] h-fit overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b">
            <CardTitle className="text-lg">Tambah Foto</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase text-slate-500">Judul Kegiatan</Label>
              <Input 
                className="h-12 rounded-xl bg-slate-50 border-slate-100"
                placeholder="Nama kegiatan..." 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                disabled={isUploading || isOptimizing}
              />
            </div>
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase text-slate-500">Unggah Foto (WebP Optimized)</Label>
              <div className="space-y-4">
                <div className="relative aspect-square w-full border-2 border-dashed border-slate-200 rounded-[2rem] overflow-hidden bg-slate-50 flex items-center justify-center group">
                  {isOptimizing ? (
                    <div className="text-center p-6 text-primary animate-pulse font-bold uppercase tracking-widest text-[10px]">
                      Optimasi WebP...
                    </div>
                  ) : imageUrl ? (
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-6 text-slate-400">
                      <Upload className="mx-auto h-12 w-12 mb-4 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-medium">Klik untuk pilih file</span>
                    </div>
                  )}
                </div>
                <Input type="file" accept="image/*" onChange={handleFileChange} className="text-xs" disabled={isUploading || isOptimizing} />
              </div>
            </div>
            <Button 
              className="w-full h-14 rounded-2xl font-bold" 
              onClick={handleSave}
              disabled={isUploading || isOptimizing}
            >
              {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
              {isUploading ? "Memproses..." : "Simpan Foto"}
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-none shadow-xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b">
            <CardTitle className="text-lg">Koleksi Foto</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full text-center py-20 animate-pulse italic">Memuat galeri...</div>
              ) : photos && photos.length > 0 ? photos.map((photo: any) => (
                <div key={photo.id} className="group relative aspect-square rounded-[2rem] overflow-hidden shadow-md border bg-slate-50">
                  <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center p-4">
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(photo.id)}>
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-20 text-slate-400 italic">Belum ada foto galeri.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
