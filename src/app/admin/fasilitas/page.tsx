
"use client";

import React, { useState, useMemo } from "react";
import { Building2, Plus, Trash2, Save, Image as ImageIcon, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFirestore, useCollection } from "@/firebase";
import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

export default function AdminFasilitas() {
  const db = useFirestore();
  const facilitiesRef = useMemo(() => db ? collection(db, "facilities") : null, [db]);
  const { data: facilities, loading } = useCollection(facilitiesRef);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
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
    if (!db || !name || !description) {
      toast({ title: "Gagal", description: "Nama dan deskripsi wajib diisi.", variant: "destructive" });
      return;
    }

    try {
      await addDoc(collection(db, "facilities"), {
        name,
        description,
        imageUrl: imageUrl || "https://picsum.photos/seed/facility/800/600",
      });
      setName("");
      setDescription("");
      setImageUrl("");
      toast({ title: "Berhasil", description: "Fasilitas telah ditambahkan." });
    } catch (error) {
      toast({ title: "Gagal", description: "Terjadi kesalahan saat menyimpan.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, "facilities", id));
      toast({ title: "Dihapus", description: "Fasilitas telah dihapus." });
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal menghapus data.", variant: "destructive" });
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-2">
          <Building2 className="h-8 w-8 text-secondary" /> Manajemen Fasilitas
        </h1>
        <p className="text-muted-foreground text-sm">Kelola sarana prasarana sekolah yang ditampilkan di website.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Tambah Fasilitas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Fasilitas</Label>
              <Input placeholder="E.g. Laboratorium Komputer" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Foto Fasilitas</Label>
              <div className="space-y-3">
                <div className="relative h-32 w-full border-2 border-dashed rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center">
                  {imageUrl ? (
                    <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                  ) : (
                    <div className="text-center p-4">
                      <Upload className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                      <span className="text-[10px] text-slate-400">Pilih foto dari komputer</span>
                    </div>
                  )}
                </div>
                <Input type="file" accept="image/*" onChange={handleFileChange} className="text-xs" />
                <Input placeholder="Atau URL: https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="text-xs" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea placeholder="Jelaskan kegunaan fasilitas..." value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <Button className="w-full gap-2" onClick={handleSave}>
              <Plus className="h-4 w-4" /> Simpan Fasilitas
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Fasilitas</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={3} className="text-center py-10">Memuat...</TableCell></TableRow>
                ) : facilities?.map((f: any) => (
                  <TableRow key={f.id}>
                    <TableCell>
                      <div className="relative h-12 w-16 rounded overflow-hidden">
                        <Image src={f.imageUrl} alt={f.name} fill className="object-cover" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold">{f.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{f.description}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(f.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
