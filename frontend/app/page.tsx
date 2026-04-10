"use client";
import { useState } from "react";
import ChatInput from "@/components/ChatInput";
import ChatMessage from "@/components/ChatMessage";
import QueryHistory from "@/components/QueryHistory";
import { sendChatQuery } from "@/lib/api";
import { ChatResponse, HistoryItem } from "@/types";
import { BarChart2, Sparkles } from "lucide-react";

export default function Home() {
  const [messages, setMessages] = useState<{ query: string; response: ChatResponse }[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuery = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await sendChatQuery(query);

      const newMessage = { query, response };
      setMessages((prev) => [...prev, newMessage]);

      const historyItem: HistoryItem = {
        id: crypto.randomUUID(),
        query,
        timestamp: new Date(),
        response,
      };
      setHistory((prev) => [historyItem, ...prev].slice(0, 20));
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setMessages((prev) => [...prev, { query: item.query, response: item.response }]);
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">

      {/* Sidebar */}
      <div className="w-72 border-r border-gray-800 flex flex-col bg-gray-950">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
              <BarChart2 size={18} />
            </div>
            <div>
              <h1 className="font-bold text-white text-sm">SupaChat</h1>
              <p className="text-gray-500 text-xs">Blog Analytics AI</p>
            </div>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <p className="text-gray-600 text-xs uppercase font-medium mb-3 tracking-wider">
            Query History
          </p>
          <QueryHistory history={history} onSelect={handleHistorySelect} />
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-16 h-16 bg-violet-600/20 rounded-2xl flex items-center justify-center">
                <Sparkles size={32} className="text-violet-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Ask your data anything</h2>
                <p className="text-gray-500 text-sm mt-1">
                  Query your blog analytics in plain English
                </p>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <ChatMessage key={i} query={msg.query} response={msg.response} />
          ))}

          {/* Loading state */}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <Sparkles size={16} className="text-violet-400 animate-pulse" />
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl px-4 py-3 text-gray-400 text-sm">
                Thinking...
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-3 text-red-400 text-sm">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-800">
          <ChatInput onSubmit={handleQuery} loading={loading} />
        </div>
      </div>
    </div>
  );
}