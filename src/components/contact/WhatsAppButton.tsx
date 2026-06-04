
"use client";

import React, { useMemo } from "react";
import { Instagram } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";
import { cn } from "@/lib/utils";

export function WhatsAppButton() {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");

  const db = useFirestore();
  const currentSchoolId = 'smpn5-langke-rembong';
  const settingsRef = useMemo(() => db ? doc(db, "schools", currentSchoolId) : null, [db]);
  const { data: settings } = useDoc(settingsRef);

  if (isAdminPage) return null;

  const whatsappNumber = settings?.whatsappNumber || "628123456789"; 
  const instagramUrl = settings?.instagramUrl;
  const tiktokUrl = settings?.tiktokUrl;
  const schoolName = settings?.schoolName || "Sekolah";
  
  const message = `Halo ${schoolName}, saya ingin bertanya mengenai...`;
  const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  const socialActions = [
    {
      id: "tiktok",
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.525.02c1.31-.032 2.612-.012 3.914-.022.072 1.51.523 2.973 1.353 4.24 1.096 1.597 2.647 2.766 4.445 3.32v4.015c-1.352-.142-2.65-.584-3.793-1.32-.977-.63-1.808-1.46-2.44-2.435v7.26c-.035 1.513-.423 2.99-1.127 4.305-.71 1.32-1.742 2.44-2.99 3.253-1.25.815-2.7 1.255-4.204 1.277-1.503.023-3.003-.393-4.305-1.112-1.3-.72-2.42-1.75-3.235-2.997-.813-1.25-1.252-2.7-1.272-4.204-.02-1.503.402-3.002 1.123-4.305.72-1.3 1.75-2.41 2.997-3.226 1.25-.814 2.7-1.253 4.204-1.273a7.435 7.435 0 0 1 3.013.385v4.067c-.822-.267-1.696-.328-2.54-.18-.843.147-1.637.525-2.296 1.09-.658.566-1.162 1.305-1.457 2.13-.295.827-.373 1.714-.226 2.585.147.872.536 1.688 1.123 2.356.586.67 1.34 1.154 2.176 1.398.835.244 1.725.26 2.57.043.844-.217 1.615-.658 2.228-1.272.613-.614 1.04-1.39 1.233-2.238.192-.85.158-1.734-.1-2.57V.02h.001z"/>
        </svg>
      ),
      url: tiktokUrl,
      color: "bg-black text-white hover:bg-slate-800",
      label: "TikTok"
    },
    {
      id: "instagram",
      icon: <Instagram className="h-6 w-6" />,
      url: instagramUrl,
      color: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white hover:opacity-90",
      label: "Instagram"
    },
    {
      id: "whatsapp",
      icon: (
        <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.674 1.436 5.66 1.438h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      ),
      url: waUrl,
      color: "bg-[#25D366] text-white hover:bg-[#128C7E]",
      label: "WhatsApp"
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      {socialActions.map((action) => {
        if (!action.url || action.url === "#") return null;
        
        return (
          <Button
            key={action.id}
            size="lg"
            className={cn(
              "h-14 w-14 rounded-full shadow-2xl transition-all hover:scale-110 flex items-center justify-center p-0",
              action.color,
              action.id === "whatsapp" ? "order-last h-16 w-16" : "order-first"
            )}
            onClick={() => window.open(action.url, "_blank")}
            title={action.label}
          >
            {action.icon}
          </Button>
        );
      })}
    </div>
  );
}
