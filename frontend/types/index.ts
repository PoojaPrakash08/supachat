export interface ChatResponse {
  query: string;
  sql: string;
  chat_response: string;
  table: {
    columns: string[];
    rows: Record<string, any>[];
  };
  chart: {
    type: "bar" | "line" | "pie" | "none";
    data: Record<string, any>[];
    xKey?: string;
    yKey?: string;
  };
  meta: {
    total_rows: number;
    has_chart: boolean;
  };
}

export interface HistoryItem {
  id: string;
  query: string;
  timestamp: Date;
  response: ChatResponse;
}