"use client";

import React from "react";
import { 
  Users, 
  Newspaper, 
  Eye, 
  ArrowUpRight, 
  Database,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import { cn } from "@/lib/utils";

const stats = [
  { title: "Kunjungan Situs", value: "12,450", change: "+12.5%", icon: Eye, color: "bg-blue-500" },
  { title: "Registrasi SPMB", value: "482", change: "+5.2%", icon: Users, color: "bg-green-500" },
  { title: "Informasi Publik", value: "128", change: "+2.4%", icon: Newspaper, color: "bg-purple-500" },
  { title: "Total Dokumen", value: "3,200", change: "+8.1%", icon: Database, color: "bg-orange-500" },
];

const visitorData = [
  { day: "Sen", visitors: 450 },
  { day: "Sel", visitors: 520 },
  { day: "Rab", visitors: 480 },
  { day: "Kam", visitors: 610 },
  { day: "Jum", visitors: 580 },
  { day: "Sab", visitors: 400 },
  { day: "Min", visitors: 350 },
];

const chartConfig = {
  visitors: {
    label: "Pengunjung",
    color: "#1a73e8",
  },
} satisfies ChartConfig;

export default function AdminDashboard() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="bg-[#1a1a1a] rounded-xl p-10 md:p-14 relative overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-l from-primary/20 to-transparent rounded-full translate-x-1/4 -translate-y-1/4 blur-[80px]" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
          <div className="space-y-6 max-w-xl text-center md:text-left">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold text-white font-headline tracking-tighter leading-tight">Selamat Datang di GN Nusantara</h1>
              <p className="text-lg text-white/50 leading-relaxed font-medium">
                Pusat kendali operasional digital GN Nusantara secara global. Kelola data sekolah, informasi terbaru, dan registrasi SPMB dalam satu ekosistem cloud yang aman.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-slate-200 px-8 py-6 rounded-full font-bold shadow-xl"
                asChild
              >
                <a href="/admin/berita">Kelola Informasi</a>
              </Button>
            </div>
          </div>
          
          <div className="hidden lg:flex relative">
             <div className="w-64 h-64 bg-gradient-to-tr from-orange-500/20 to-yellow-400/20 rounded-full border border-white/10 flex items-center justify-center animate-pulse">
                <Database className="h-32 w-32 text-secondary/40" />
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border shadow-sm hover:shadow-md transition-all rounded-xl bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color.split('-')[1]}-600`} />
                </div>
                <div className="flex items-center text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                  {stat.change} <ArrowUpRight className="h-3 w-3 ml-1" />
                </div>
              </div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">{stat.title}</div>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border shadow-sm rounded-xl bg-white">
          <CardHeader className="p-8">
            <CardTitle className="text-xl flex items-center justify-between">
              Statistik Kunjungan
              <Button variant="ghost" size="sm" className="text-[#1a73e8] hover:bg-blue-50">View Details <ExternalLink className="ml-2 h-4 w-4" /></Button>
            </CardTitle>
            <CardDescription>Grafik aktivitas website dalam 7 hari terakhir.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="h-[300px] w-full">
              <ChartContainer config={chartConfig}>
                <AreaChart data={visitorData}>
                  <defs>
                    <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1a73e8" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#1a73e8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94a3b8'}} />
                  <YAxis hide />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="visitors" 
                    stroke="#1a73e8" 
                    fillOpacity={1} 
                    fill="url(#colorVis)" 
                    strokeWidth={4}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm rounded-xl bg-white">
          <CardHeader className="p-8">
            <CardTitle className="text-xl">Log Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-8">
            {[
              { time: "2m lalu", event: "Pendaftaran SPMB", user: "Rian K.", status: "Success" },
              { time: "15m lalu", event: "Update Informasi", user: "Admin S.", status: "Warning" },
              { time: "1j lalu", event: "Upload Galeri", user: "Admin B.", status: "Success" },
              { time: "3j lalu", event: "Update Pengaturan", user: "Anisa P.", status: "Info" },
            ].map((act, i) => (
              <div key={i} className="flex gap-4 items-start group">
                <div className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-50 transition-all group-hover:scale-110",
                  act.status === 'Success' ? "bg-green-50" : act.status === 'Warning' ? "bg-orange-50" : "bg-blue-50"
                )}>
                  <div className={cn(
                    "h-2 w-2 rounded-full",
                    act.status === 'Success' ? "bg-green-500" : act.status === 'Warning' ? "bg-orange-500" : "bg-blue-500"
                  )} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-slate-800">{act.event}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{act.user} • {act.time}</div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}