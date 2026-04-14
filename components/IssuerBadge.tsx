const ISSUER_STYLE: Record<string, string> = {
  "US-OFAC": "bg-blue-900 text-blue-300 border-blue-700",
  "EU": "bg-yellow-900 text-yellow-300 border-yellow-700",
  "UK": "bg-red-900 text-red-300 border-red-700",
  "UN": "bg-gray-700 text-gray-300 border-gray-600",
};

export default function IssuerBadge({ issuer }: { issuer: string }) {
  const style = ISSUER_STYLE[issuer] || "bg-gray-800 text-gray-400 border-gray-600";
  return (
    <span className={`text-xs px-2 py-0.5 rounded border font-mono font-semibold ${style}`}>
      {issuer}
    </span>
  );
}
