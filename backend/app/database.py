from dotenv import load_dotenv
import os

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_DB_URL = os.getenv("SUPABASE_DB_URL")

print("DEBUG DB URL:", SUPABASE_DB_URL)

# ✅ Fix driver
if SUPABASE_DB_URL:
    SUPABASE_DB_URL = SUPABASE_DB_URL.replace("postgresql://", "postgresql+psycopg://")

# ❗ Delay imports (important)
from supabase import create_client, Client
from sqlalchemy import create_engine, text

# ✅ Safe initialization
supabase: Client | None = None
engine = None

try:
    if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY:
        supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    if SUPABASE_DB_URL:
        engine = create_engine(SUPABASE_DB_URL)

except Exception as e:
    print("DB INIT ERROR:", e)

# ✅ Function ALWAYS defined
def run_query(sql: str) -> list[dict]:
    if engine is None:
        raise Exception("Database not initialized properly")

    with engine.connect() as conn:
        result = conn.execute(text(sql))
        columns = result.keys()
        rows = result.fetchall()
        return [dict(zip(columns, row)) for row in rows]