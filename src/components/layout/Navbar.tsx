"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
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
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  const db = useFirestore();
  const currentSchoolId = 'smpn5-langke-rembong';
  const settingsRef = useMemo(() => db ? doc(db, "schools", currentSchoolId) : null, [db, currentSchoolId]);
  const { data: settings } = useDoc(settingsRef);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Hydration-safe dynamic values
  const schoolName = mounted ? (settings?.schoolName || "") : "";
  const schoolLogo = mounted ? settings?.schoolLogoUrl : null;
  const isSpmbActive = mounted ? (settings?.ppdbIsActive !== false) : false;
  const spmbLabel = mounted ? (settings?.ppdbMenuTitle || "SPMB ONLINE") : "";
  const isHome = pathname === "/";

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
    if (isSpmbActive) items.push({ name: "SPMB", href: "/ppdb" });
    return items;
  }, [isSpmbActive]);

  if (isAdminPage) return null;

  const isSolid = scrolled || !isHome;

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-[60] transition-all duration-300", 
        isSolid ? "bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm" : "bg-transparent py-6"
      )}>
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 shrink-0 max-w-[75%]">
            <div className="relative h-10 w-10 md:h-12 md:w-12 flex items-center justify-center">
              {mounted && schoolLogo && (
                schoolLogo.startsWith('data:') ? (
                  <img src={schoolLogo} alt="Logo" className="h-full w-full object-contain" />
                ) : (
                  <Image 
                    src={schoolLogo} 
                    alt="Logo" 
                    fill 
                    className="object-contain" 
                    priority 
                  />
                )
              )}
            </div>
            {mounted && (
              <span className={cn(
                "font-headline font-bold text-xs md:text-sm lg:text-lg tracking-tight transition-colors duration-300 line-clamp-2 leading-tight", 
                isSolid ? "text-slate-900" : "text-white drop-shadow-md"
              )}>
                {schoolName}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                {item.submenu ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className={cn(
                      "flex items-center gap-1.5 text-[11px] xl:text-xs font-bold transition-all outline-none uppercase tracking-widest", 
                      isSolid ? "text-slate-700 hover:text-primary" : "text-white hover:text-secondary drop-shadow-sm"
                    )}>
                      {item.name} <ChevronDown className="h-3 w-3 opacity-50 group-hover:rotate-180 transition-transform" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="bg-white border-slate-200 shadow-xl rounded-xl p-2 min-w-[180px] mt-2">
                      {item.submenu.map((sub) => (
                        <DropdownMenuItem key={sub.name} asChild>
                          <Link href={sub.href} className="w-full cursor-pointer hover:bg-slate-50 rounded-lg px-4 py-2 text-xs font-bold text-slate-700">{sub.name}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link href={item.href} className={cn(
                    "text-[11px] xl:text-xs font-bold transition-all uppercase tracking-widest relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:bg-secondary after:transition-all after:duration-300", 
                    isSolid ? (pathname === item.href ? "text-primary after:w-full" : "text-slate-700 hover:text-primary after:w-0 hover:after:w-full") : "text-white hover:text-secondary drop-shadow-sm after:w-0 hover:after:w-full"
                  )}>
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {isSpmbActive && (
              <Button size="sm" className={cn(
                "hidden md:flex rounded-full px-6 font-bold shadow-md transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-[10px] h-10 border-none", 
                isSolid ? "bg-primary text-white" : "bg-secondary text-primary hover:bg-secondary/90 shadow-secondary/20"
              )} asChild>
                <Link href="/ppdb">{spmbLabel}</Link>
              </Button>
            )}

            <button 
              className={cn(
                "lg:hidden p-2.5 rounded-xl transition-all shadow-sm shrink-0 border", 
                isSolid ? "bg-slate-50 text-primary border-slate-200" : "bg-white/10 text-white border-white/20 backdrop-blur-sm"
              )} 
              onClick={() => setIsOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar - Solid background for better readability at page bottom */}
      {mounted && (
        <div className={cn(
          "fixed inset-0 z-[100] transition-all duration-500 pointer-events-none lg:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0"
        )}>
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md" 
            onClick={() => setIsOpen(false)} 
          />
          <div className={cn(
            "absolute inset-y-0 right-0 w-[85%] bg-white shadow-2xl transition-transform duration-500 ease-in-out transform flex flex-col", 
            isOpen ? "translate-x-0" : "translate-x-full"
          )}>
            <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10">
                  {schoolLogo && (
                    schoolLogo.startsWith('data:') ? (
                      <img src={schoolLogo} alt="Logo" className="h-full w-full object-contain" />
                    ) : (
                      <Image src={schoolLogo} alt="Logo" fill className="object-contain" />
                    )
                  )}
                </div>
                <span className="font-headline font-bold text-primary text-[10px] uppercase leading-tight truncate max-w-[150px]">
                  {schoolName}
                </span>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2.5 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col p-6 gap-2 flex-1 overflow-y-auto">
              {navItems.map((item) => (
                <div key={item.name} className="flex flex-col gap-1">
                  <Link 
                    href={item.href} 
                    className={cn(
                      "text-base font-bold p-4 rounded-xl transition-all", 
                      pathname === item.href ? "text-primary bg-primary/5" : "text-slate-600 hover:bg-slate-50"
                    )} 
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.submenu && (
                    <div className="ml-8 flex flex-col gap-1 border-l-2 border-slate-100 pl-4 mb-4">
                      {item.submenu.map((sub) => (
                        <Link 
                          key={sub.name} 
                          href={sub.href} 
                          className="p-3 text-sm font-bold text-slate-500 hover:text-primary transition-colors" 
                          onClick={() => setIsOpen(false)}
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
                  <Button size="lg" className="w-full bg-primary h-14 text-white rounded-xl font-bold border-none" asChild>
                    <Link href="/ppdb" onClick={() => setIsOpen(false)}>{spmbLabel}</Link>
                  </Button>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}