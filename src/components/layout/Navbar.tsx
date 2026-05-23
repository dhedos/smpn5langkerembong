
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

  const db = useFirestore();
  const settingsRef = useMemo(() => db ? doc(db, "settings", "general") : null, [db]);
  const { data: settings } = useDoc(settingsRef);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const schoolName = settings?.schoolName || "SMP NEGERI 5 LANGKE REMBONG";
  const schoolLogo = settings?.schoolLogoUrl;

  // Jika di halaman admin, navbar publik tidak ditampilkan
  if (isAdminPage) return null;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 py-2",
        "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-xl">
            {schoolLogo ? (
              <div className="relative h-6 w-6">
                <Image src={schoolLogo} alt="Logo" fill className="object-contain invert" />
              </div>
            ) : (
              <GraduationCap className="h-6 w-6 text-white" />
            )}
          </div>
          <span className="font-headline font-bold text-lg md:text-xl tracking-tighter text-primary uppercase">
            {schoolName.split(" ").map((word, i) => (
              <span key={i} className={word.toUpperCase() === "NEGERI" || i === 1 ? "text-secondary" : ""}>
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
                    "flex items-center gap-1 text-sm font-semibold transition-colors outline-none",
                    pathname.startsWith(item.href) && item.href !== "/" ? "text-secondary" : "text-slate-600 hover:text-secondary"
                  )}>
                    {item.name} <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-white border-none shadow-xl rounded-xl">
                    {item.submenu.map((sub) => (
                      <DropdownMenuItem key={sub.name} asChild>
                        <Link href={sub.href} className="w-full cursor-pointer hover:bg-slate-50 font-medium">
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
                    "text-sm font-semibold transition-colors",
                    pathname === item.href ? "text-secondary" : "text-slate-600 hover:text-secondary"
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
              <Button variant="ghost" size="sm" className="text-slate-600 font-semibold hover:text-primary">
                <LogIn className="h-4 w-4 mr-2" /> Admin
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl shadow-xl border-none">
              <DropdownMenuItem asChild>
                <Link href="/admin" className="cursor-pointer">
                  <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/settings" className="cursor-pointer">
                  <Settings className="h-4 w-4 mr-2" /> Pengaturan
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" className="bg-primary text-white hover:bg-primary/90 rounded-full px-6 font-bold shadow-lg shadow-primary/20" asChild>
            <Link href="/ppdb">Daftar Sekarang</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white animate-in slide-in-from-top duration-300 border-t border-slate-100 shadow-2xl">
          <nav className="flex flex-col p-6 gap-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-lg font-bold p-2 rounded-xl",
                  pathname === item.href ? "bg-primary/5 text-secondary" : "text-slate-600"
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-100">
              <Button variant="outline" asChild onClick={() => setIsOpen(false)} className="rounded-xl">
                <Link href="/admin">Admin Login</Link>
              </Button>
              <Button className="bg-primary text-white rounded-xl" asChild onClick={() => setIsOpen(false)}>
                <Link href="/ppdb">PPDB Online</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
