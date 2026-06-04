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

const navItems = [
  { name: "Home", href: "/" },
  { 
    name: "Profil", 
    href: "/profil",
    submenu: [
      { name: "Sejarah", href: "/profil#sejarah" },
      { name: "Visi Misi", href: "/profil#visi-misi" },
      { name: "Fasilitas", href: "/profil#fasilitas" },
    ]
  },
  { name: "Berita", href: "/berita" },
  { name: "Galeri", href: "/galeri" },
  { name: "SPMB", href: "/ppdb" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  const isHome = pathname === "/";

  const db = useFirestore();
  const settingsRef = useMemo(() => db ? doc(db, "settings", "general") : null, [db]);
  const { data: settings } = useDoc(settingsRef);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const schoolName = settings?.schoolName || "SMPN 5 Langke Rembong";
  const schoolLogo = settings?.schoolLogoUrl;

  if (isAdminPage) return null;

  const isSolid = scrolled || !isHome;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isSolid 
          ? "bg-white/80 backdrop-blur-xl border-b border-slate-200 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.03)]" 
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
              <GraduationCap className={cn("h-7 w-7", isSolid ? "text-white" : "text-white")} />
            )}
          </div>
          <span className={cn(
            "font-headline font-bold text-lg md:text-xl tracking-tighter uppercase transition-colors duration-500",
            isSolid ? "text-slate-900" : "text-white drop-shadow-md"
          )}>
            {schoolName.split(" ").map((word, i) => (
              <span key={i} className={cn(
                (word.toUpperCase() === "NEGERI" || word === "5") ? "text-secondary" : ""
              )}>
                {word}{" "}
              </span>
            ))}
          </span>
        </Link>

        {/* Desktop Nav */}
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
                  <DropdownMenuContent align="start" className="bg-white/95 backdrop-blur-md border-slate-200 shadow-2xl rounded-2xl p-2 min-w-[200px] mt-2">
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
          <Button size="lg" className={cn(
            "rounded-full px-8 font-bold shadow-xl transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-xs",
            isSolid ? "bg-primary text-white" : "bg-secondary text-primary hover:bg-secondary/90 shadow-secondary/20"
          )} asChild>
            <Link href="/ppdb">Pendaftaran Online</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className={cn("lg:hidden p-2.5 rounded-xl transition-colors", isSolid ? "bg-slate-100 text-primary" : "bg-white/10 text-white backdrop-blur-md")}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-white animate-in fade-in slide-in-from-bottom duration-500">
          <div className="flex justify-end p-8">
             <button onClick={() => setIsOpen(false)} className="p-2.5 bg-slate-100 rounded-full text-slate-600"><X className="h-6 w-6" /></button>
          </div>
          <nav className="flex flex-col px-8 gap-6 pt-10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-3xl font-bold p-4 rounded-2xl transition-all",
                  pathname === item.href ? "text-primary translate-x-4" : "text-slate-400 hover:text-slate-900"
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-12 border-t border-slate-100 mt-auto pb-20">
              <Button size="lg" className="w-full bg-primary h-16 text-white rounded-[2rem] font-bold text-lg" asChild onClick={() => setIsOpen(false)}>
                <Link href="/ppdb">Daftar SPMB Online</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
