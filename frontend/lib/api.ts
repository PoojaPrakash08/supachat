import axios from "axios";
import { ChatResponse } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function sendChatQuery(query: string): Promise<ChatResponse> {
  const response = await axios.post(`${API_URL}/api/chat`, { query });
  return response.data;
}