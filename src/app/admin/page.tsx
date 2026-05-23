
"use client";

import React from "react";
import { 
  Users, 
  Newspaper, 
  FileText, 
  TrendingUp, 
  Eye, 
  ArrowUpRight, 
  LayoutDashboard,
  Settings,
  Bell
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const stats = [
  { title: "Total Pengunjung", value: "12,450", change: "+12.5%", icon: Eye, color: "bg-blue-500" },
  { title: "Pendaftar PPDB", value: "482", change: "+5.2%", icon: Users, color: "bg-green-500" },
  { title: "Berita Aktif", value: "128", change: "+2.4%", icon: Newspaper, color: "bg-purple-500" },
  { title: "File Download", value: "3,200", change: "+8.1%", icon: FileText, color: "bg-orange-500" },
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
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function AdminDashboard() {
  return (
    <div className="pt-24 pb-24 container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-2">
            <LayoutDashboard className="h-8 w-8 text-secondary" /> Dashboard Admin
          </h1>
          <p className="text-muted-foreground">Selamat datang kembali, Administrator.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Settings className="h-5 w-5" />
          </Button>
          <Button className="bg-primary">Laporan Utama</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-none shadow-lg overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-5 rounded-full -translate-y-12 translate-x-12`} />
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color.split('-')[1]}-600`} />
                </div>
                <div className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stat.change} <ArrowUpRight className="h-3 w-3 ml-1" />
                </div>
              </div>
              <div className="text-sm text-muted-foreground font-medium">{stat.title}</div>
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Visitor Chart */}
        <Card className="lg:col-span-2 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Statistik Pengunjung Mingguan</CardTitle>
            <CardDescription>Visualisasi trafik website 7 hari terakhir.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={visitorData}>
                    <defs>
                      <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area 
                      type="monotone" 
                      dataKey="visitors" 
                      stroke="hsl(var(--primary))" 
                      fillOpacity={1} 
                      fill="url(#colorVis)" 
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Aktivitas Terakhir</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { time: "2 menit lalu", event: "Pendaftaran PPDB Baru", user: "Rian Kurniawan" },
              { time: "15 menit lalu", event: "Update Berita Sekolah", user: "Admin Sari" },
              { time: "1 jam lalu", event: "Upload File Modul", user: "Admin Budi" },
              { time: "3 jam lalu", event: "Pendaftaran PPDB Baru", user: "Anisa Putri" },
              { time: "5 jam lalu", event: "Login Sukses", user: "Admin Utama" },
            ].map((act, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div>
                  <div className="text-sm font-bold text-primary">{act.event}</div>
                  <div className="text-xs text-muted-foreground">{act.user} • {act.time}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
