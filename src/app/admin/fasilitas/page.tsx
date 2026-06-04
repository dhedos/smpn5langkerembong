"use client";

import React, { useState, useMemo } from "react";
import { Building2, Trash2, ImageIcon, Upload, CheckCircle2, Eye, EyeOff, Loader2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFirestore, useCollection, useUser } from "@/firebase";
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, query, where } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { cn } from "@/lib/utils";

export default function AdminFasilitas() {
  const db = useFirestore();
  const { profile } = useUser();
  const schoolId = profile?.schoolId || 'smpn5-langke-rembong';

  const facilitiesRef = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "facilities"), where("schoolId", "==", schoolId));
  }, [db, schoolId]);

  const { data: facilities, loading, error } = useCollection(facilitiesRef);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) {
        toast({ title: "File Terlalu Besar", description: "Maksimal 800KB.", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
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
      status,
      schoolId,
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
        toast({ title: "Status Diperbarui", description: `Kini berstatus ${newStatus}.` });
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
            <div className="bg-secondary p-2 rounded-xl">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            Manajemen Fasilitas
          </h1>
          <p className="text-muted-foreground text-sm font-medium">Kelola sarana prasarana sekolah {schoolId}.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="lg:col-span-1 border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white h-fit">
          <CardHeader className="bg-slate-50/50 border-b p-8">
            <CardTitle className="text-xl">Tambah Fasilitas</CardTitle>
            <CardDescription>Dokumentasikan infrastruktur unggulan sekolah.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Nama Fasilitas</Label>
              <Input 
                className="h-12 bg-slate-50 border-slate-100 rounded-xl font-bold"
                placeholder="E.g. Laboratorium IPA" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                disabled={isSaving}
              />
            </div>
            
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Foto (Lokal)</Label>
              <div className="space-y-4">
                <div className="relative aspect-video w-full border-2 border-dashed border-slate-200 rounded-[2rem] overflow-hidden bg-slate-50 flex items-center justify-center group">
                  {imageUrl ? (
                    <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                  ) : (
                    <div className="text-center p-6">
                      <Upload className="mx-auto h-10 w-10 text-slate-300 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Pilih File</span>
                    </div>
                  )}
                </div>
                <Input type="file" accept="image/*" onChange={handleFileChange} className="text-xs cursor-pointer" disabled={isSaving} />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Deskripsi</Label>
              <Textarea 
                placeholder="Keterangan singkat mengenai fasilitas ini..." 
                className="min-h-[100px] bg-slate-50 border-slate-100 rounded-2xl"
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                disabled={isSaving}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 pt-4">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 h-12 rounded-xl font-bold" 
                  onClick={() => handleSave("Draft")}
                  disabled={isSaving}
                >
                  Draft
                </Button>
                <Button 
                  className="flex-[2] h-12 rounded-xl font-bold bg-primary shadow-lg shadow-primary/20 gap-2" 
                  onClick={() => handleSave("Published")}
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  {isSaving ? "Memproses..." : "Publish Sekarang"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 border-b p-8">
            <CardTitle className="text-xl">Daftar Inventaris</CardTitle>
            <CardDescription>Tampilkan fasilitas yang tersedia di website.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="px-8 font-bold">Foto</TableHead>
                  <TableHead className="font-bold">Nama</TableHead>
                  <TableHead className="font-bold text-center">Tampil</TableHead>
                  <TableHead className="text-right px-8 font-bold">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-20 text-slate-400 animate-pulse italic font-medium">Memuat data fasilitas...</TableCell></TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-20 text-destructive font-medium">
                      <div className="flex flex-col items-center gap-2">
                        <AlertTriangle className="h-8 w-8" />
                        <p>Gagal memuat data. Silakan periksa koneksi atau index Firestore.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : facilities && facilities.length > 0 ? facilities.map((f: any) => (
                  <TableRow key={f.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="px-8 py-4">
                      <div className="relative h-14 w-20 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                        <Image src={f.imageUrl || "https://picsum.photos/seed/facility/800/600"} alt={f.name} fill className="object-cover" />
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-slate-800">{f.name}</TableCell>
                    <TableCell className="text-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={cn("rounded-full h-10 w-10", f.status === "Published" ? "text-green-600 bg-green-50" : "text-slate-300")}
                        onClick={() => toggleStatus(f.id, f.status || "Draft")}
                      >
                        {f.status === "Published" ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
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
                  <TableRow><TableCell colSpan={4} className="text-center py-20 text-slate-400 italic">Belum ada data fasilitas untuk sekolah ini.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
