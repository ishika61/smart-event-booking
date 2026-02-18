// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";

// export default function EventCard({ event }) {
//   return (
//     <motion.div
//       whileHover={{ scale: 1.05 }}
//       className="bg-gray-900 p-4 rounded-lg"
//     >
//       <h2 className="text-xl font-bold">{event.title}</h2>
//       <p>{event.location}</p>
//       <p>₹{event.price}</p>
//       <Link
//         to={`/event/${event.id}`}
//         className="text-blue-400 mt-2 block"
//       >
//         View Details
//       </Link>
//     </motion.div>
//   );
// }



import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function SeatDot({ pct }) {
  const color = pct > 50 ? "#4ade80" : pct > 20 ? "#facc15" : "#f87171";
  const label = pct > 50 ? "Available" : pct > 20 ? "Filling Fast" : "Almost Full";
  const cls = pct > 50 ? "seat-high" : pct > 20 ? "seat-medium" : "seat-low";
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="w-1.5 h-1.5 rounded-full animate-pulse"
        style={{ background: color }}
      />
      <span className={`text-xs font-medium ${cls}`}>{label}</span>
    </div>
  );
}

export default function EventCard({ event }) {
  const fmt = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "TBA";

  const avail = event.available_seats ?? 0;
  const total = event.total_seats ?? 0;
  const pct = total > 0 ? (avail / total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="card group flex flex-col h-full"
    >
      {/* ── thumbnail ── */}
      <div
        className="relative h-48 flex items-center justify-center overflow-hidden"
        style={{
          background: event.img
            ? `url(${event.img}) center/cover no-repeat`
            : "linear-gradient(135deg, #1a1a0a, #0d0d07)",
        }}
      >
        {!event.img && (
          <span
            className="text-8xl font-black select-none opacity-[.07]"
            style={{ fontFamily: "Syne,sans-serif", color: "#D4AF37" }}
          >
            {event.title?.[0] ?? "E"}
          </span>
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* price badge */}
        <div
          className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold"
          style={{
            fontFamily: "Syne,sans-serif",
            background: "rgba(0,0,0,.72)",
            border: "1px solid rgba(212,175,55,.4)",
            color: "#D4AF37",
          }}
        >
          ₹{event.price?.toLocaleString()}
        </div>

        {/* Date chip on hover */}
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span
            className="text-[10px] px-2.5 py-1 rounded-full font-semibold"
            style={{
              background: "rgba(0,0,0,.7)",
              color: "rgba(255,255,255,.7)",
              fontFamily: "Syne,sans-serif",
            }}
          >
            📅 {fmt(event.date)}
          </span>
        </div>
      </div>

      {/* ── body ── */}
      <div className="p-5 flex flex-col flex-1">
        <p
          className="text-yellow-500/60 text-[11px] tracking-wider uppercase mb-2 font-semibold"
          style={{ fontFamily: "Syne,sans-serif" }}
        >
          {fmt(event.date)}
        </p>
        <h3
          className="text-base font-bold leading-snug mb-1.5 line-clamp-2"
          style={{ fontFamily: "Syne,sans-serif" }}
        >
          {event.title}
        </h3>
        <div className="flex items-center gap-1.5 text-white/35 text-xs mb-3">
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {event.location || "TBA"}
        </div>

        <SeatDot pct={pct} />

        {/* seat progress bar */}
        <div className="mt-2.5 h-1 rounded-full bg-white/[.06] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{
              background:
                pct > 50
                  ? "linear-gradient(90deg,#4ade80,#22c55e)"
                  : pct > 20
                  ? "linear-gradient(90deg,#facc15,#eab308)"
                  : "linear-gradient(90deg,#f87171,#ef4444)",
            }}
          />
        </div>
        <p className="text-white/25 text-[11px] mt-1">
          {avail} / {total} seats remaining
        </p>

        <div className="flex-1" />

        <Link
          to={`/event/${event.id}`}
          className="mt-4 w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border border-white/[.08] hover:border-yellow-500/30 hover:bg-yellow-500/[.05] hover:text-yellow-400"
          style={{ fontFamily: "Syne,sans-serif" }}
        >
          View Details →
        </Link>
      </div>
    </motion.div>
  );
}
