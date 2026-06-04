
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, GraduationCap, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  const isHome = pathname === "/";

  const db = useFirestore();
  const currentSchoolId = 'smpn5-langke-rembong';
  const settingsRef = useMemo(() => db ? doc(db, "schools", currentSchoolId) : null, [db]);
  const { data: settings } = useDoc(settingsRef);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const schoolName = settings?.schoolName || "GN Nusantara";
  const schoolLogo = settings?.schoolLogoUrl;
  const isSpmbActive = settings?.ppdbIsActive === true;
  const spmbLabel = settings?.ppdbMenuTitle || "SPMB ONLINE";

  const navItems = useMemo(() => {
    const items = [
      { name: "Beranda", href: "/" },
      { 
        name: "Profil", 
        href: "/profil",
        submenu: [
          { name: "Sejarah", href: "/profil#sejarah" },
          { name: "Visi Misi", href: "/profil#visi-misi" },
          { name: "Fasilitas", href: "/profil#fasilitas" },
        ]
      },
      { name: "Informasi", href: "/informasi" },
      { name: "Eskul", href: "/ekstrakurikuler" },
      { name: "Galeri", href: "/galeri" },
    ];
    
    if (isSpmbActive) {
      items.push({ name: "SPMB", href: "/ppdb" });
    }
    
    return items;
  }, [isSpmbActive]);

  if (isAdminPage) return null;

  const isSolid = scrolled || !isHome;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[60] transition-all duration-500",
        isSolid 
          ? "bg-white border-b border-slate-200 py-3 shadow-md" 
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12">
        <Link href="/" className="flex items-center gap-3 group">
          <div className={cn(
            "p-2 rounded-2xl transition-all duration-500 shadow-md transform group-hover:scale-110",
            isSolid ? "bg-primary" : "bg-white/20 backdrop-blur-md"
          )}>
            {schoolLogo ? (
              <div className="relative h-7 w-7">
                <Image src={schoolLogo} alt="Logo" fill className="object-contain" />
              </div>
            ) : (
              <GraduationCap className={cn("h-7 w-7 text-white")} />
            )}
          </div>
          <span className={cn(
            "font-headline font-bold text-lg md:text-xl tracking-tighter uppercase transition-colors duration-500",
            isSolid ? "text-slate-900" : "text-white drop-shadow-md"
          )}>
            {schoolName}
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          {navItems.map((item) => (
            <div key={item.name} className="relative group">
              {item.submenu ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className={cn(
                    "flex items-center gap-1.5 text-sm font-bold transition-all outline-none uppercase tracking-wider",
                    isSolid 
                      ? (pathname.startsWith(item.href) && item.href !== "/" ? "text-secondary" : "text-slate-700 hover:text-secondary")
                      : "text-white hover:text-secondary drop-shadow-sm"
                  )}>
                    {item.name} <ChevronDown className="h-4 w-4 opacity-50 group-hover:rotate-180 transition-transform" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-white border-slate-200 shadow-2xl rounded-2xl p-2 min-w-[200px] mt-2">
                    {item.submenu.map((sub) => (
                      <DropdownMenuItem key={sub.name} asChild>
                        <Link href={sub.href} className="w-full cursor-pointer hover:bg-slate-100 rounded-xl px-4 py-2.5 font-bold text-slate-700 text-sm">
                          {sub.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "text-sm font-bold transition-all uppercase tracking-wider relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:bg-secondary after:transition-all after:duration-300",
                    isSolid 
                      ? (pathname === item.href ? "text-secondary after:w-full" : "text-slate-700 hover:text-secondary after:w-0 hover:after:w-full")
                      : "text-white hover:text-secondary drop-shadow-sm after:w-0 hover:after:w-full"
                  )}
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          {isSpmbActive && (
            <Button size="lg" className={cn(
              "rounded-full px-8 font-bold shadow-xl transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-xs",
              isSolid ? "bg-primary text-white" : "bg-secondary text-primary hover:bg-secondary/90 shadow-secondary/20"
            )} asChild>
              <Link href="/ppdb">{spmbLabel}</Link>
            </Button>
          )}
        </div>

        <button
          className={cn("lg:hidden p-2.5 rounded-xl transition-colors shadow-md", isSolid ? "bg-slate-100 text-primary" : "bg-white text-primary")}
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div 
        className={cn(
          "lg:hidden fixed top-0 right-0 h-screen w-[85%] z-[110] bg-white shadow-2xl transition-transform duration-500 ease-in-out transform flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2.5 rounded-2xl">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="font-headline font-bold text-primary text-sm">GN NUSANTARA</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="p-3 bg-slate-100 rounded-full text-slate-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="flex flex-col p-6 gap-2 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <div key={item.name} className="flex flex-col gap-1">
              <Link
                href={item.href}
                className={cn(
                  "text-lg font-bold p-4 rounded-2xl transition-all duration-300",
                  pathname === item.href 
                    ? "text-primary bg-primary/5" 
                    : "text-slate-600"
                )}
              >
                {item.name}
              </Link>
              {item.submenu && (
                <div className="ml-8 flex flex-col gap-1 border-l-2 border-slate-100 pl-4 mb-4">
                  {item.submenu.map((sub) => (
                    <Link 
                      key={sub.name} 
                      href={sub.href}
                      className="p-3 text-sm font-bold text-slate-500"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          <div className="mt-auto pt-8 border-t border-slate-100 pb-10">
            {isSpmbActive && (
              <Button size="lg" className="w-full bg-primary h-14 text-white rounded-2xl font-bold" asChild>
                <Link href="/ppdb">{spmbLabel}</Link>
              </Button>
            )}
            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-6">
              GN NUSANTARA GLOBAL
            </p>
          </div>
        </nav>
      </div>
    </header>
  );
}
