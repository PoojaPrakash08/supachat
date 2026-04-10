"use client";

interface Props {
  columns: string[];
  rows: Record<string, any>[];
}

export default function ResultsTable({ columns, rows }: Props) {
  if (!rows.length) return null;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-800">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-900 text-gray-400 uppercase text-xs">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-4 py-3 font-medium whitespace-nowrap">
                {col.replace(/_/g, " ")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {rows.map((row, i) => (
            <tr key={i} className="bg-gray-950 hover:bg-gray-900 transition-colors">
              {columns.map((col) => (
                <td key={col} className="px-4 py-3 text-gray-300 whitespace-nowrap">
                  {row[col] !== null && row[col] !== undefined
                    ? String(row[col])
                    : "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}