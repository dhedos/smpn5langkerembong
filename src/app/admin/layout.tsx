
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
  Camera
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

const adminMenuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Manajemen Berita", href: "/admin/berita", icon: Newspaper },
  { name: "Manajemen Fasilitas", href: "/admin/fasilitas", icon: Building2 },
  { name: "Manajemen Galeri", href: "/admin/galeri", icon: Camera },
  { name: "Pengaturan Situs", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50/50">
        <Sidebar className="border-r border-slate-200 shadow-sm">
          <SidebarHeader className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-xl">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight text-primary">ADMIN PANEL</span>
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">EduVista SMP</span>
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
          <SidebarFooter className="p-4 border-t border-slate-100">
            <Button variant="ghost" className="w-full justify-start gap-3 text-slate-500 hover:text-destructive hover:bg-destructive/5" asChild>
              <Link href="/">
                <Globe className="h-4 w-4" />
                Kembali ke Website
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
                Pages <ChevronRight className="h-3 w-3" /> {pathname === '/admin' ? 'Dashboard' : pathname.split('/').pop()?.replace('-', ' ')}
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="hidden md:flex flex-col items-end">
                  <span className="text-xs font-bold text-slate-700">Administrator</span>
                  <span className="text-[10px] text-green-500 font-bold flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> Online
                  </span>
               </div>
               <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-primary">
                 AD
               </div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
