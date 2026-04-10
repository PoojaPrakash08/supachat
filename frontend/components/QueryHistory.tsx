"use client";
import { HistoryItem } from "@/types";
import { Clock, ChevronRight } from "lucide-react";

interface Props {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

export default function QueryHistory({ history, onSelect }: Props) {
  if (!history.length) return (
    <div className="text-gray-600 text-xs text-center pt-8">
      No queries yet.<br />Ask something! 👆
    </div>
  );

  return (
    <div className="space-y-1">
      {history.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item)}
          className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-800 transition-colors group"
        >
          <div className="flex items-start gap-2">
            <Clock size={13} className="text-gray-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-gray-300 text-xs truncate">{item.query}</p>
              <p className="text-gray-600 text-xs mt-0.5">
                {new Date(item.timestamp).toLocaleTimeString()}
              </p>
            </div>
            <ChevronRight size={13} className="text-gray-700 group-hover:text-gray-400 transition-colors" />
          </div>
        </button>
      ))}
    </div>
  );
}