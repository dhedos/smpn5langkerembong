
"use client";

import React, { useMemo, useState } from "react";
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
  Lock,
  Sparkles,
  ExternalLink,
  Database,
  Terminal,
  HelpCircle,
  Bell,
  AlertCircle,
  Mail,
  KeyRound,
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
import { useUser, useAuth, useFirestore, useDoc } from "@/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";

const adminMenuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Manajemen Berita", href: "/admin/berita", icon: Newspaper },
  { name: "Manajemen Fasilitas", href: "/admin/fasilitas", icon: Building2 },
  { name: "Manajemen Galeri", href: "/admin/galeri", icon: Camera },
  { name: "Pengaturan Situs", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading: authLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const adminRef = useMemo(() => {
    return (db && user?.email) ? doc(db, "admins", user.email) : null;
  }, [db, user?.email]);

  const { data: adminData, loading: dbLoading } = useDoc(adminRef);

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
        description: "Selamat datang di Cloud Console.",
      });
    } catch (error: any) {
      console.error("Login failed", error);
      let message = "Terjadi kesalahan saat mencoba login.";
      
      // Handle Firebase specific errors
      if (error.code === 'auth/invalid-credential') {
        message = "Email/Password salah atau metode login belum diaktifkan di Firebase.";
      } else if (error.code === 'auth/user-not-found') {
        message = "Pengguna tidak ditemukan. Silakan buat akun di Firebase Console.";
      } else if (error.code === 'auth/wrong-password') {
        message = "Kata sandi yang Anda masukkan salah.";
      } else if (error.code === 'auth/too-many-requests') {
        message = "Terlalu banyak percobaan login. Silakan coba lagi nanti.";
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

  if (authLoading || (user && dbLoading)) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#1a1a1a]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="h-16 w-16 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
            <Database className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-white" />
          </div>
          <p className="text-sm font-bold text-white/50 animate-pulse uppercase tracking-widest">Memeriksa Autentikasi...</p>
        </div>
      </div>
    );
  }

  // Login Screen
  if (!user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#1a1a1a] px-4">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-[#252525] rounded-[2rem] overflow-hidden shadow-2xl border border-white/5">
          <div className="p-8 md:p-12 flex flex-col justify-center space-y-8">
            <div className="bg-primary w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Lock className="h-7 w-7 text-white" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold font-headline text-white tracking-tight">Cloud Console</h1>
              <p className="text-white/60 text-sm leading-relaxed">
                Masuk ke panel manajemen SMPN 5 Langke Rembong dengan akun resmi Anda.
              </p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/70 text-xs font-bold uppercase tracking-wider">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <Input 
                    type="email"
                    placeholder="admin@sekolah.sch.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/10 text-white pl-10 h-12 rounded-xl focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-white/70 text-xs font-bold uppercase tracking-wider">Password</Label>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <Input 
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border-white/10 text-white pl-10 pr-10 h-12 rounded-xl focus:ring-primary focus:border-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button 
                type="submit"
                size="lg" 
                className="w-full bg-white text-black hover:bg-slate-200 py-6 rounded-xl gap-3 text-base font-bold transition-all hover:scale-[1.02]"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Sign In <ArrowRight className="h-4 w-4" /></>
                )}
              </Button>
            </form>

            <Link href="/" className="text-white/40 text-xs hover:text-white text-center flex items-center justify-center gap-2 pt-4">
              <Globe className="h-3 w-3" /> Kembali ke Website Publik
            </Link>
          </div>
          <div className="hidden md:block bg-gradient-to-br from-primary to-[#0d1117] relative p-12 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="relative z-10 h-full flex flex-col justify-end">
               <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="h-2 w-12 bg-secondary rounded-full" />
                    <div className="h-2 w-4 bg-white/20 rounded-full" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Manajemen Database Sekolah</h2>
                  <p className="text-white/70 text-sm">Kelola berita, fasilitas, dan pendaftaran siswa baru secara real-time dengan integrasi Firebase Cloud.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not Authorized Screen
  if (user && !adminData) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#121212] px-4">
        <div className="max-w-5xl w-full bg-[#1e1e1e] rounded-[2.5rem] p-12 md:p-20 relative overflow-hidden border border-white/5 shadow-3xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-l from-secondary/20 to-transparent rounded-full translate-x-1/3 -translate-y-1/3 blur-[100px]" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-red-500/20">
                  <AlertCircle className="h-4 w-4" /> Akses Ditolak
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-white font-headline tracking-tighter">Izin Diperlukan</h1>
                <p className="text-xl text-white/60 leading-relaxed max-w-md">
                  Akun <span className="text-white font-bold">{user.email}</span> tidak terdaftar dalam whitelist admin kami.
                </p>
              </div>
              
              <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10">
                <p className="text-sm text-white/80 font-bold mb-2">Langkah Aktivasi Manual:</p>
                <ol className="text-xs text-white/50 space-y-2 list-decimal list-inside">
                  <li>Buka Firebase Console Proyek Anda.</li>
                  <li>Masuk ke menu <span className="text-secondary">Firestore Database</span>.</li>
                  <li>Buat koleksi bernama <code className="bg-white/10 px-1 rounded text-white">admins</code>.</li>
                  <li>Tambah dokumen dengan ID: <code className="bg-white/10 px-1 rounded text-white">{user.email}</code>.</li>
                  <li>Tambahkan field <code className="text-white">role</code>: <code className="text-secondary">superadmin</code>.</li>
                </ol>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-black hover:bg-slate-200 px-8 py-7 rounded-full font-bold text-lg"
                  onClick={() => window.location.reload()}
                >
                   Refresh Halaman
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white/20 text-white hover:bg-white/10 px-8 py-7 rounded-full font-bold text-lg gap-2"
                  onClick={handleLogout}
                >
                  Keluar / Ganti Akun
                </Button>
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <div className="absolute inset-0 bg-gradient-to-tr from-red-600 to-orange-400 rounded-full shadow-[0_0_100px_rgba(239,68,68,0.3)] animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <ShieldCheck className="h-32 w-32 text-white/20" />
                </div>
              </div>
            </div>
          </div>
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
              <div className="bg-[#1a73e8] p-2 rounded-xl shadow-lg shadow-blue-500/20">
                <Database className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-sm tracking-tight text-slate-900 uppercase">Cloud Console</span>
                <span className="text-[10px] text-blue-500 font-extrabold uppercase tracking-tighter">SMPN 5 L.R.website</span>
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
                        ? "bg-[#e8f0fe] text-[#1a73e8] hover:bg-[#e8f0fe] shadow-none" 
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
          <SidebarFooter className="p-4 border-t border-slate-50 space-y-1">
             <div className="px-4 py-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Service Status</div>
                <div className="flex items-center gap-2">
                   <div className="h-2 w-2 rounded-full bg-green-500" />
                   <span className="text-[10px] font-bold text-slate-600">Firestore Active</span>
                </div>
             </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-col">
          <header className="h-16 border-b bg-white/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="h-4 w-px bg-slate-200" />
              <div className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-tighter">
                Project <ChevronRight className="h-3 w-3" /> {pathname === '/admin' ? 'Dashboard' : pathname.split('/').pop()?.replace('-', ' ')}
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex gap-1 mr-4">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary"><Bell className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary"><Terminal className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary"><HelpCircle className="h-4 w-4" /></Button>
               </div>
               <div className="h-10 w-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                 {user.photoURL ? (
                   <img src={user.photoURL} alt="Avatar" className="h-full w-full object-cover" />
                 ) : (
                   <div className="h-full w-full flex items-center justify-center bg-primary text-white font-bold text-xs">
                     {user.email?.substring(0, 2).toUpperCase()}
                   </div>
                 )}
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
