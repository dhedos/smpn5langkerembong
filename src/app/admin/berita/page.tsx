"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Newspaper, Sparkles, Wand2, Trash2, Edit, Save, X, Eye, EyeOff, Loader2, Image as ImageIcon, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { adminContentOptimizer } from "@/ai/flows/admin-content-optimizer-flow";
import { generateNewsImage } from "@/ai/flows/generate-news-image-flow";
import { toast } from "@/hooks/use-toast";
import { useFirestore, useCollection } from "@/firebase";
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, query, where } from "firebase/firestore";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { cn } from "@/lib/utils";

export default function AdminBerita() {
  const db = useFirestore();
  const schoolId = 'smpn5-langke-rembong';

  const newsRef = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "news"), where("schoolId", "==", schoolId));
  }, [db, schoolId]);

  const { data: newsItems, loading } = useCollection(newsRef);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Akademik");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  
  const [optimizing, setOptimizing] = useState(false);
  const [generatingImg, setGeneratingImg] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast({ title: "File Terlalu Besar", description: "Maksimal 1MB.", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateAIImage = async () => {
    if (!title.trim()) {
      toast({ title: "Judul Kosong", description: "Masukkan judul berita untuk membuat gambar AI.", variant: "destructive" });
      return;
    }
    setGeneratingImg(true);
    try {
      const result = await generateNewsImage({ title });
      setImageUrl(result.imageUrl);
      toast({ title: "Gambar Dibuat", description: "AI telah menghasilkan gambar berdasarkan judul." });
    } catch (error) {
      toast({ title: "Gagal Membuat Gambar", variant: "destructive" });
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
    } catch (error) {
      toast({ title: "Gagal Mengoptimasi", variant: "destructive" });
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
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title);
    setCategory(item.category || "Akademik");
    setContent(item.content);
    setSummary(item.summary || "");
    setTags(item.tags || []);
    setImageUrl(item.imageUrl || "");
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
          toast({ title: "Berhasil Diperbarui" });
        })
        .catch(async (error) => {
          setIsSaving(false);
          errorEmitter.emit('permission-error', new FirestorePermissionError({ path: `news/${editingId}`, operation: 'update', requestResourceData: data }));
        });
    } else {
      addDoc(collection(db, "news"), data)
        .then(() => {
          setIsSaving(false);
          resetForm();
          toast({ title: "Berhasil Disimpan" });
        })
        .catch(async (error) => {
          setIsSaving(false);
          errorEmitter.emit('permission-error', new FirestorePermissionError({ path: 'news', operation: 'create', requestResourceData: data }));
        });
    }
  };

  const toggleStatus = (id: string, currentStatus: string) => {
    if (!db) return;
    const newStatus = currentStatus === "Published" ? "Draft" : "Published";
    updateDoc(doc(db, "news", id), { status: newStatus })
      .then(() => toast({ title: "Status Diperbarui" }))
      .catch(async () => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: `news/${id}`, operation: 'update' })));
  };

  const handleDelete = (id: string) => {
    if (!db || !confirm("Hapus berita ini?")) return;
    deleteDoc(doc(db, "news", id))
      .then(() => toast({ title: "Dihapus" }))
      .catch(async () => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: `news/${id}`, operation: 'delete' })));
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-2 uppercase tracking-tighter">
            <Newspaper className="h-8 w-8 text-secondary" /> Manajemen Informasi
          </h1>
          <p className="text-muted-foreground text-sm font-medium">Buat, edit, dan publikasikan informasi sekolah.</p>
        </div>
        {editingId && (
          <Button variant="outline" className="rounded-xl gap-2" onClick={resetForm}>
            <RotateCcw className="h-4 w-4" /> Batal Edit
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <Card className="lg:col-span-3 border-none shadow-xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b p-8">
            <CardTitle className="text-xl flex items-center gap-2">
              <Edit className="h-6 w-6 text-primary" /> {editingId ? "Edit Informasi" : "Penulisan Informasi Baru"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs uppercase font-extrabold text-slate-400">Judul Berita</Label>
                <Input 
                  className="h-12 bg-slate-50 border-slate-100 rounded-xl font-bold"
                  placeholder="Masukkan judul..." 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase font-extrabold text-slate-400">Kategori</Label>
                <Input 
                  className="h-12 bg-slate-50 border-slate-100 rounded-xl"
                  placeholder="Contoh: Pengumuman" 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-xs uppercase font-extrabold text-slate-400">Gambar Informasi</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative aspect-video rounded-2xl border-2 border-dashed flex items-center justify-center bg-slate-50 overflow-hidden group">
                  {imageUrl ? (
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-4">
                      <ImageIcon className="h-10 w-10 text-slate-300 mx-auto" />
                      <span className="text-[10px] text-slate-400 font-bold">UNGGAH ATAU GUNAKAN AI</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <div className="flex flex-col gap-3 justify-center">
                  <Button 
                    variant="outline" 
                    className="h-14 rounded-xl border-secondary text-primary font-bold gap-2 hover:bg-secondary/10"
                    onClick={handleGenerateAIImage}
                    disabled={generatingImg}
                  >
                    {generatingImg ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5 text-secondary" />}
                    {generatingImg ? "AI Melukis..." : "AI Generate Gambar"}
                  </Button>
                  <p className="text-[10px] text-slate-400 italic">Klik tombol di atas untuk membuat gambar otomatis berdasarkan judul berita.</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase font-extrabold text-slate-400">Konten Utama</Label>
              <Textarea 
                placeholder="Tulis detail informasi di sini..." 
                className="min-h-[250px] bg-slate-50 border-slate-100 rounded-2xl p-6"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="flex justify-between items-center pt-8 border-t">
              <Button 
                variant="outline" 
                className="h-12 rounded-xl gap-2 font-bold"
                onClick={handleOptimize}
                disabled={optimizing}
              >
                {optimizing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5 text-secondary" />}
                AI Content Optimizer
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" className="h-12 rounded-xl px-6" onClick={() => handleSave("Draft")} disabled={isSaving}>Simpan Draft</Button>
                <Button className="h-12 px-8 rounded-xl bg-primary shadow-lg" onClick={() => handleSave("Published")} disabled={isSaving}>
                  {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  {editingId ? "Perbarui" : "Publikasikan"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-white border border-slate-100 h-fit">
            <CardHeader className="bg-slate-50/50 border-b p-8">
              <CardTitle className="text-xl flex items-center gap-3 text-primary">
                <Sparkles className="h-5 w-5 text-secondary" /> AI Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-extrabold uppercase text-slate-400">Ringkasan Otomatis</Label>
                <Textarea 
                  className="bg-slate-50 border-slate-100 rounded-2xl text-sm italic"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </div>
              <div className="space-y-4">
                <Label className="text-xs font-extrabold uppercase text-slate-400">Tag SEO</Label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-slate-100 text-primary px-3 py-1 rounded-lg">#{tag}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
             <CardHeader className="bg-slate-50/50 border-b p-8"><CardTitle className="text-xl">Daftar Informasi</CardTitle></CardHeader>
             <CardContent className="p-0">
               <Table>
                 <TableBody>
                   {loading ? (
                     <TableRow><TableCell className="text-center py-10">Memuat...</TableCell></TableRow>
                   ) : newsItems && newsItems.length > 0 ? [...newsItems].sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).map((item: any) => (
                     <TableRow key={item.id} className="group">
                       <TableCell className="p-6 font-bold truncate max-w-[150px]">{item.title}</TableCell>
                       <TableCell className="text-center">
                         <Button 
                           variant="ghost" 
                           size="sm" 
                           className={cn("rounded-full h-10 px-4", item.status === "Published" ? "text-green-600 bg-green-50" : "text-slate-400 bg-slate-50")}
                           onClick={() => toggleStatus(item.id, item.status)}
                         >
                           {item.status === "Published" ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                         </Button>
                       </TableCell>
                       <TableCell className="text-right p-6 flex gap-2 justify-end">
                         <Button variant="ghost" size="icon" className="text-primary" onClick={() => handleEdit(item)}><Edit className="h-4 w-4" /></Button>
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
    </div>
  );
}
