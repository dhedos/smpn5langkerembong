
"use client";

import React, { useState, useMemo } from "react";
import { Newspaper, Sparkles, Wand2, Trash2, Edit, Save, X, Eye, EyeOff, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { adminContentOptimizer } from "@/ai/flows/admin-content-optimizer-flow";
import { toast } from "@/hooks/use-toast";
import { useFirestore, useCollection, useUser } from "@/firebase";
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, query, where } from "firebase/firestore";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { cn } from "@/lib/utils";

export default function AdminBerita() {
  const db = useFirestore();
  const { profile } = useUser();
  const schoolId = profile?.schoolId || 'smpn5-langke-rembong';

  // Kueri sederhana untuk menghindari keharusan membuat Composite Index manual
  const newsRef = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "news"), where("schoolId", "==", schoolId));
  }, [db, schoolId]);

  const { data: newsItems, loading } = useCollection(newsRef);

  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [optimizing, setOptimizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Akademik");

  const handleOptimize = async () => {
    if (!content.trim()) {
      toast({ title: "Konten Kosong", description: "Silakan masukkan isi informasi terlebih dahulu.", variant: "destructive" });
      return;
    }

    setOptimizing(true);
    try {
      const result = await adminContentOptimizer({ content });
      setSummary(result.summary);
      setTags(result.seoTags);
      toast({ title: "Optimasi Berhasil", description: "AI telah membuat ringkasan dan tag SEO." });
    } catch (error) {
      toast({ title: "Gagal Mengoptimasi", variant: "destructive" });
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

  const handleSave = (status: "Draft" | "Published") => {
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
      status: status,
      schoolId,
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
        toast({ title: status === "Published" ? "Berhasil Publikasi" : "Berhasil Simpan", description: "Informasi telah diperbarui." });
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

  const toggleStatus = (id: string, currentStatus: string) => {
    if (!db) return;
    const newStatus = currentStatus === "Published" ? "Draft" : "Published";
    const docRef = doc(db, "news", id);
    
    updateDoc(docRef, { status: newStatus })
      .then(() => toast({ title: "Status Diperbarui" }))
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
    const docRef = doc(db, "news", id);
    
    deleteDoc(docRef)
      .then(() => {
        toast({ title: "Dihapus", description: "Informasi telah dihapus." });
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
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-2 uppercase tracking-tighter">
            <Newspaper className="h-8 w-8 text-secondary" /> Manajemen Informasi
          </h1>
          <p className="text-muted-foreground text-sm font-medium">Kelola berita dan pengumuman sekolah.</p>
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
                <Label className="text-xs uppercase font-extrabold text-slate-400">Judul</Label>
                <Input 
                  className="h-12 bg-slate-50 border-slate-100 rounded-xl font-bold"
                  placeholder="Contoh: Pengumuman Libur Semester" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase font-extrabold text-slate-400">Kategori</Label>
                <Input 
                  className="h-12 bg-slate-50 border-slate-100 rounded-xl"
                  placeholder="Akademik / Kegiatan / Pengumuman" 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  disabled={isSaving}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase font-extrabold text-slate-400">Isi Informasi</Label>
              <Textarea 
                placeholder="Tulis detail informasi di sini..." 
                className="min-h-[300px] bg-slate-50 border-slate-100 rounded-[2rem] p-6 leading-relaxed"
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
                {optimizing ? "AI Menganalisis..." : "AI Optimize"}
              </Button>
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  className="h-12 px-6 rounded-xl font-bold" 
                  onClick={() => handleSave("Draft")}
                  disabled={isSaving}
                >
                  Simpan Draft
                </Button>
                <Button 
                  className="h-12 px-8 rounded-xl bg-primary shadow-lg shadow-primary/20 flex gap-2 font-bold" 
                  onClick={() => handleSave("Published")}
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  {isSaving ? "Memproses..." : "Publikasikan"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-white border border-slate-100">
            <CardHeader className="bg-slate-50/50 border-b p-8">
              <CardTitle className="text-xl flex items-center gap-3 text-primary">
                <Sparkles className="h-5 w-5 text-secondary" />
                AI Sugestions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-3">
                <Label className="text-xs font-extrabold uppercase text-slate-400">Ringkasan Otomatis</Label>
                <Textarea 
                  className="bg-slate-50 border-slate-100 rounded-2xl text-sm min-h-[120px] italic leading-relaxed"
                  placeholder="Klik 'AI Optimize' untuk menghasilkan ringkasan..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-4">
                <Label className="text-xs font-extrabold uppercase text-slate-400">Tag SEO</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-slate-100 text-primary px-4 py-1.5 rounded-xl flex items-center gap-2 group">
                      #{tag}
                      <button onClick={() => removeTag(tag)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="h-3 w-3 text-destructive" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input 
                  placeholder="Tambah tag manual (Tekan Enter)..." 
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="bg-slate-50 border-slate-100 rounded-xl"
                  disabled={isSaving}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b p-8">
              <CardTitle className="text-xl">Daftar Terbaru</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell className="text-center py-10 text-slate-400 animate-pulse italic">Memuat data...</TableCell></TableRow>
                  ) : newsItems && newsItems.length > 0 ? newsItems.slice(0, 5).map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="p-6">
                        <div className="font-bold text-slate-900 truncate max-w-[200px]">{item.title}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">{item.date}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={cn(
                            "rounded-full h-10 px-4 gap-2 border", 
                            item.status === "Published" ? "text-green-600 bg-green-50 border-green-100" : "text-slate-400 bg-slate-50"
                          )}
                          onClick={() => toggleStatus(item.id, item.status)}
                        >
                          {item.status === "Published" ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          <span className="text-[10px] font-black uppercase">{item.status || "Draft"}</span>
                        </Button>
                      </TableCell>
                      <TableCell className="text-right p-6">
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow><TableCell className="text-center py-10 text-slate-300 italic">Belum ada informasi.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
