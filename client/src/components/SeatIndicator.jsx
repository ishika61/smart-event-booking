import { motion } from "framer-motion";

export default function SeatIndicator({ available, total }) {
  const pct   = total > 0 ? (available / total) * 100 : 0;
  const color = pct > 50 ? "#4ade80" : pct > 20 ? "#facc15" : "#f87171";
  const label = pct > 50 ? "Seats Available" : pct > 20 ? "Filling Fast" : "Almost Full";

  return (
    <div
      className="rounded-2xl p-4"
      style={{ background:'rgba(255,255,255,.02)', border:'1px solid rgba(255,255,255,.07)' }}
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: color }} />
          <span className="text-sm font-semibold" style={{ color, fontFamily:'Syne,sans-serif' }}>
            {label}
          </span>
        </div>
        <span className="text-white/40 text-sm">{available} / {total} seats</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[.06] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}88, ${color})` }}
        />
      </div>
    </div>
  );
}
