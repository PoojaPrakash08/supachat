"use client";
import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

interface Props {
  onSubmit: (query: string) => void;
  loading: boolean;
}

const EXAMPLE_QUERIES = [
  "Show top trending topics in last 30 days",
  "Compare article engagement by topic",
  "Plot daily views trend for AI articles",
  "Who are the top 3 authors by total views?",
];

export default function ChatInput({ onSubmit, loading }: Props) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (!input.trim() || loading) return;
    onSubmit(input.trim());
    setInput("");
  };

  return (
    <div className="w-full space-y-3">
      {/* Example queries */}
      <div className="flex flex-wrap gap-2">
        {EXAMPLE_QUERIES.map((q) => (
          <button
            key={q}
            onClick={() => setInput(q)}
            className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-full border border-gray-700 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="flex gap-2 items-center bg-gray-900 border border-gray-700 rounded-xl px-4 py-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Ask anything about your blog analytics..."
          className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-sm"
          disabled={loading}
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !input.trim()}
          className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white p-2 rounded-lg transition-colors"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>
    </div>
  );
}