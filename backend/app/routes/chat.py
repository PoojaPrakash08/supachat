from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.mcp import translate_to_sql, generate_chat_response
from app.database import run_query
from app.formatter import format_response
import traceback

router = APIRouter()

class ChatRequest(BaseModel):
    query: str

class QueryHistoryItem(BaseModel):
    query: str
    sql: str
    response: str

@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        query = request.query.strip()

        if not query:
            raise HTTPException(status_code=400, detail="Query cannot be empty")

        # Step 1: NL → SQL
        sql = translate_to_sql(query)

        # Step 2: Run SQL on Supabase
        results = run_query(sql)

        # Step 3: Generate chat response
        chat_response = generate_chat_response(query, sql, results)

        # Step 4: Format full response
        response = format_response(query, sql, results, chat_response)

        return response

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Error processing query: {str(e)}"
        )