const ISSUER_STYLE: Record<string, string> = {
  "US-OFAC": "bg-blue-500/10 text-blue-700 ring-1 ring-inset ring-blue-500/20",
  "EU": "bg-amber-500/10 text-amber-700 ring-1 ring-inset ring-amber-500/20",
  "UK": "bg-red-500/10 text-red-700 ring-1 ring-inset ring-red-500/20",
  "UN": "bg-slate-500/10 text-slate-700 ring-1 ring-inset ring-slate-500/20",
};

export default function IssuerBadge({ issuer }: { issuer: string }) {
  const style = ISSUER_STYLE[issuer] || "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200";
  return (
    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold font-mono ${style}`}>
      {issuer}
    </span>
  );
}
