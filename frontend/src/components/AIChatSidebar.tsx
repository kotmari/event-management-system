import { useEffect, useRef, useState } from "react";
import { useIAStore } from "../store/useAIStore";
import { Bot, Loader2, MessageSquare, Send, User, X } from "lucide-react";

export const AIChatSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, askAssistant, isLoading, error } = useIAStore();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const question = input.trim();
    setInput("");
    await askAssistant(question);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-violet-400 hover:bg-violet-500 text-white flex items-center justify-center z-50 transition-all hover:scale-110 active:scale-95"
        >
          <Bot className="w-8 h-8" />
        </button>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-white shadow-2xl z-60 transform transition-transform duration-300 flex flex-col border-l border-gray-200 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b flex items-center justify-between bg-violet-50">
          <div className="flex items-center gap-2 font-semibold text-violet-900">
            <Bot className="w-6 h-6" />
            <span>AI Event Assistant</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-violet-100 rounded-full text-gray-500"
          >
            <X className="size-6" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-10">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>Ask me something about your events!</p>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-3 text-sm max-w-[85%] ${
                m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  m.role === "user"
                    ? "bg-violet-500 text-white"
                    : "bg-white text-violet-600 border border-violet-100"
                }`}
              >
                {m.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              
              <div
                className={`p-3 rounded-2xl shadow-sm ${
                  m.role === "user"
                    ? "bg-violet-500 text-white rounded-tr-none"
                    : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 text-sm mr-auto animate-pulse">
              <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
              </div>
              <div className="bg-white border border-gray-200 text-gray-400 p-3 rounded-2xl rounded-tl-none">
                Thinking...
              </div>
            </div>
          )}

          {error && (
            <div className="text-center text-red-500 text-xs bg-red-50 p-2 rounded-lg">
              {error}
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask about your events..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-violet-500 outline-none text-sm"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-violet-600 hover:bg-violet-700 disabled:bg-gray-300 text-white p-2 rounded-xl transition-colors shadow-md"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {["Next event?", "My tech events", "Who is attending?"].map((q) => (
              <button
                key={q}
                onClick={() => setInput(q)}
                className="whitespace-nowrap px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-[10px] font-medium text-gray-600 border border-gray-200"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};