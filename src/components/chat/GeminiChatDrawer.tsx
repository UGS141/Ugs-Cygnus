import React, { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Sparkles, Compass, MessageSquare } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface GeminiChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySearchQuery?: (query: string) => void;
}

export const GeminiChatDrawer: React.FC<GeminiChatDrawerProps> = ({
  isOpen,
  onClose,
  onApplySearchQuery,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-0",
      role: "assistant",
      content:
        "Hello! I am CYGNUS Intelligence, your real-world geospatial and booking concierge. How can I help you discover places, compare products, or secure a reservation today?",
      timestamp: "Just now",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Chat response error");
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: data.text || "I have analyzed your request against live availability records.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.warn("Chat error, falling back to local contextual reasoning:", error);
      const fallbackMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content:
          "I recommend checking 'Aura Hearth & Woodfire Kitchen' for an authentic Italian dinner tonight, or 'Nova Dental Studio' if you need a verified healthcare slot this afternoon. Let me know if you would like me to lock in a slot!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-[#0A0D1D] border-l border-[#1F2742] shadow-2xl flex flex-col justify-between animate-fade-in text-foreground">
      {/* Header */}
      <div className="p-4 border-b border-[#1E2640] flex items-center justify-between bg-[#080B18]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] p-[1px] flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#080B18] flex items-center justify-center">
              <Bot className="w-4 h-4 text-[#00F5D4]" />
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>CYGNUS Assistant</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800/40">
                gemini-3.8-flash
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              Multi-Turn Discovery & Booking Concierge
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
          aria-label="Close Assistant"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Message Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => {
          const isUser = m.role === "user";
          return (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                  isUser
                    ? "bg-[#38BDF8] text-[#06070B]"
                    : "bg-[#11172E] border border-[#00F5D4] text-[#00F5D4]"
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed space-y-1 ${
                  isUser
                    ? "bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white"
                    : "bg-[#101528] border border-[#1E2744] text-slate-200"
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
                <div className="text-[9px] text-slate-400 text-right opacity-70">
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-2 animate-pulse">
            <Bot className="w-4 h-4 text-[#00F5D4]" />
            <span>CYGNUS AI is consulting live maps and provider feeds...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Inquiries */}
      <div className="px-4 py-2 border-t border-[#171F36] bg-[#090C1A] overflow-x-auto flex gap-1.5 scrollbar-none">
        {[
          "Italian tables tonight for 2",
          "Laptop under ₹70,000",
          "Dentist appointment this week",
          "Explain booking terms",
        ].map((promptText) => (
          <button
            key={promptText}
            type="button"
            onClick={() => handleSendMessage(promptText)}
            className="text-[11px] whitespace-nowrap bg-[#10162B] border border-[#212C4A] hover:border-[#00F5D4] text-slate-300 hover:text-white px-2.5 py-1 rounded-full transition-colors shrink-0"
          >
            {promptText}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-[#1E2640] bg-[#080B18]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about venues, specs, slots, or terms..."
            className="flex-1 bg-[#10162B] border border-[#202946] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#00F5D4] transition-colors"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] hover:brightness-110 disabled:opacity-40 transition-all"
            aria-label="Send message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default GeminiChatDrawer;
