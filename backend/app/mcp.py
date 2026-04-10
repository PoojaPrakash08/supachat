import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Database schema context for Claude
SCHEMA_CONTEXT = """
You are an expert SQL analyst for a blog analytics database.

DATABASE SCHEMA:
- articles(id, title, slug, author, published_at, status, read_time_minutes, created_at)
- topics(id, name, slug, created_at)
- article_topics(article_id, topic_id)  -- many-to-many join table
- views(id, article_id, view_date, view_count, unique_visitors)
- engagement(id, article_id, likes, comments, shares, avg_read_percentage, recorded_at)

RULES:
1. Return ONLY valid PostgreSQL SQL — no explanation, no markdown, no backticks
2. Always use table aliases for clarity
3. For "trending" queries, use view_count SUM over recent days
4. For "engagement" queries, combine likes + comments + shares
5. Always add LIMIT 50 unless user specifies otherwise
6. Use NOW() for current time references
7. Never use DELETE, INSERT, UPDATE, DROP — SELECT only
"""

def translate_to_sql(natural_language_query: str) -> str:
    """Convert natural language to SQL using Claude"""
    message = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=500,
        messages=[
            {"role": "system", "content": SCHEMA_CONTEXT},
            {"role": "user", "content": f"Convert this to SQL: {natural_language_query}"}
        ]
    )
    sql = message.choices[0].message.content.strip()
    # Safety: strip any accidental markdown fences
    sql = sql.replace("```sql", "").replace("```", "").strip()
    return sql


def generate_chat_response(query: str, sql: str, results: list[dict]) -> str:
    """Generate a friendly chatbot response based on results"""
    results_preview = str(results[:5])  # Send first 5 rows as context

    message = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=400,
        messages=[
            {
                "role": "system",
                "content": "You are SupaChat, a friendly blog analytics assistant. Give concise, insightful answers based on data. Use numbers and highlight key findings. Keep it under 100 words."
            },
            {
                "role": "user",
                "content": f"""
User asked: "{query}"
SQL executed: {sql}
Results (sample): {results_preview}
Total rows returned: {len(results)}

Provide a friendly, insightful summary of these results.
"""
            }
        ]
    )

    return message.choices[0].message.content.strip()