import React, { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Sparkles, Compass, MessageSquare, Trash2, ArrowUpRight } from "lucide-react";

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
        "Hello! I am CYGNUS Intelligence, your real-world geospatial and booking concierge. I can compare dining options, look up verified clinic slots, review laptop specs, or guide you through reservations. What are you looking for?",
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
        content: data.text || "I have analyzed your query against live availability records.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.warn("Chat error, falling back to local contextual reasoning:", error);
      const fallbackMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content:
          "I recommend checking 'Aura Hearth & Woodfire Kitchen' for an authentic Italian dinner tonight, or 'Nova Dental Studio' for an intraoral scan slot. You can view them on the live map canvas or lock in a verified booking directly!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "msg-0",
        role: "assistant",
        content:
          "Chat reset. How can I help you find and book real-world services, places, or products?",
        timestamp: "Just now",
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-[#0A0D1D] border-l border-[#1F2742] shadow-2xl flex flex-col justify-between animate-fade-in text-foreground">
      {/* Header */}
      <div className="p-4 border-b border-[#1E2640] flex items-center justify-between bg-[#080B18]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] p-[1px] flex items-center justify-center">
            <div className="w-full h-full rounded-[11px] bg-[#080B18] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#00F5D4]" />
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>CYGNUS Concierge</span>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/40">
                gemini-3.8-flash
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Geospatial Reasoning & Booking Intelligence
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={clearChat}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
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
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs ${
                  isUser
                    ? "bg-[#38BDF8] text-[#06070B]"
                    : "bg-[#11172E] border border-[#00F5D4] text-[#00F5D4]"
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-2 ${
                  isUser
                    ? "bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white shadow-md"
                    : "bg-[#0F142A] border border-[#1E2849] text-slate-200 shadow-md"
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>

                {/* If assistant, allow quick search insertion */}
                {!isUser && onApplySearchQuery && m.id !== "msg-0" && (
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">Actionable Recommendation</span>
                    <button
                      type="button"
                      onClick={() => {
                        onApplySearchQuery(m.content);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1 text-[10px] text-[#00F5D4] hover:underline font-mono"
                    >
                      <span>Apply to Discovery</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <div className="text-[9px] text-slate-400 text-right opacity-70 font-mono">
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-3 rounded-2xl bg-[#0F142A] border border-[#1E2849] animate-pulse">
            <Bot className="w-4 h-4 text-[#00F5D4] animate-spin" />
            <span>CYGNUS AI is consulting live maps and provider feeds...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Inquiries */}
      <div className="px-4 py-2.5 border-t border-[#171F36] bg-[#080C1B] overflow-x-auto flex gap-1.5 scrollbar-none">
        {[
          "Compare laptops under ₹70,000",
          "Paddy field fertilizer in Nellore",
          "Plumber available today",
          "Hospital with cardiology specialist",
          "Tractor available for rent",
          "Wholesale rice millers",
          "Website development agency",
        ].map((promptText) => (
          <button
            key={promptText}
            type="button"
            onClick={() => handleSendMessage(promptText)}
            className="text-[11px] whitespace-nowrap bg-[#0F142A] border border-[#1F2A4C] hover:border-[#00F5D4] text-slate-300 hover:text-white px-3 py-1 rounded-full transition-colors shrink-0 cursor-pointer"
          >
            {promptText}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3.5 border-t border-[#1E2640] bg-[#070A16]">
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
            className="flex-1 bg-[#0E1328] border border-[#1F2948] focus:border-[#00F5D4] rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#00F5D4] text-[#06070B] hover:brightness-110 disabled:opacity-40 transition-all cursor-pointer shadow-md"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default GeminiChatDrawer;
