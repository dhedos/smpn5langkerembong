
"use client";

import React, { useState, useMemo } from "react";
import { Newspaper, Plus, Search, Sparkles, Wand2, Trash2, Edit, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { adminContentOptimizer } from "@/ai/flows/admin-content-optimizer-flow";
import { toast } from "@/hooks/use-toast";
import { useFirestore, useCollection } from "@/firebase";
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";

export default function AdminBerita() {
  const db = useFirestore();
  const newsRef = useMemo(() => db ? collection(db, "news") : null, [db]);
  const { data: newsItems, loading } = useCollection(newsRef);

  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [optimizing, setOptimizing] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Kegiatan");

  const handleOptimize = async () => {
    if (!content.trim()) {
      toast({ title: "Konten Kosong", description: "Silakan masukkan isi berita terlebih dahulu.", variant: "destructive" });
      return;
    }

    setOptimizing(true);
    try {
      const result = await adminContentOptimizer({ content });
      setSummary(result.summary);
      setTags(result.seoTags);
      toast({ title: "Optimasi Berhasil", description: "AI telah membuat ringkasan dan tag SEO." });
    } catch (error) {
      toast({ title: "Gagal Mengoptimasi", description: "Terjadi kesalahan pada AI Service.", variant: "destructive" });
    } finally {
      setOptimizing(false);
    }
  };

  const handleSave = async () => {
    if (!db || !title || !content) {
      toast({ title: "Data Belum Lengkap", description: "Judul dan konten wajib diisi.", variant: "destructive" });
      return;
    }

    try {
      await addDoc(collection(db, "news"), {
        title,
        content,
        summary: summary || content.substring(0, 150),
        category,
        tags,
        status: "Published",
        date: new Date().toLocaleDateString('id-ID'),
        createdAt: serverTimestamp()
      });
      
      setTitle("");
      setContent("");
      setSummary("");
      setTags([]);
      toast({ title: "Berhasil", description: "Berita telah dipublikasikan." });
    } catch (error) {
      toast({ title: "Gagal Menyimpan", description: "Terjadi kesalahan saat menyimpan ke database.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, "news", id));
      toast({ title: "Dihapus", description: "Berita telah dihapus." });
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal menghapus berita.", variant: "destructive" });
    }
  };

  return (
    <div className="pt-24 pb-24 container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-2">
            <Newspaper className="h-8 w-8 text-secondary" /> Manajemen Berita
          </h1>
          <p className="text-muted-foreground">Tulis, edit, dan publikasikan berita sekolah.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Editor Section */}
        <Card className="border-none shadow-xl rounded-3xl">
          <CardHeader className="p-8 border-b">
            <CardTitle className="text-xl font-headline flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" /> Editor Berita
            </CardTitle>
            <CardDescription>Gunakan editor untuk menyusun konten berita.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Judul Berita</Label>
                <Input 
                  placeholder="Contoh: Juara 1 OSN" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label>Kategori</Label>
                <Input 
                  placeholder="Prestasi / Kegiatan" 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Isi Berita Lengkap</Label>
              <Textarea 
                placeholder="Tuliskan detail berita di sini..." 
                className="min-h-[250px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <div className="flex justify-between items-center gap-4 border-t pt-6">
              <Button 
                variant="outline" 
                className="flex gap-2 border-primary text-primary hover:bg-primary/5"
                onClick={handleOptimize}
                disabled={optimizing}
              >
                {optimizing ? (
                  <Sparkles className="h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
                Optimasi Konten (AI)
              </Button>
              <Button className="bg-primary flex gap-2" onClick={handleSave}>
                <Save className="h-4 w-4" /> Simpan Berita
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Results Section */}
        <Card className="border-none shadow-xl rounded-3xl bg-primary/5">
          <CardHeader className="p-8 border-b">
            <CardTitle className="text-xl font-headline flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5 text-secondary" /> Hasil AI Optimizer
            </CardTitle>
            <CardDescription>Ringkasan dan tag SEO yang dihasilkan secara otomatis.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="space-y-3">
              <Label className="text-primary font-bold">Ringkasan (Summary)</Label>
              <div className="bg-white p-4 rounded-2xl border text-sm text-muted-foreground min-h-[120px]">
                {summary || "Klik 'Optimasi Konten' untuk menghasilkan ringkasan otomatis."}
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-primary font-bold">SEO Tags</Label>
              <div className="flex flex-wrap gap-2">
                {tags.length > 0 ? (
                  tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-white border text-primary px-3 py-1">
                      #{tag}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground italic">Belum ada tag yang dihasilkan.</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* List Table */}
      <Card className="border-none shadow-xl">
        <CardHeader className="p-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <CardTitle>Daftar Berita Terbaru</CardTitle>
            <CardDescription>Manajemen artikel yang sudah dipublikasikan.</CardDescription>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Cari berita..." />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[400px]">Judul Berita</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center">Loading...</TableCell></TableRow>
              ) : newsItems && newsItems.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-primary">{item.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{item.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={item.status === 'Published' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-orange-100 text-orange-700 hover:bg-orange-100'}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.date}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
