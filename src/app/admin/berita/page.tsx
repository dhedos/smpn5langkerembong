"use client";

import React, { useState, useMemo } from "react";
import { Newspaper, Sparkles, Wand2, Trash2, Edit, Save, Loader2, Image as ImageIcon, RotateCcw, Eye, EyeOff, ExternalLink, AlertCircle, Link as LinkIcon, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { adminContentOptimizer } from "@/ai/flows/admin-content-optimizer-flow";
import { generateNewsImage } from "@/ai/flows/generate-news-image-flow";
import { toast } from "@/hooks/use-toast";
import { useFirestore, useCollection, useStorage } from "@/firebase";
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, query, where } from "firebase/firestore";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { cn } from "@/lib/utils";
import { optimizeImage } from "@/lib/image-optimizer";
import { uploadOptimizedImage } from "@/lib/storage-upload";

export default function AdminBerita() {
  const db = useFirestore();
  const storage = useStorage();
  const schoolId = 'smpn5-langke-rembong';

  const newsRef = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "news"), where("schoolId", "==", schoolId));
  }, [db, schoolId]);

  const { data: rawNews, loading } = useCollection(newsRef);

  const newsItems = useMemo(() => {
    if (!rawNews) return [];
    return [...rawNews].sort((a: any, b: any) => {
      const dateA = a.createdAt?.seconds || 0;
      const dateB = b.createdAt?.seconds || 0;
      return dateB - dateA;
    });
  }, [rawNews]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Akademik");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  
  const [optimizing, setOptimizing] = useState(false);
  const [generatingImg, setGeneratingImg] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [aiError, setAiError] = useState<{message: string, link: string} | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && storage) {
      setIsProcessingFile(true);
      try {
        const base64 = await optimizeImage(file);
        const cloudUrl = await uploadOptimizedImage(storage, base64, 'news');
        setImageUrl(cloudUrl);
        toast({ title: "Berhasil Unggah", description: "Gambar telah tersimpan di cloud storage." });
      } catch (error: any) {
        toast({ title: "Gagal", description: error.message, variant: "destructive" });
      } finally {
        setIsProcessingFile(false);
      }
    }
  };

  const handleGenerateAIImage = async () => {
    if (!title.trim()) {
      toast({ title: "Judul Kosong", description: "Masukkan judul berita untuk membuat gambar AI.", variant: "destructive" });
      return;
    }
    setGeneratingImg(true);
    setAiError(null);
    try {
      const result = await generateNewsImage({ title });
      if (result.error) {
        if (result.helpLink) {
          setAiError({ message: result.error, link: result.helpLink });
        }
        toast({ title: "Gagal Membuat Gambar", description: result.error, variant: "destructive" });
      } else if (result.imageUrl && storage) {
        // AI image generation usually returns a Data URL, we should upload it too
        const cloudUrl = await uploadOptimizedImage(storage, result.imageUrl, 'news-ai');
        setImageUrl(cloudUrl);
        toast({ title: "Gambar AI Berhasil", description: "Ilustrasi telah disimpan di cloud." });
      }
    } catch (error: any) {
      toast({ title: "Kesalahan AI", description: "Layanan AI tidak dapat dijangkau.", variant: "destructive" });
    } finally {
      setGeneratingImg(false);
    }
  };

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
    } catch (error: any) {
      toast({ title: "Gagal", variant: "destructive" });
    } finally {
      setOptimizing(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setCategory("Akademik");
    setContent("");
    setSummary("");
    setTags([]);
    setImageUrl("");
    setExternalUrl("");
    setAiError(null);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title);
    setCategory(item.category || "Akademik");
    setContent(item.content);
    setSummary(item.summary || "");
    setTags(item.tags || []);
    setImageUrl(item.imageUrl || "");
    setExternalUrl(item.externalUrl || "");
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      status,
      imageUrl,
      externalUrl,
      schoolId,
      date: new Date().toLocaleDateString('id-ID'),
      updatedAt: serverTimestamp(),
      ...(editingId ? {} : { createdAt: serverTimestamp() })
    };

    if (editingId) {
      updateDoc(doc(db, "news", editingId), data)
        .then(() => {
          setIsSaving(false);
          resetForm();
          toast({ title: "Informasi Diperbarui" });
        })
        .catch(async () => {
          setIsSaving(false);
          errorEmitter.emit('permission-error', new FirestorePermissionError({ path: `news/${editingId}`, operation: 'update' }));
        });
    } else {
      addDoc(collection(db, "news"), data)
        .then(() => {
          setIsSaving(false);
          resetForm();
          toast({ title: "Informasi Dipublikasikan" });
        })
        .catch(async () => {
          setIsSaving(false);
          errorEmitter.emit('permission-error', new FirestorePermissionError({ path: 'news', operation: 'create' }));
        });
    }
  };

  const toggleStatus = (id: string, currentStatus: string) => {
    if (!db) return;
    const newStatus = currentStatus === "Published" ? "Draft" : "Published";
    updateDoc(doc(db, "news", id), { status: newStatus })
      .then(() => toast({ title: "Status Berubah" }))
      .catch(async () => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: `news/${id}`, operation: 'update' })));
  };

  const handleDelete = (id: string) => {
    if (!db || !confirm("Hapus berita ini?")) return;
    deleteDoc(doc(db, "news", id))
      .then(() => toast({ title: "Informasi Dihapus" }))
      .catch(async () => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: `news/${id}`, operation: 'delete' })));
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-2 uppercase tracking-tighter">
            <Newspaper className="h-8 w-8 text-secondary" /> Manajemen Informasi
          </h1>
          <p className="text-muted-foreground text-sm font-medium">Data disimpan di cloud dengan URL publik yang efisien.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <Card className="lg:col-span-3 border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 border-b p-8"><CardTitle className="text-xl flex items-center gap-2">Tulis Informasi</CardTitle></CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input placeholder="Judul..." value={title} onChange={(e) => setTitle(e.target.value)} className="h-12 bg-slate-50" />
              <Input placeholder="Kategori..." value={category} onChange={(e) => setCategory(e.target.value)} className="h-12 bg-slate-50" />
            </div>

            <div className="space-y-4">
              <Label className="text-xs font-bold uppercase text-slate-400">Gambar Informasi (Cloud Storage)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative aspect-video rounded-2xl border-2 border-dashed flex items-center justify-center bg-slate-50 overflow-hidden">
                  {isProcessingFile ? (
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  ) : imageUrl ? (
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="h-10 w-10 text-slate-300" />
                  )}
                  <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" disabled={isProcessingFile} />
                </div>
                <div className="flex flex-col gap-2 justify-center">
                  <Button variant="outline" className="h-12 rounded-xl gap-2 font-bold" onClick={handleGenerateAIImage} disabled={generatingImg}>
                    {generatingImg ? <Loader2 className="animate-spin" /> : <Sparkles />} Generate AI Image
                  </Button>
                </div>
              </div>
            </div>

            <Textarea placeholder="Isi berita..." className="min-h-[250px] bg-slate-50" value={content} onChange={(e) => setContent(e.target.value)} />

            <div className="flex justify-between pt-8 border-t">
              <Button variant="outline" className="rounded-xl font-bold" onClick={handleOptimize} disabled={optimizing}>
                <Wand2 className="mr-2" /> AI Optimize
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" className="rounded-xl px-6" onClick={() => handleSave("Draft")} disabled={isSaving}>Draft</Button>
                <Button className="rounded-xl px-8 bg-primary" onClick={() => handleSave("Published")} disabled={isSaving}>
                  {isSaving ? <Loader2 className="animate-spin" /> : "Publikasikan"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-none shadow-xl rounded-[2.5rem] bg-white h-fit">
          <CardHeader className="bg-slate-50/50 border-b p-8"><CardTitle className="text-lg">Daftar Berita</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell className="text-center py-10">Memuat...</TableCell></TableRow>
                ) : newsItems.length > 0 ? newsItems.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="p-4 font-bold">{item.title}</TableCell>
                    <TableCell className="text-right p-4 flex gap-2 justify-end">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                )) : <TableRow><TableCell className="text-center py-10">Kosong</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
