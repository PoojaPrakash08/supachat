"use client";
import { ChatResponse } from "@/types";
import ResultsTable from "./ResultsTable";
import ResultsChart from "./ResultsChart";
import { Bot, User, Code2 } from "lucide-react";
import { useState } from "react";

interface Props {
  query: string;
  response: ChatResponse;
}

export default function ChatMessage({ query, response }: Props) {
  const [showSQL, setShowSQL] = useState(false);

  return (
    <div className="space-y-4">
      {/* User query bubble */}
      <div className="flex gap-3 justify-end">
        <div className="bg-violet-600 text-white px-4 py-2 rounded-2xl rounded-tr-sm max-w-xl text-sm">
          {query}
        </div>
        <div className="w-8 h-8 bg-violet-700 rounded-full flex items-center justify-center flex-shrink-0">
          <User size={16} className="text-white" />
        </div>
      </div>

      {/* Bot response */}
      <div className="flex gap-3">
        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot size={16} className="text-violet-400" />
        </div>
        <div className="flex-1 space-y-4 max-w-4xl">

          {/* Chat response text */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 text-gray-200 text-sm leading-relaxed">
            {response.chat_response}
          </div>

          {/* SQL toggle */}
          <button
            onClick={() => setShowSQL(!showSQL)}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            <Code2 size={13} />
            {showSQL ? "Hide SQL" : "View generated SQL"}
          </button>

          {showSQL && (
            <pre className="bg-gray-950 border border-gray-800 rounded-lg p-4 text-xs text-green-400 overflow-x-auto">
              {response.sql}
            </pre>
          )}

          {/* Chart */}
          {response.meta.has_chart && response.chart.data.length > 0 && (
            <ResultsChart chart={response.chart} />
          )}

          {/* Table */}
          {response.table.rows.length > 0 && (
            <ResultsTable
              columns={response.table.columns}
              rows={response.table.rows}
            />
          )}

          {/* Meta */}
          <p className="text-xs text-gray-600">
            {response.meta.total_rows} rows returned
          </p>
        </div>
      </div>
    </div>
  );
}