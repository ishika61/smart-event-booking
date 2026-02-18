// import { useEffect, useState } from "react";
// import axios from "../api/axios";
// import EventCard from "../components/EventCard";

// export default function Events() {
//   const [events, setEvents] = useState([]);
//   const [location, setLocation] = useState("");
//   const [date, setDate] = useState("");

//   const fetchEvents = async () => {
//     const res = await axios.get(
//       `/events?location=${location}&date=${date}`
//     );
//     setEvents(res.data);
//   };

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   return (
//     <div className="p-6">
//       <div className="flex gap-4 mb-6">
//         <input
//           placeholder="Location"
//           value={location}
//           onChange={(e) => setLocation(e.target.value)}
//           className="text-black p-2"
//         />

//         <input
//           type="date"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//           className="text-black p-2"
//         />

//         <button
//           onClick={fetchEvents}
//           className="bg-blue-600 px-4"
//         >
//           Search
//         </button>
//       </div>

//       <div className="grid grid-cols-3 gap-6">
//         {events.map((event) => (
//           <EventCard key={event.id} event={event} />
//         ))}
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import axios from "../api/axios";
import EventCard from "../components/EventCard";
import { motion, AnimatePresence } from "framer-motion";

function SkeletonCard() {
  return (
    <div className="card rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-white/[.04]" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-white/[.05] rounded w-1/3" />
        <div className="h-5 bg-white/[.05] rounded w-4/5" />
        <div className="h-3 bg-white/[.05] rounded w-1/2" />
        <div className="h-1 bg-white/[.04] rounded mt-4" />
        <div className="h-9 bg-white/[.03] rounded-xl mt-3" />
      </div>
    </div>
  );
}

export default function Events() {
  const [events, setEvents] = useState([]);
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvents = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (location) params.append("location", location);
      if (date) params.append("date", date);
      const res = await axios.get(`/events?${params}`);
      setEvents(res.data);
    } catch {
      setError("Failed to load events. Please check your connection.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSearch = (e) => {
    e?.preventDefault();
    fetchEvents();
  };

  const clearFilters = () => {
    setLocation("");
    setDate("");
    setLoading(true);
    setError("");
    axios
      .get("/events")
      .then((r) => {
        setEvents(r.data);
        setLoading(false);
      });
  };

  const hasFilter = location || date;

  return (
    <div
      className="min-h-screen pt-24 pb-24 px-6"
      style={{
        background:
          "radial-gradient(ellipse 60% 35% at 50% 0%, rgba(212,175,55,.05) 0%, transparent 60%), #080808",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="mb-10"
        >
          <p
            className="text-yellow-500 text-xs tracking-[.15em] uppercase font-semibold mb-3"
            style={{ fontFamily: "Syne,sans-serif" }}
          >
            Discover
          </p>
          <h1
            className="text-4xl md:text-6xl font-extrabold mb-3"
            style={{ fontFamily: "Syne,sans-serif", letterSpacing: "-0.03em" }}
          >
            All Events
          </h1>
          <p className="text-white/40 text-lg">
            Find and book your next unforgettable experience
          </p>
        </motion.div>

        {/* ── Filter bar ── */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="glass rounded-2xl p-4 mb-8 flex flex-col sm:flex-row gap-3"
        >
          {/* Location input */}
          <div className="relative flex-1">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <input
              className="inp pl-10"
              placeholder="Search by location…"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Date input */}
          <div className="relative flex-1">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <input
              type="date"
              className="inp pl-10"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn-gold px-6 py-3 rounded-xl text-sm whitespace-nowrap"
          >
            Search
          </button>

          {hasFilter && (
            <button
              type="button"
              onClick={clearFilters}
              className="px-4 py-3 rounded-xl text-sm text-white/40 hover:text-white border border-white/10 hover:border-white/20 transition-all"
            >
              Clear
            </button>
          )}
        </motion.form>

        {/* ── Result count ── */}
        {!loading && !error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/28 text-sm mb-6"
          >
            {events.length} event{events.length !== 1 ? "s" : ""} found
            {hasFilter && " · filtered"}
          </motion.p>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="glass rounded-2xl p-6 text-center text-red-400 mb-6 border border-red-500/15">
            {error}
          </div>
        )}

        {/* ── Skeleton ── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* ── Events grid ── */}
        {!loading && !error && (
          <AnimatePresence>
            {events.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-28"
              >
                <div className="text-6xl mb-5 opacity-20">🎪</div>
                <p className="text-white/40 text-lg mb-1">No events found</p>
                <p className="text-white/20 text-sm">
                  Try adjusting your search filters
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                  >
                    <EventCard event={event} />
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
