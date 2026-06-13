"use client";

import React, { useState, useMemo } from "react";
import { Trophy, Trash2, Upload, Eye, EyeOff, Loader2, Save, Calendar } from "lucide-react";
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

export default function AdminEkstrakurikuler() {
  const db = useFirestore();
  const { profile } = useUser();
  const schoolId = profile?.schoolId || 'smpn5-langke-rembong';

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
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsOptimizing(true);
      try {
        const optimized = await optimizeImage(file);
        setImageUrl(optimized);
        toast({ title: "Gambar Siap", description: "Otomatis dioptimalkan ke WebP." });
      } catch (err: any) {
        toast({ title: "Gagal", description: err.message, variant: "destructive" });
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
      schedule,
      imageUrl: imageUrl || "https://picsum.photos/seed/extracurricular/800/600",
      status: status,
      schoolId: schoolId,
      createdAt: serverTimestamp()
    };

    addDoc(collection(db, "extracurriculars"), data)
      .then(() => {
        setIsSaving(false);
        setName("");
        setDescription("");
        setSchedule("");
        setImageUrl("");
        toast({ title: "Berhasil!", description: `Eskul "${name}" telah ditambahkan.` });
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
      .then(() => toast({ title: "Status Diperbarui" }))
      .catch(async () => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: `extracurriculars/${id}`, operation: 'update' })));
  };

  const handleDelete = (id: string) => {
    if (!db || !confirm("Hapus ekstrakurikuler ini?")) return;
    deleteDoc(doc(db, "extracurriculars", id))
      .then(() => toast({ title: "Dihapus" }))
      .catch(async () => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: `extracurriculars/${id}`, operation: 'delete' })));
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-3 uppercase tracking-tighter">
          <Trophy className="h-8 w-8 text-secondary" /> Manajemen Ekstrakurikuler
        </h1>
        <p className="text-muted-foreground text-sm font-medium">Kelola kegiatan pengembangan bakat dan minat siswa.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white border border-slate-100 h-fit">
          <CardHeader className="bg-slate-50/50 border-b p-8">
            <CardTitle className="text-xl">Tambah Eskul Baru</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase text-slate-400">Nama Eskul</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Basket" className="h-12 bg-slate-50 rounded-xl" />
            </div>
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase text-slate-400">Jadwal Latihan</Label>
              <Input value={schedule} onChange={(e) => setSchedule(e.target.value)} placeholder="Contoh: Sabtu, 15:00" className="h-12 bg-slate-50 rounded-xl" />
            </div>
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase text-slate-400">Foto Kegiatan</Label>
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border-2 border-dashed bg-slate-50 flex items-center justify-center cursor-pointer group">
                {isOptimizing ? (
                  <div className="text-center p-6 text-primary animate-pulse font-bold tracking-widest text-[10px]">OPTIMASI...</div>
                ) : imageUrl ? (
                  <img src={imageUrl} className="w-full h-full object-cover" />
                ) : (
                  <Upload className="text-slate-300 h-10 w-10 group-hover:scale-110 transition-transform" />
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" disabled={isOptimizing} />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase text-slate-400">Deskripsi</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Deskripsi eskul..." className="min-h-[100px] bg-slate-50 rounded-xl" />
            </div>
            <div className="flex flex-col gap-3">
              <Button onClick={() => handleSave("Published")} className="h-14 rounded-2xl font-bold bg-primary shadow-lg shadow-primary/20 gap-2" disabled={isSaving || isOptimizing}>
                {isSaving ? <Loader2 className="animate-spin" /> : <Save />} Simpan & Publikasikan
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-none shadow-xl rounded-[2.5rem] bg-white border border-slate-100 overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b p-8">
            <CardTitle className="text-xl">Daftar Ekstrakurikuler</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-8">Eskul</TableHead>
                  <TableHead>Jadwal</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right px-8">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-10 italic">Memuat data...</TableCell></TableRow>
                ) : extras && extras.length > 0 ? extras.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="px-8 py-4 font-bold">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0">
                          <img src={item.imageUrl} className="h-full w-full object-cover" />
                        </div>
                        {item.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 font-medium">{item.schedule || "-"}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm" onClick={() => toggleStatus(item.id, item.status)} className={cn("rounded-full h-10 px-4 gap-2", item.status === "Published" ? "bg-green-50 text-green-600" : "bg-slate-50 text-slate-400")}>
                        <span className="text-[10px] font-black uppercase">{item.status}</span>
                      </Button>
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                )) : <TableRow><TableCell colSpan={4} className="text-center py-20 text-slate-300">Belum ada data.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
