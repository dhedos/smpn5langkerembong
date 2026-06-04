
"use client";

import React, { useState, useMemo } from "react";
import { Building2, Plus, Trash2, Save, Image as ImageIcon, Upload, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useFirestore, useCollection } from "@/firebase";
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

export default function AdminFasilitas() {
  const db = useFirestore();
  const facilitiesRef = useMemo(() => db ? collection(db, "facilities") : null, [db]);
  const { data: facilities, loading } = useCollection(facilitiesRef);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSave = async (status: "Draft" | "Published") => {
    if (!db || !name || !description) {
      toast({ title: "Data Tidak Lengkap", description: "Nama dan deskripsi wajib diisi.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      await addDoc(collection(db, "facilities"), {
        name,
        description,
        imageUrl: imageUrl || "https://picsum.photos/seed/facility/800/600",
        status,
        createdAt: serverTimestamp()
      });
      setName("");
      setDescription("");
      setImageUrl("");
      toast({ 
        title: status === "Published" ? "Fasilitas Dipublikasikan" : "Draft Disimpan", 
        description: `Fasilitas ${name} telah berhasil ${status === "Published" ? "ditampilkan di website" : "disimpan sebagai draft"}.` 
      });
    } catch (error) {
      toast({ title: "Gagal Menyimpan", description: "Terjadi kesalahan saat menghubungi database.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    if (!db) return;
    const newStatus = currentStatus === "Published" ? "Draft" : "Published";
    try {
      await updateDoc(doc(db, "facilities", id), { status: newStatus });
      toast({ title: "Status Diperbarui", description: `Fasilitas kini berstatus ${newStatus}.` });
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal memperbarui status.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, "facilities", id));
      toast({ title: "Dihapus", description: "Fasilitas telah dihapus secara permanen." });
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal menghapus data.", variant: "destructive" });
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold font-headline text-primary flex items-center gap-3">
          <div className="bg-secondary p-2 rounded-xl">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          Manajemen Fasilitas
        </h1>
        <p className="text-muted-foreground text-sm font-medium">Kelola sarana prasarana sekolah yang ditampilkan di website.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form Section */}
        <Card className="lg:col-span-1 border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 border-b p-8">
            <CardTitle className="text-xl">Tambah Fasilitas</CardTitle>
            <CardDescription>Masukkan detail fasilitas baru.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Nama Fasilitas</Label>
              <Input 
                className="h-12 bg-slate-50 border-slate-100 rounded-xl font-bold"
                placeholder="E.g. Laboratorium Komputer" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Foto Fasilitas</Label>
              <div className="space-y-4">
                <div className="relative aspect-video w-full border-2 border-dashed border-slate-200 rounded-[2rem] overflow-hidden bg-slate-50 flex items-center justify-center group">
                  {imageUrl ? (
                    <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                  ) : (
                    <div className="text-center p-6">
                      <Upload className="mx-auto h-10 w-10 text-slate-300 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Unggah Foto</span>
                    </div>
                  )}
                </div>
                <Input type="file" accept="image/*" onChange={handleFileChange} className="text-xs cursor-pointer bg-slate-50 rounded-xl" />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Deskripsi Fasilitas</Label>
              <Textarea 
                placeholder="Jelaskan kegunaan fasilitas ini secara singkat..." 
                className="min-h-[120px] bg-slate-50 border-slate-100 rounded-2xl"
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button 
                variant="outline" 
                className="h-12 rounded-xl font-bold border-slate-200 text-slate-500" 
                onClick={() => handleSave("Draft")}
                disabled={isSaving}
              >
                Simpan Draft
              </Button>
              <Button 
                className="h-12 rounded-xl font-bold bg-primary shadow-lg shadow-primary/20 gap-2" 
                onClick={() => handleSave("Published")}
                disabled={isSaving}
              >
                <CheckCircle2 className="h-4 w-4" /> {isSaving ? "Memproses..." : "Publish Sekarang"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* List Section */}
        <Card className="lg:col-span-2 border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 border-b p-8">
            <CardTitle className="text-xl">Daftar Fasilitas</CardTitle>
            <CardDescription>Semua sarana prasarana yang terdaftar di database.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="px-8 font-bold">Foto</TableHead>
                  <TableHead className="font-bold">Fasilitas</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="text-right px-8 font-bold">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-20 text-slate-400 animate-pulse italic">Menghubungkan ke database...</TableCell></TableRow>
                ) : facilities && facilities.length > 0 ? facilities.map((f: any) => (
                  <TableRow key={f.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="px-8 py-4">
                      <div className="relative h-14 w-20 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                        <Image src={f.imageUrl} alt={f.name} fill className="object-cover" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-slate-800">{f.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{f.description}</div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={f.status === "Published" ? "default" : "outline"}
                        className={f.status === "Published" ? "bg-green-500" : "text-slate-400"}
                      >
                        {f.status || "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 text-primary hover:bg-primary/5 rounded-xl"
                          onClick={() => toggleStatus(f.id, f.status || "Draft")}
                          title={f.status === "Published" ? "Ubah ke Draft" : "Publikasikan"}
                        >
                          {f.status === "Published" ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 text-destructive hover:bg-destructive/10 rounded-xl" 
                          onClick={() => handleDelete(f.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={4} className="text-center py-20 text-slate-400 italic font-medium">Belum ada fasilitas yang ditambahkan.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
