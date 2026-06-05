
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Newspaper, 
  Settings, 
  ChevronRight, 
  Building2,
  Camera,
  LogOut,
  Lock,
  Database,
  ArrowRight,
  Eye,
  EyeOff,
  School,
  Megaphone,
  Trophy,
  Copyright
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarProvider,
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";
import { useUser, useAuth, useFirestore, useDoc } from "@/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, profile, loading: authLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Ambil data sekolah untuk sinkronisasi branding admin
  const schoolId = profile?.schoolId || 'smpn5-langke-rembong';
  const settingsRef = useMemo(() => db ? doc(db, "schools", schoolId) : null, [db, schoolId]);
  const { data: settings } = useDoc(settingsRef);

  const displayYear = useMemo(() => {
    return settings?.copyrightYear || new Date().getFullYear().toString();
  }, [settings?.copyrightYear]);

  const schoolName = settings?.schoolName || "Portal Sekolah";

  const adminMenuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Informasi", href: "/admin/berita", icon: Newspaper },
    { name: "Fasilitas", href: "/admin/fasilitas", icon: Building2 },
    { name: "Eskul", href: "/admin/ekstrakurikuler", icon: Trophy },
    { name: "Galeri", href: "/admin/galeri", icon: Camera },
    { name: "Pengaturan Situs", href: "/admin/settings", icon: Settings },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      if (!auth) throw new Error("Auth not initialized");
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Login Berhasil", description: `Selamat datang di Panel Kendali ${schoolName}.` });
    } catch (error: any) {
      toast({ title: "Login Gagal", description: "Email atau password salah.", variant: "destructive" });
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (authLoading) return null;

  if (!user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#1a1a1a] px-4">
        <div className="max-w-md w-full bg-[#252525] p-10 rounded-[2.5rem] border border-white/5 space-y-8 shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-primary p-4 rounded-2xl shadow-lg">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tighter uppercase">{schoolName}</h1>
            <p className="text-white/50 text-xs font-medium uppercase tracking-widest">Admin Console Access</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-white/70 text-xs font-bold uppercase tracking-widest">Admin Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-white/5 border-white/10 text-white h-12 rounded-xl" required />
            </div>
            <div className="space-y-2 relative">
              <Label className="text-white/70 text-xs font-bold uppercase tracking-widest">Password</Label>
              <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="bg-white/5 border-white/10 text-white h-12 rounded-xl pr-12" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-9 text-white/30 hover:text-white">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <Button type="submit" className="w-full bg-white text-black hover:bg-slate-200 h-14 rounded-2xl font-bold gap-2" disabled={isLoggingIn}>
              {isLoggingIn ? "Memproses..." : "Masuk Panel Kendali"} <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#f8f9fa]">
        <Sidebar className="border-r border-slate-200 bg-white">
          <SidebarHeader className="p-6 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-xl shadow-lg">
                <Database className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-sm tracking-tight text-slate-900 uppercase leading-none truncate max-w-[150px]">{schoolName}</span>
                <span className="text-[10px] text-blue-500 font-extrabold uppercase mt-1">Admin Console</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-3 pt-4">
            <SidebarMenu>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} className={cn("py-6 px-4 rounded-xl mb-1", pathname === item.href ? "bg-[#e8f0fe] text-[#1a73e8]" : "hover:bg-slate-50 text-slate-600")}>
                    <Link href={item.href}>
                      <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-[#1a73e8]" : "text-slate-400")} />
                      <span className="font-semibold">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-slate-50">
            <div className="px-4 py-4 mb-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <Copyright className="h-3 w-3 text-primary" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Copyright Notice</span>
              </div>
              <div className="text-[10px] font-bold text-slate-900 leading-tight">
                © {displayYear} {schoolName}
              </div>
            </div>
            <Button variant="ghost" className="w-full justify-start gap-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl" onClick={() => auth && signOut(auth)}>
              <LogOut className="h-4 w-4" /> Keluar Sesi
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex flex-col">
          <header className="h-16 border-b bg-white/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="h-4 w-px bg-slate-200" />
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Dashboard <ChevronRight className="h-3 w-3 inline" /> {pathname.split('/').pop()?.replace('-', ' ')}
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto bg-[#f8f9fa]">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
