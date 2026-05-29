
"use client";

import React, { useState, useMemo } from "react";
import { Image as ImageIcon, Plus, Trash2, Upload, Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFirestore, useCollection } from "@/firebase";
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

export default function AdminGaleri() {
  const db = useFirestore();
  const galleryRef = useMemo(() => db ? collection(db, "gallery") : null, [db]);
  const { data: photos, loading } = useCollection(galleryRef);

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast({ title: "Gagal", description: "Ukuran file maksimal 1MB.", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!db || !title || !imageUrl) {
      toast({ title: "Gagal", description: "Judul dan foto wajib diisi.", variant: "destructive" });
      return;
    }

    try {
      await addDoc(collection(db, "gallery"), {
        title,
        imageUrl,
        date: new Date().toLocaleDateString('id-ID'),
        createdAt: serverTimestamp()
      });
      setTitle("");
      setImageUrl("");
      toast({ title: "Berhasil", description: "Foto galeri telah ditambahkan." });
    } catch (error) {
      toast({ title: "Gagal", description: "Terjadi kesalahan saat menyimpan.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, "gallery", id));
      toast({ title: "Dihapus", description: "Foto telah dihapus dari galeri." });
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal menghapus data.", variant: "destructive" });
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-2">
          <Camera className="h-8 w-8 text-secondary" /> Manajemen Galeri
        </h1>
        <p className="text-muted-foreground text-sm">Kelola dokumentasi foto kegiatan sekolah.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 border-none shadow-sm h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Tambah Foto Baru</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Judul Kegiatan</Label>
              <Input placeholder="E.g. Upacara Bendera" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Unggah Foto (Lokal)</Label>
              <div className="space-y-3">
                <div className="relative h-48 w-full border-2 border-dashed rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center">
                  {imageUrl ? (
                    <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                  ) : (
                    <div className="text-center p-4">
                      <Upload className="mx-auto h-10 w-10 text-slate-300 mb-2" />
                      <span className="text-xs text-slate-400">Pilih foto dari komputer (Maks 1MB)</span>
                    </div>
                  )}
                </div>
                <Input type="file" accept="image/*" onChange={handleFileChange} className="text-xs" />
              </div>
            </div>
            <Button className="w-full gap-2" onClick={handleSave}>
              <Plus className="h-4 w-4" /> Tambahkan ke Galeri
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Koleksi Galeri</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {loading ? (
                <div className="col-span-full text-center py-10 text-muted-foreground animate-pulse">Memuat foto...</div>
              ) : photos && photos.length > 0 ? photos.map((photo: any) => (
                <div key={photo.id} className="group relative aspect-square rounded-xl overflow-hidden shadow-sm border border-slate-100">
                  <Image src={photo.imageUrl} alt={photo.title} fill className="object-cover transition-transform group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                    <div className="text-white text-xs font-bold mb-2 line-clamp-2">{photo.title}</div>
                    <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(photo.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-10 text-slate-400 italic">Belum ada foto dalam galeri.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
