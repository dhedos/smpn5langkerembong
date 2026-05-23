
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
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-2">
            <Newspaper className="h-8 w-8 text-secondary" /> Publikasi Berita
          </h1>
          <p className="text-muted-foreground text-sm">Kelola artikel, pengumuman, dan prestasi sekolah.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor Section */}
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" /> Editor Konten
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold text-slate-500">Judul</Label>
                <Input 
                  className="bg-slate-50 border-slate-100"
                  placeholder="Judul berita..." 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold text-slate-500">Kategori</Label>
                <Input 
                  className="bg-slate-50 border-slate-100"
                  placeholder="E.g. Prestasi" 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-slate-500">Konten Utama</Label>
              <Textarea 
                placeholder="Tulis detail berita di sini..." 
                className="min-h-[250px] bg-slate-50 border-slate-100"
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
                AI Optimize
              </Button>
              <Button className="bg-primary shadow-lg shadow-primary/20 flex gap-2" onClick={handleSave}>
                <Save className="h-4 w-4" /> Publikasikan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Results Section */}
        <Card className="border-none shadow-sm rounded-2xl bg-slate-50/50 border border-slate-100">
          <CardHeader className="border-b">
            <CardTitle className="text-lg flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5 text-secondary" /> AI Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase text-slate-500">Ringkasan Otomatis</Label>
              <div className="bg-white p-4 rounded-xl border border-slate-100 text-sm text-slate-600 min-h-[120px] shadow-sm italic">
                {summary || "Klik 'AI Optimize' untuk membuat ringkasan."}
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase text-slate-500">Tag SEO</Label>
              <div className="flex flex-wrap gap-2">
                {tags.length > 0 ? (
                  tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-white border-slate-100 text-primary px-3 py-1">
                      #{tag}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">Belum ada tag.</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* List Table */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white p-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b">
          <div>
            <CardTitle className="text-lg">Database Berita</CardTitle>
            <CardDescription className="text-xs">Daftar semua artikel yang tersimpan.</CardDescription>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input className="pl-9 bg-slate-50 border-slate-100" placeholder="Cari judul..." />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[400px]">Judul</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-12 text-slate-400">Memuat data...</TableCell></TableRow>
              ) : newsItems && newsItems.length > 0 ? newsItems.map((item: any) => (
                <TableRow key={item.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-bold text-slate-700">{item.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] uppercase">{item.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                       <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                       <span className="text-[10px] font-bold text-green-700 uppercase">{item.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">{item.date}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow><TableCell colSpan={5} className="text-center py-12 text-slate-400 italic">Belum ada berita yang diterbitkan.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
