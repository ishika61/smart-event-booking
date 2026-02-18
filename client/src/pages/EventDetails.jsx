// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "../api/axios";
// import socket from "../socket/socket";
// import BookingForm from "../components/BookingForm";

// export default function EventDetails() {
//   const { id } = useParams();
//   const [event, setEvent] = useState(null);

//   useEffect(() => {
//     axios.get(`/events/${id}`)
//       .then(res => setEvent(res.data));

//     socket.on("seatUpdated", (data) => {
//       if (data.event_id == id) {
//         setEvent(prev => ({
//           ...prev,
//           available_seats: data.remainingSeats
//         }));
//       }
//     });
//   }, [id]);

//   if (!event) return <div>Loading...</div>;

//   return (
//     <div className="p-6">
//       <h1 className="text-4xl">{event.title}</h1>
//       <p>{event.description}</p>
//       <p className="text-green-400">
//         Seats Available: {event.available_seats}
//       </p>

//       <iframe
//         className="mt-4 w-full h-64"
//         src={`https://maps.google.com/maps?q=${event.location}&output=embed`}
//       />

//       <BookingForm event={event} />
//     </div>
//   );
// }

import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import socket from "../socket/socket";
import BookingForm from "../components/BookingForm";
import { motion } from "framer-motion";

function SeatIndicator({ available, total }) {
  const pct = total > 0 ? (available / total) * 100 : 0;
  const color = pct > 50 ? "#4ade80" : pct > 20 ? "#facc15" : "#f87171";
  const label =
    pct > 50 ? "Seats Available" : pct > 20 ? "Filling Fast" : "Almost Full";

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: color }}
          />
          <span
            className="text-sm font-semibold"
            style={{ fontFamily: "Syne,sans-serif", color }}
          >
            {label}
          </span>
        </div>
        <span className="text-white/50 text-sm">
          {available} / {total} seats
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[.06] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg,${color}88,${color})` }}
        />
      </div>
      <p className="text-white/25 text-xs mt-2">
        {Math.round(pct)}% seats remaining
      </p>
    </div>
  );
}

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    axios
      .get(`/events/${id}`)
      .then((r) => {
        setEvent(r.data);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });

    socket.on("seatUpdated", (data) => {
      if (String(data.event_id) === String(id)) {
        setEvent((prev) =>
          prev ? { ...prev, available_seats: data.remainingSeats } : prev
        );
      }
    });
    return () => socket.off("seatUpdated");
  }, [id]);

  const fmt = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "TBA";

  if (loading)
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-yellow-500/30 border-t-yellow-400 animate-spin" />
          <p className="text-white/30 text-sm">Loading event…</p>
        </div>
      </div>
    );

  if (notFound)
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center text-center px-6">
        <div>
          <div className="text-6xl mb-4 opacity-20">🔍</div>
          <h2
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: "Syne,sans-serif" }}
          >
            Event Not Found
          </h2>
          <p className="text-white/40 mb-6">
            This event doesn't exist or has been removed.
          </p>
          <Link to="/events" className="btn-gold px-7 py-3 text-sm">
            ← Back to Events
          </Link>
        </div>
      </div>
    );

  return (
    <div
      className="min-h-screen pt-24 pb-24 px-6"
      style={{
        background:
          "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(212,175,55,.04) 0%, transparent 60%), #080808",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* ── Breadcrumb ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-white/30 text-sm mb-8"
        >
          <Link to="/events" className="hover:text-white/60 transition-colors">
            Events
          </Link>
          <span>/</span>
          <span className="text-white/55 truncate max-w-xs">{event.title}</span>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* ── LEFT: details ── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero image */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
            >
              <div
                className="w-full h-72 md:h-96 rounded-2xl overflow-hidden flex items-center justify-center relative"
                style={{
                  background: event.img
                    ? `url(${event.img}) center/cover no-repeat`
                    : "linear-gradient(135deg,#1a1a0a,#0d0d07)",
                }}
              >
                {!event.img && (
                  <span
                    className="text-[10rem] font-black opacity-[.07]"
                    style={{ fontFamily: "Syne,sans-serif", color: "#D4AF37" }}
                  >
                    {event.title?.[0]}
                  </span>
                )}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(8,8,8,.8) 0%, transparent 50%)",
                  }}
                />
                {/* Chips over image */}
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: "rgba(212,175,55,.15)",
                      color: "#D4AF37",
                      border: "1px solid rgba(212,175,55,.3)",
                      fontFamily: "Syne,sans-serif",
                    }}
                  >
                    📅 {fmt(event.date)}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: "rgba(0,0,0,.5)",
                      color: "rgba(255,255,255,.7)",
                      border: "1px solid rgba(255,255,255,.15)",
                    }}
                  >
                    📍 {event.location || "TBA"}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Title & price */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                <h1
                  className="text-3xl md:text-5xl font-extrabold leading-tight"
                  style={{
                    fontFamily: "Syne,sans-serif",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {event.title}
                </h1>
                <span
                  className="px-4 py-2 rounded-full text-sm font-bold shrink-0"
                  style={{
                    background: "rgba(74,222,128,.08)",
                    color: "#4ade80",
                    border: "1px solid rgba(74,222,128,.2)",
                    fontFamily: "Syne,sans-serif",
                  }}
                >
                  ₹{event.price?.toLocaleString()} / ticket
                </span>
              </div>

              {event.description && (
                <p className="text-white/50 text-lg leading-relaxed">
                  {event.description}
                </p>
              )}
            </motion.div>

            {/* seat indicator */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15 }}
            >
              <SeatIndicator
                available={event.available_seats}
                total={event.total_seats}
              />
            </motion.div>

            {/* Ticket categories info */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
            >
              <h3
                className="text-lg font-bold mb-4"
                style={{ fontFamily: "Syne,sans-serif" }}
              >
                🎟️ Ticket Categories
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    name: "Regular",
                    icon: "🎟️",
                    mult: 1,
                    desc: "General admission",
                  },
                  {
                    name: "VIP",
                    icon: "⭐",
                    mult: 2,
                    desc: "Front-row + lounge",
                  },
                  {
                    name: "Premium",
                    icon: "💎",
                    mult: 3,
                    desc: "VIP + 1-on-1 speaker",
                  },
                ].map((cat) => (
                  <div
                    key={cat.name}
                    className="glass rounded-xl p-4 text-center"
                  >
                    <div className="text-2xl mb-1">{cat.icon}</div>
                    <div
                      className="font-bold text-sm mb-0.5"
                      style={{ fontFamily: "Syne,sans-serif" }}
                    >
                      {cat.name}
                    </div>
                    <div
                      className="text-yellow-400 font-bold text-sm"
                      style={{ fontFamily: "Syne,sans-serif" }}
                    >
                      ₹{((event.price || 0) * cat.mult).toLocaleString()}
                    </div>
                    <div className="text-white/30 text-xs mt-1">{cat.desc}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Google Maps */}
            {event.location && (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.25 }}
              >
                <h3
                  className="text-lg font-bold mb-4"
                  style={{ fontFamily: "Syne,sans-serif" }}
                >
                  📍 Location
                </h3>
                <div
                  className="rounded-2xl overflow-hidden border border-white/[.07]"
                  style={{ height: 300 }}
                >
                  <iframe
                    title="map"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: "invert(.92) hue-rotate(180deg)" }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      event.location
                    )}&output=embed`}
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* ── RIGHT: booking form ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="lg:sticky lg:top-28">
              <BookingForm event={event} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
