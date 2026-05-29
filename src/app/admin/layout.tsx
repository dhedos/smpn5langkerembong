"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Newspaper, 
  Settings, 
  ChevronRight, 
  Building2,
  Globe,
  Camera,
  LogOut,
  ShieldCheck,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

const adminMenuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Manajemen Berita", href: "/admin/berita", icon: Newspaper },
  { name: "Manajemen Fasilitas", href: "/admin/fasilitas", icon: Building2 },
  { name: "Manajemen Galeri", href: "/admin/galeri", icon: Camera },
  { name: "Pengaturan Situs", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useUser();
  const auth = useAuth();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = () => signOut(auth);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-500 animate-pulse uppercase tracking-widest">Memeriksa Hak Akses...</p>
        </div>
      </div>
    );
  }

  // Auth Guard: If not logged in, show Professional Login UI
  if (!user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full space-y-8 text-center animate-in fade-in zoom-in duration-500">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
            <div className="bg-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold font-headline text-slate-900 mb-2 tracking-tight">Panel Admin</h1>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              Selamat datang kembali. Silakan masuk dengan akun Google Anda untuk mulai mengelola konten website sekolah.
            </p>
            <Button 
              size="lg" 
              className="w-full bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm py-8 rounded-2xl gap-3 text-lg font-bold transition-all hover:scale-[1.02]"
              onClick={handleLogin}
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="h-6 w-6" alt="Google" />
              Masuk dengan Google
            </Button>
            <div className="mt-8 pt-6 border-t border-slate-50">
              <Button variant="link" className="text-slate-400 text-xs hover:text-primary" asChild>
                <Link href="/">Kembali ke Website Utama</Link>
              </Button>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">EduVista SMP • Secured Access</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50/50">
        <Sidebar className="border-r border-slate-200 shadow-sm">
          <SidebarHeader className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-xl">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-sm tracking-tight text-primary uppercase">Admin Panel</span>
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">EduVista Dashboard</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-3">
            <SidebarMenu>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.href}
                    className={cn(
                      "py-6 px-4 rounded-xl transition-all duration-200 mb-1",
                      pathname === item.href 
                        ? "bg-primary text-white hover:bg-primary shadow-md" 
                        : "hover:bg-slate-100 text-slate-600"
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-secondary" : "")} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-slate-100 space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-slate-500 hover:text-destructive hover:bg-destructive/5" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Keluar Sesi
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 text-slate-500 hover:text-primary hover:bg-primary/5" asChild>
              <Link href="/">
                <Globe className="h-4 w-4" />
                Website Utama
              </Link>
            </Button>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-col">
          <header className="h-16 border-b bg-white/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="h-4 w-px bg-slate-200" />
              <div className="text-xs font-medium text-slate-400 flex items-center gap-2">
                Menu <ChevronRight className="h-3 w-3" /> {pathname === '/admin' ? 'Dashboard' : pathname.split('/').pop()?.replace('-', ' ')}
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="hidden md:flex flex-col items-end">
                  <span className="text-xs font-bold text-slate-700">{user.displayName || "Administrator"}</span>
                  <span className="text-[10px] text-green-500 font-bold flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> Sesi Aktif
                  </span>
               </div>
               <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                 {user.photoURL ? (
                   <img src={user.photoURL} alt="Avatar" className="h-full w-full object-cover" />
                 ) : (
                   <span className="font-bold text-primary">AD</span>
                 )}
               </div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto bg-slate-50/30">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
