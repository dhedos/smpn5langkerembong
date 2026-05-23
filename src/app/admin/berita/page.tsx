
"use client";

import React, { useState } from "react";
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

export default function AdminBerita() {
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [optimizing, setOptimizing] = useState(false);
  const [title, setTitle] = useState("");

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

  return (
    <div className="pt-24 pb-24 container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-2">
            <Newspaper className="h-8 w-8 text-secondary" /> Manajemen Berita
          </h1>
          <p className="text-muted-foreground">Tulis, edit, dan publikasikan berita sekolah.</p>
        </div>
        <Button className="bg-primary flex gap-2">
          <Plus className="h-4 w-4" /> Tulis Berita Baru
        </Button>
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
            <div className="space-y-2">
              <Label>Judul Berita</Label>
              <Input 
                placeholder="Contoh: Juara 1 Olimpiade Sains Nasional" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label>Isi Berita Lengkap</Label>
              <Textarea 
                placeholder="Tuliskan detail berita di sini..." 
                className="min-h-[300px]"
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
              <Button className="bg-primary flex gap-2">
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
        <CardHeader className="p-8 flex flex-col md:row justify-between items-center gap-4">
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
              {[
                { title: "Siswa EduVista Raih Medali Emas OSN", cat: "Prestasi", status: "Published", date: "12 Mei 2024" },
                { title: "Pelatihan Literasi Digital Guru SMP", cat: "Akademik", status: "Draft", date: "10 Mei 2024" },
                { title: "Kunjungan Studi Ke Museum Nasional", cat: "Kegiatan", status: "Published", date: "08 Mei 2024" },
                { title: "Rapat Persiapan Kelulusan Kelas IX", cat: "Pengumuman", status: "Published", date: "05 Mei 2024" },
              ].map((item, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium text-primary">{item.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{item.cat}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={item.status === 'Published' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-orange-100 text-orange-700 hover:bg-orange-100'}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.date}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></Button>
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
