
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, GraduationCap, ChevronDown, LogIn, Settings, LayoutDashboard } from "lucide-react";
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
  { name: "PPDB", href: "/ppdb" },
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
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const schoolName = settings?.schoolName || "EduVista SMP";
  const schoolLogo = settings?.schoolLogoUrl;

  if (isAdminPage) return null;

  // Force scrolled state (solid bg, dark text) if not on home page
  const isSolid = scrolled || !isHome;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isSolid 
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200 py-3" 
          : "bg-transparent border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-2xl transition-all duration-300 shadow-md",
            isSolid ? "bg-primary scale-90" : "bg-white/20 backdrop-blur-md"
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
            "font-headline font-bold text-lg md:text-xl tracking-tighter uppercase transition-colors duration-300",
            isSolid ? "text-slate-900" : "text-white drop-shadow-md"
          )}>
            {schoolName.split(" ").map((word, i) => (
              <span key={i} className={cn(
                (word.toUpperCase() === "NEGERI" || i === 1) ? "text-secondary" : ""
              )}>
                {word}{" "}
              </span>
            ))}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <div key={item.name} className="relative group">
              {item.submenu ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className={cn(
                    "flex items-center gap-1 text-sm font-bold transition-all outline-none",
                    isSolid 
                      ? (pathname.startsWith(item.href) && item.href !== "/" ? "text-secondary" : "text-slate-700 hover:text-secondary")
                      : "text-white hover:text-secondary drop-shadow-sm"
                  )}>
                    {item.name} <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-white border-slate-200 shadow-2xl rounded-2xl p-2">
                    {item.submenu.map((sub) => (
                      <DropdownMenuItem key={sub.name} asChild>
                        <Link href={sub.href} className="w-full cursor-pointer hover:bg-slate-100 rounded-xl px-4 py-2 font-semibold text-slate-700">
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
                    "text-sm font-bold transition-all",
                    isSolid 
                      ? (pathname === item.href ? "text-secondary" : "text-slate-700 hover:text-secondary")
                      : "text-white hover:text-secondary drop-shadow-sm"
                  )}
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className={cn(
                "font-bold transition-colors",
                isSolid ? "text-slate-600 hover:text-primary" : "text-white hover:bg-white/10"
              )}>
                <LogIn className="h-4 w-4 mr-2" /> Admin
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl shadow-2xl border-slate-200 bg-white">
              <DropdownMenuItem asChild>
                <Link href="/admin" className="cursor-pointer font-semibold">
                  <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/settings" className="cursor-pointer font-semibold">
                  <Settings className="h-4 w-4 mr-2" /> Pengaturan
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" className={cn(
            "rounded-full px-8 font-bold shadow-xl transition-all hover:scale-105 active:scale-95",
            isSolid ? "bg-primary text-white" : "bg-secondary text-primary hover:bg-secondary/90"
          )} asChild>
            <Link href="/ppdb">Daftar Sekarang</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className={cn("md:hidden p-2 transition-colors", isSolid ? "text-primary" : "text-white")}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-4 right-4 bg-white animate-in slide-in-from-top duration-300 border border-slate-200 shadow-2xl rounded-3xl mt-2">
          <nav className="flex flex-col p-6 gap-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-lg font-bold p-3 rounded-2xl transition-colors",
                  pathname === item.href ? "bg-primary text-white" : "text-slate-700 hover:bg-slate-100"
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-100">
              <Button variant="outline" asChild onClick={() => setIsOpen(false)} className="rounded-2xl font-bold">
                <Link href="/admin">Admin Login</Link>
              </Button>
              <Button className="bg-primary text-white rounded-2xl font-bold" asChild onClick={() => setIsOpen(false)}>
                <Link href="/ppdb">PPDB Online</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
