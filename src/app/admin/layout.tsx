
"use client";

import React, { useState } from "react";
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
  EyeOff
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
import { useUser, useAuth } from "@/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { toast } from "@/hooks/use-toast";

const adminMenuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Manajemen Informasi", href: "/admin/informasi", icon: Newspaper },
  { name: "Manajemen Fasilitas", href: "/admin/fasilitas", icon: Building2 },
  { name: "Manajemen Galeri", href: "/admin/galeri", icon: Camera },
  { name: "Pengaturan Situs", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading: authLoading } = useUser();
  const auth = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Silakan masukkan email dan kata sandi.",
        variant: "destructive"
      });
      return;
    }

    setIsLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login Berhasil",
        description: "Selamat datang di GN Nusantara.",
      });
    } catch (error: any) {
      let message = "Email atau password salah.";
      if (error.code === 'auth/configuration-not-found') {
        message = "Metode login email/password belum diaktifkan di Firebase Console.";
      }
      toast({
        title: "Login Gagal",
        description: message,
        variant: "destructive"
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => signOut(auth);

  if (authLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#1a1a1a]">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#1a1a1a] px-4">
        <div className="max-w-md w-full bg-[#252525] p-10 rounded-[2.5rem] border border-white/5 space-y-8 shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-primary p-4 rounded-2xl shadow-lg">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tighter">GN Nusantara</h1>
            <p className="text-white/50 text-sm">Masuk untuk mengelola website sekolah.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-white/70 text-xs font-bold uppercase tracking-widest">Email Admin</Label>
              <Input 
                type="email"
                placeholder="admin@sekolah.sch.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:ring-primary"
                required
              />
            </div>
            <div className="space-y-2 relative">
              <Label className="text-white/70 text-xs font-bold uppercase tracking-widest">Kata Sandi</Label>
              <Input 
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/10 text-white h-12 rounded-xl pr-12 focus:ring-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-9 text-white/30 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-white text-black hover:bg-slate-200 h-14 rounded-2xl font-bold gap-2"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Memverifikasi..." : "Masuk Sekarang"} <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
          
          <Link href="/" className="block text-center text-white/30 text-xs hover:text-white underline underline-offset-4">
            Kembali ke Beranda
          </Link>
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
              <div className="bg-[#1a73e8] p-2 rounded-xl shadow-lg">
                <Database className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-sm tracking-tight text-slate-900 uppercase">GN Nusantara</span>
                <span className="text-[10px] text-blue-500 font-extrabold uppercase">Admin Portal</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-3 pt-4">
            <SidebarMenu>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.href}
                    className={cn(
                      "py-6 px-4 rounded-xl transition-all duration-200 mb-1",
                      pathname === item.href 
                        ? "bg-[#e8f0fe] text-[#1a73e8] hover:bg-[#e8f0fe]" 
                        : "hover:bg-slate-50 text-slate-600"
                    )}
                  >
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
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Keluar Sesi
            </Button>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-col">
          <header className="h-16 border-b bg-white/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="h-4 w-px bg-slate-200" />
              <div className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-tighter">
                Sistem <ChevronRight className="h-3 w-3" /> {pathname === '/admin' ? 'Dashboard' : pathname.split('/').pop()?.replace('-', ' ')}
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-3">
                 <div className="flex flex-col items-end text-right">
                   <span className="text-xs font-bold text-slate-700">{user.email?.split('@')[0]}</span>
                   <span className="text-[10px] text-green-500 font-bold uppercase">Online</span>
                 </div>
                 <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs shadow-md">
                   {user.email?.substring(0, 2).toUpperCase()}
                 </div>
               </div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto bg-[#f8f9fa]">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
