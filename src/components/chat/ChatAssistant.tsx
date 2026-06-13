
"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Send, X, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { visitorChatAssistant } from "@/ai/flows/visitor-chat-assistant-flow";
import { usePathname } from "next/navigation";

type Message = {
  role: "bot" | "user";
  text: string;
};

export function ChatAssistant() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");

  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Halo! Saya asisten virtual GN Nusantara. Ada yang bisa saya bantu terkait informasi sekolah atau PPDB?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const result = await visitorChatAssistant({ question: userMsg });
      setMessages((prev) => [...prev, { role: "bot", text: result.answer }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "bot", text: "Maaf, terjadi kesalahan. Silakan coba lagi." }]);
    } finally {
      setLoading(false);
    }
  };

  if (isAdminPage || !mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      {isOpen && (
        <Card className="w-[350px] md:w-[400px] h-[500px] shadow-2xl glass animate-in slide-in-from-bottom duration-300">
          <CardHeader className="bg-primary text-white py-4 rounded-t-lg">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-secondary" />
                <span>GN Nusantara Assistant</span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex flex-col h-[calc(500px-116px)]">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.role === "user" 
                        ? "bg-primary text-white rounded-br-none" 
                        : "bg-muted text-foreground rounded-bl-none border border-border"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-muted p-3 rounded-2xl text-sm rounded-bl-none animate-pulse">
                      Mengetik...
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-3 border-t">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex w-full gap-2">
              <Input
                placeholder="Tanyakan sesuatu..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="rounded-full bg-muted border-none"
              />
              <Button size="icon" className="rounded-full bg-primary" disabled={loading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}

      <Button
        size="lg"
        className="h-14 w-14 rounded-full shadow-2xl bg-secondary text-primary hover:bg-secondary/90 transition-transform hover:scale-110"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>
    </div>
  );
}
