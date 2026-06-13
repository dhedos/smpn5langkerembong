
"use client";

import React, { useState, useMemo } from "react";
import { Trophy, Trash2, Upload, Loader2, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function AdminEkstrakurikuler() {
  const db = useFirestore();
  const storage = useStorage();
  const schoolId = 'smpn5-langke-rembong';

  const extraRef = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "extracurriculars"), where("schoolId", "==", schoolId));
  }, [db, schoolId]);

  const { data: extras, loading } = useCollection(extraRef);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [schedule, setSchedule] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && storage) {
      setIsProcessingFile(true);
      try {
        const base64 = await optimizeImage(file);
        const cloudUrl = await uploadOptimizedImage(storage, base64, 'extracurriculars');
        setImageUrl(cloudUrl);
        toast({ title: "Berhasil Unggah", description: "Gambar tersimpan di cloud." });
      } catch (err: any) {
        toast({ title: "Gagal", description: err.message, variant: "destructive" });
      } finally {
        setIsProcessingFile(false);
      }
    }
  };

  const handleSave = (status: "Draft" | "Published") => {
    if (!db || !name || !description) {
      toast({ title: "Data Tidak Lengkap", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    const data = {
      name,
      description,
      schedule,
      imageUrl: imageUrl || "https://picsum.photos/seed/extra/800/600",
      status: status,
      schoolId: schoolId,
      createdAt: serverTimestamp()
    };

    addDoc(collection(db, "extracurriculars"), data)
      .then(() => {
        setIsSaving(false);
        setName(""); setDescription(""); setSchedule(""); setImageUrl("");
        toast({ title: "Berhasil Menambahkan Eskul" });
      })
      .catch(async () => {
        setIsSaving(false);
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: 'extracurriculars', operation: 'create' }));
      });
  };

  const toggleStatus = (id: string, currentStatus: string) => {
    if (!db) return;
    const newStatus = currentStatus === "Published" ? "Draft" : "Published";
    updateDoc(doc(db, "extracurriculars", id), { status: newStatus })
      .then(() => toast({ title: "Status Berubah" }))
      .catch(async () => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: `extracurriculars/${id}`, operation: 'update' })));
  };

  const handleDelete = (id: string) => {
    if (!db || !confirm("Hapus?")) return;
    deleteDoc(doc(db, "extracurriculars", id))
      .then(() => toast({ title: "Dihapus" }))
      .catch(async () => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: `extracurriculars/${id}`, operation: 'delete' })));
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-3 uppercase tracking-tighter">
          <Trophy className="h-8 w-8 text-secondary" /> Manajemen Eskul
        </h1>
        <p className="text-muted-foreground text-sm font-medium">Gambar otomatis dioptimalkan dan disimpan di Storage.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white h-fit">
          <CardHeader className="bg-slate-50/50 border-b p-8"><CardTitle className="text-xl">Tambah Eskul</CardTitle></CardHeader>
          <CardContent className="p-8 space-y-6">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Eskul..." className="h-12 bg-slate-50" />
            <Input value={schedule} onChange={(e) => setSchedule(e.target.value)} placeholder="Jadwal..." className="h-12 bg-slate-50" />
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
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Deskripsi..." className="bg-slate-50" />
            <Button onClick={() => handleSave("Published")} className="w-full h-14 rounded-2xl font-bold" disabled={isSaving || isProcessingFile}>
              {isSaving ? <Loader2 className="animate-spin" /> : <Save />} Simpan Eskul
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-none shadow-xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b p-8"><CardTitle className="text-xl">Daftar Eskul</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead className="px-8">Nama</TableHead><TableHead>Jadwal</TableHead><TableHead className="text-center">Status</TableHead><TableHead className="text-right px-8">Aksi</TableHead></TableRow></TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-10 italic">Memuat...</TableCell></TableRow>
                ) : extras?.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="px-8 py-4 font-bold">{item.name}</TableCell>
                    <TableCell className="text-xs">{item.schedule}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm" onClick={() => toggleStatus(item.id, item.status)} className={cn("rounded-full h-10 px-4", item.status === "Published" ? "bg-green-50 text-green-600" : "bg-slate-50 text-slate-400")}>
                        <span className="text-[10px] font-black uppercase">{item.status}</span>
                      </Button>
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
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
