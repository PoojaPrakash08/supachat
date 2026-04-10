def detect_chart_type(query: str, columns: list[str]) -> str:
    """Detect what chart type best fits the query"""
    query_lower = query.lower()

    if any(word in query_lower for word in ["trend", "daily", "over time", "by day", "by month"]):
        return "line"
    elif any(word in query_lower for word in ["compare", "top", "ranking", "most", "best"]):
        return "bar"
    elif any(word in query_lower for word in ["distribution", "breakdown", "percentage", "share"]):
        return "pie"
    elif len(columns) >= 2:
        return "bar"  # default
    return "none"


def detect_chart_keys(columns: list[str], chart_type: str) -> dict:
    """Detect which columns map to x-axis and y-axis"""
    if not columns or len(columns) < 2:
        return {}

    # Heuristic: first text-like column = x, first numeric-like = y
    # (Frontend will also handle this, but we hint it)
    return {
        "xKey": columns[0],
        "yKey": columns[1]
    }


def format_response(
    query: str,
    sql: str,
    results: list[dict],
    chat_response: str
) -> dict:
    """Format the full API response"""
    columns = list(results[0].keys()) if results else []
    chart_type = detect_chart_type(query, columns)
    chart_keys = detect_chart_keys(columns, chart_type)

    return {
        "query": query,
        "sql": sql,
        "chat_response": chat_response,
        "table": {
            "columns": columns,
            "rows": results
        },
        "chart": {
            "type": chart_type,
            "data": results[:30],  # limit chart data points
            **chart_keys
        },
        "meta": {
            "total_rows": len(results),
            "has_chart": chart_type != "none"
        }
    }