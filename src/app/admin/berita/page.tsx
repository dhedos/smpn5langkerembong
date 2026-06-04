"use client";

import React, { useState, useMemo } from "react";
import { Newspaper, Search, Sparkles, Wand2, Trash2, Edit, Save, X } from "lucide-react";
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
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

export default function AdminBerita() {
  const db = useFirestore();
  const newsRef = useMemo(() => db ? collection(db, "news") : null, [db]);
  const { data: newsItems, loading } = useCollection(newsRef);

  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [optimizing, setOptimizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Umum");

  const handleOptimize = async () => {
    if (!content.trim()) {
      toast({ title: "Konten Kosong", description: "Silakan masukkan isi informasi terlebih dahulu agar AI dapat menganalisis.", variant: "destructive" });
      return;
    }

    setOptimizing(true);
    try {
      const result = await adminContentOptimizer({ content });
      setSummary(result.summary);
      setTags(result.seoTags);
      toast({ title: "Optimasi Berhasil", description: "AI telah membuat ringkasan dan tag SEO berdasarkan konten Anda." });
    } catch (error) {
      toast({ title: "Gagal Mengoptimasi", description: "Terjadi kesalahan pada AI Service.", variant: "destructive" });
    } finally {
      setOptimizing(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()]);
      }
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSave = () => {
    if (!db || !title || !content) {
      toast({ title: "Data Belum Lengkap", description: "Judul dan konten utama wajib diisi.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    const data = {
      title,
      content,
      summary: summary || content.substring(0, 150),
      category,
      tags,
      status: "Published",
      date: new Date().toLocaleDateString('id-ID'),
      createdAt: serverTimestamp()
    };

    addDoc(collection(db, "news"), data)
      .then(() => {
        setIsSaving(false);
        setTitle("");
        setContent("");
        setSummary("");
        setTags([]);
        toast({ title: "Berhasil", description: "Informasi telah dipublikasikan ke website." });
      })
      .catch(async (error) => {
        setIsSaving(false);
        const permissionError = new FirestorePermissionError({
          path: 'news',
          operation: 'create',
          requestResourceData: data,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const handleDelete = (id: string) => {
    if (!db) return;
    const docRef = doc(db, "news", id);
    
    deleteDoc(docRef)
      .then(() => {
        toast({ title: "Dihapus", description: "Informasi telah dihapus secara permanen." });
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
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-2">
            <Newspaper className="h-8 w-8 text-secondary" /> Publikasi Informasi
          </h1>
          <p className="text-muted-foreground text-sm font-medium">Tulis artikel dan gunakan AI untuk mengoptimalkan konten informasi.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <Card className="lg:col-span-3 border-none shadow-xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b p-8">
            <CardTitle className="text-xl flex items-center gap-2">
              <Edit className="h-6 w-6 text-primary" /> Penulisan Informasi
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs uppercase font-extrabold text-slate-400 tracking-widest">Judul Informasi</Label>
                <Input 
                  className="h-12 bg-slate-50 border-slate-100 rounded-xl font-bold"
                  placeholder="Masukkan judul informasi..." 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase font-extrabold text-slate-400 tracking-widest">Kategori</Label>
                <Input 
                  className="h-12 bg-slate-50 border-slate-100 rounded-xl"
                  placeholder="E.g. Akademik, Pengumuman" 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  disabled={isSaving}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase font-extrabold text-slate-400 tracking-widest">Konten Utama</Label>
              <Textarea 
                placeholder="Tulis detail informasi di sini secara lengkap..." 
                className="min-h-[350px] bg-slate-50 border-slate-100 rounded-[2rem] p-6 leading-relaxed"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isSaving}
              />
            </div>
            <div className="flex justify-between items-center gap-4 border-t pt-8">
              <Button 
                variant="outline" 
                className="h-12 px-6 rounded-xl flex gap-2 border-primary/20 text-primary hover:bg-primary/5 font-bold"
                onClick={handleOptimize}
                disabled={optimizing || isSaving}
              >
                {optimizing ? (
                  <Sparkles className="h-5 w-5 animate-spin text-secondary" />
                ) : (
                  <Wand2 className="h-5 w-5 text-secondary" />
                )}
                {optimizing ? "Menganalisis..." : "AI Optimize"}
              </Button>
              <Button 
                className="h-12 px-8 rounded-xl bg-primary shadow-lg shadow-primary/20 flex gap-2 font-bold" 
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="h-5 w-5" /> {isSaving ? "Menyimpan..." : "Publikasikan Informasi"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-none shadow-xl rounded-[2.5rem] bg-white border border-slate-100 flex flex-col">
          <CardHeader className="bg-slate-50/50 border-b p-8">
            <CardTitle className="text-xl flex items-center gap-3 text-primary">
              <div className="bg-secondary p-2 rounded-lg">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              AI Suggestions
            </CardTitle>
            <CardDescription className="font-medium">Hasil optimasi kecerdasan buatan untuk informasi.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8 flex-1">
            <div className="space-y-3">
              <Label className="text-xs font-extrabold uppercase text-slate-400 tracking-widest">Ringkasan Otomatis</Label>
              <Textarea 
                className="bg-slate-50 border-slate-100 rounded-2xl text-sm min-h-[150px] italic leading-relaxed"
                placeholder="Klik 'AI Optimize' untuk membuat ringkasan..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                disabled={isSaving}
              />
            </div>
            <div className="space-y-4">
              <Label className="text-xs font-extrabold uppercase text-slate-400 tracking-widest">Tag Terkait</Label>
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.length > 0 ? (
                  tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-slate-100 border-slate-200 text-primary px-4 py-2 rounded-xl flex items-center gap-2 group">
                      #{tag}
                      <button onClick={() => removeTag(tag)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="h-3 w-3 text-destructive" />
                      </button>
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground italic">Belum ada tag yang dihasilkan.</span>
                )}
              </div>
              <div className="relative">
                <Input 
                  placeholder="Tambah tag manual (Tekan Enter)..." 
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="bg-slate-50 border-slate-100 rounded-xl h-12"
                  disabled={isSaving}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
        <CardHeader className="bg-white p-8 border-b">
          <CardTitle className="text-xl">Arsip Informasi</CardTitle>
          <CardDescription className="font-medium">Kelola semua konten yang telah Anda publikasikan.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="px-8 font-bold">Judul Informasi</TableHead>
                <TableHead className="font-bold">Kategori</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="font-bold">Tanggal</TableHead>
                <TableHead className="text-right px-8 font-bold">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-20 text-slate-400 animate-pulse font-medium">Menghubungkan ke database...</TableCell></TableRow>
              ) : newsItems && newsItems.length > 0 ? newsItems.map((item: any) => (
                <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="px-8 font-bold text-slate-800 py-6">{item.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] uppercase font-black tracking-widest border-primary/20 text-primary">{item.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <div className="h-2 w-2 rounded-full bg-green-500" />
                       <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">{item.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-bold text-slate-400">{item.date}</TableCell>
                  <TableCell className="text-right px-8">
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-destructive hover:bg-destructive/10 rounded-xl" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow><TableCell colSpan={5} className="text-center py-20 text-slate-400 italic">Belum ada informasi yang diterbitkan.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}