"use client";

import React, { useState, useMemo } from "react";
import { Newspaper, Sparkles, Wand2, Trash2, Edit, Save, X } from "lucide-react";
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
import { collection, addDoc, deleteDoc, doc, serverTimestamp, query, where } from "firebase/firestore";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function AdminInformasi() {
  const db = useFirestore();
  const { profile } = useUser();
  const schoolId = profile?.schoolId || 'default-school';

  const newsRef = useMemo(() => {
    if (!db) return null;
    // Multi-tenant: filter news by current schoolId
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
    if (!content.trim()) return;
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

  const handleSave = () => {
    if (!db || !title || !content) return;
    setIsSaving(true);
    const data = {
      title,
      content,
      summary: summary || content.substring(0, 150),
      category,
      tags,
      status: "Published",
      date: new Date().toLocaleDateString('id-ID'),
      createdAt: serverTimestamp(),
      schoolId // Mandatory for multi-tenancy
    };

    addDoc(collection(db, "news"), data)
      .then(() => {
        setIsSaving(false);
        setTitle(""); setContent(""); setSummary(""); setTags([]);
        toast({ title: "Berhasil", description: "Informasi telah dipublikasikan ke GN Nusantara." });
      })
      .catch(() => {
        setIsSaving(false);
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: 'news', operation: 'create' }));
      });
  };

  const handleDelete = (id: string) => {
    if (!db) return;
    deleteDoc(doc(db, "news", id))
      .then(() => toast({ title: "Dihapus" }))
      .catch(() => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: `news/${id}`, operation: 'delete' })));
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-2 uppercase tracking-tight">
            <Newspaper className="h-8 w-8 text-secondary" /> Manajemen Informasi Sekolah
          </h1>
          <p className="text-muted-foreground text-sm font-medium">Pengelolaan konten multi-tenant GN Nusantara.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <Card className="lg:col-span-3 border-none shadow-xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b p-8"><CardTitle className="text-xl flex items-center gap-2">Tulis Informasi</CardTitle></CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-400">Judul</Label>
                <Input className="h-12 bg-slate-50 rounded-xl" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isSaving} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-400">Kategori</Label>
                <Input className="h-12 bg-slate-50 rounded-xl" value={category} onChange={(e) => setCategory(e.target.value)} disabled={isSaving} />
              </div>
            </div>
            <Textarea placeholder="Konten utama..." className="min-h-[300px] bg-slate-50 rounded-[2rem] p-6" value={content} onChange={(e) => setContent(e.target.value)} disabled={isSaving} />
            <div className="flex justify-between items-center pt-8">
              <Button variant="outline" className="rounded-xl font-bold" onClick={handleOptimize} disabled={optimizing || isSaving}>
                <Sparkles className="h-5 w-5 text-secondary mr-2" /> AI Optimize
              </Button>
              <Button className="rounded-xl font-bold px-8 bg-primary" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Menyimpan..." : "Publikasikan ke Website"}
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 border-none shadow-xl rounded-[2.5rem] bg-white border border-slate-100 h-fit">
          <CardHeader className="bg-slate-50/50 border-b p-8"><CardTitle className="text-lg">AI Smart Summary</CardTitle></CardHeader>
          <CardContent className="p-8 space-y-6">
            <Textarea className="bg-slate-50 rounded-2xl italic" placeholder="Ringkasan otomatis..." value={summary} onChange={(e) => setSummary(e.target.value)} />
            <div className="space-y-4">
              <Label className="text-xs font-bold uppercase text-slate-400">Tags SEO</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => <Badge key={tag} className="bg-slate-100 text-primary px-3 py-1 rounded-lg">#{tag}</Badge>)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}