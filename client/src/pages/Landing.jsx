import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";

/* ─── data ─────────────────────────────────── */
const SPEAKERS = [
  {
    name: "Dr. Aria Chen",
    role: "AI Lead, NeuroTech Labs",
    initials: "AC",
    color: "#D4AF37",
    tag: "Keynote",
  },
  {
    name: "Marcus Reid",
    role: "CTO, CloudVerse",
    initials: "MR",
    color: "#7C5CBF",
    tag: "Cloud",
  },
  {
    name: "Priya Nair",
    role: "Founder & CEO, DevSync",
    initials: "PN",
    color: "#3B9EDB",
    tag: "Startup",
  },
  {
    name: "James Okafor",
    role: "Lead Cybersecurity Architect",
    initials: "JO",
    color: "#E55E52",
    tag: "Security",
  },
  {
    name: "Sofia Mendes",
    role: "VP Product, TechNova",
    initials: "SM",
    color: "#4CAF72",
    tag: "Product",
  },
];

const STATS = [
  { val: "50+", lbl: "Expert Speakers" },
  { val: "3K+", lbl: "Attendees" },
  { val: "20+", lbl: "Workshops" },
  { val: "3", lbl: "Incredible Days" },
];

const SCHEDULE = [
  {
    time: "09:00 – 10:00 AM",
    title: "Grand Opening",
    desc: "Kick off the day with a warm welcome. Walk through the schedule, introduce key speakers, and set the tone for an inspiring day.",
    speakers: [],
    tag: "opening",
  },
  {
    time: "10:30 – 11:50 AM",
    title: "Keynote: The Future of AI",
    desc: "A visionary talk on where technology is heading — AI, SaaS, and innovation in the digital age.",
    speakers: ["AC", "PN"],
    tag: "keynote",
  },
  {
    time: "12:00 – 12:50 PM",
    title: "Live App Showcase",
    desc: "See demos of exciting new SaaS products, apps, and platforms. Startup spotlights and enterprise innovation.",
    speakers: ["MR"],
    tag: "showcase",
  },
  {
    time: "1:20 – 2:30 PM",
    title: "Networking Lunch",
    desc: "Enjoy food, meet other attendees, and make real connections. Swap ideas, business cards, and your next partnership.",
    speakers: [],
    tag: "break",
  },
  {
    time: "3:00 – 4:30 PM",
    title: "Building Scalable Products",
    desc: "Top founders and product leads share real stories and strategies on building tools that grow with users.",
    speakers: ["JO", "SM"],
    tag: "talk",
  },
  {
    time: "5:00 – 5:30 PM",
    title: "Closing Remarks & Next Steps",
    desc: "Recap the day, thank our speakers, and share what's next — including post-event resources and recordings.",
    speakers: ["AC"],
    tag: "closing",
  },
];

const RESOURCES = [
  {
    year: "2023",
    topic: "Web3 & Decentralized Future",
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
  },
  {
    year: "2024",
    topic: "AI Revolution in Enterprise",
    img: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80",
  },
  {
    year: "2025",
    topic: "Cloud-Native Architecture",
    img: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=600&q=80",
  },
];

const PRICING = [
  {
    name: "Regular",
    icon: "🎟️",
    price: "Free",
    desc: "Perfect for students & explorers",
    features: [
      "General admission",
      "All main sessions",
      "Digital resources",
      "Networking access",
    ],
    cta: "Get Free Pass",
    highlight: false,
    mult: 1,
  },
  {
    name: "VIP",
    icon: "⭐",
    price: "₹2,499",
    desc: "Best for professionals",
    features: [
      "Front-row seating",
      "Exclusive VIP lounge",
      "Speaker meet & greet",
      "Premium gift bag",
      "Digital recordings",
    ],
    cta: "Get VIP Pass",
    highlight: true,
    mult: 2,
  },
  {
    name: "Premium",
    icon: "💎",
    price: "₹4,999",
    desc: "All-access elite experience",
    features: [
      "All VIP perks included",
      "1-on-1 speaker sessions",
      "Backstage access",
      "Priority seating",
      "Lifetime recordings",
    ],
    cta: "Get Premium Pass",
    highlight: false,
    mult: 3,
  },
];

const MARQUEE_ITEMS = [
  "Smart Event Booking",
  "Tech Conference 2025",
  "Book Your Seat Now",
  "Real-Time Availability",
  "August 13–15 · New Delhi",
  "50+ Speakers",
];

const TAG_STYLE = {
  keynote: {
    bg: "rgba(212,175,55,.12)",
    color: "#D4AF37",
    dot: "#D4AF37",
  },
  opening: {
    bg: "rgba(139,92,246,.12)",
    color: "#A78BFA",
    dot: "#A78BFA",
  },
  closing: {
    bg: "rgba(139,92,246,.12)",
    color: "#A78BFA",
    dot: "#A78BFA",
  },
  showcase: {
    bg: "rgba(59,158,219,.12)",
    color: "#60AEDE",
    dot: "#60AEDE",
  },
  break: {
    bg: "rgba(255,255,255,.05)",
    color: "rgba(255,255,255,.3)",
    dot: "rgba(255,255,255,.3)",
  },
  talk: {
    bg: "rgba(76,175,114,.12)",
    color: "#4CAF72",
    dot: "#4CAF72",
  },
};

/* ─── Countdown ─────────────────────────────── */
function Countdown() {
  const target = new Date("2025-08-13T09:00:00");
  const calc = () => {
    const diff = Math.max(0, target - new Date());
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { lbl: "Days", v: t.d },
    { lbl: "Hours", v: t.h },
    { lbl: "Minutes", v: t.m },
    { lbl: "Seconds", v: t.s },
  ];

  return (
    <div className="flex gap-4 md:gap-6 flex-wrap">
      {units.map(({ lbl, v }) => (
        <div key={lbl} className="text-center">
          <div
            className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-3xl md:text-4xl font-bold relative overflow-hidden"
            style={{
              fontFamily: "Syne,sans-serif",
              background: "rgba(212,175,55,.08)",
              border: "1px solid rgba(212,175,55,.2)",
              color: "#D4AF37",
            }}
          >
            <span style={{ fontVariantNumeric: "tabular-nums" }}>
              {String(v).padStart(2, "0")}
            </span>
          </div>
          <div className="text-[10px] text-white/35 uppercase tracking-widest mt-2">
            {lbl}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Speaker avatar ─────────────────────────── */
function SpeakerAvatar({ initials, color, size = 48 }) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-black shrink-0 border-2 border-black"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.35,
        background: `linear-gradient(135deg, ${color}, ${color}88)`,
        fontFamily: "Syne,sans-serif",
      }}
    >
      {initials}
    </div>
  );
}

/* ─── Main ───────────────────────────────────── */
export default function Landing() {
  const ref = useRef();
  const { scrollYProgress } = useScroll({ target: ref });
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const heroOp = useTransform(scrollYProgress, [0, 0.22], [1, 0]);

  const speakerMap = SPEAKERS.reduce((acc, s) => {
    acc[s.initials] = s;
    return acc;
  }, {});

  return (
    <div ref={ref} className="min-h-screen" style={{ background: "#080808" }}>
      {/* ══════════════════ HERO ══════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-16 px-6">
        {/* Decorative grid lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[15, 50, 85].map((pct) => (
            <div
              key={pct}
              className="absolute top-0 bottom-0 w-px"
              style={{
                left: `${pct}%`,
                background:
                  "linear-gradient(180deg, transparent 0%, rgba(212,175,55,.07) 40%, rgba(212,175,55,.04) 70%, transparent 100%)",
              }}
            />
          ))}
        </div>

        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 50% 40%, rgba(212,175,55,.06) 0%, transparent 65%)",
          }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOp, maxWidth: "1200px", margin: "0 auto" }}
          className="relative z-10 w-full"
        >
          <div
            className="grid items-center gap-10"
            style={{ gridTemplateColumns: "1fr 380px" }}
          >
            {/* Left column */}
            <div className="min-w-0">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8"
                style={{
                  background: "rgba(212,175,55,.09)",
                  border: "1px solid rgba(212,175,55,.22)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"
                />
                <span
                  className="text-yellow-400 text-xs font-semibold tracking-[.14em] uppercase"
                  style={{ fontFamily: "Syne,sans-serif" }}
                >
                  August 13–15, 2025 · New Delhi, India
                </span>
              </motion.div>

              {/* Location row */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="flex items-center gap-2 mb-5"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(255,255,255,.4)"
                  strokeWidth="2"
                >
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span
                  className="text-white/40 text-sm"
                  style={{ fontFamily: "DM Sans,sans-serif" }}
                >
                  Elgin Celina, New Delhi
                </span>
              </motion.div>

              {/* Headline — capped at 4rem so it never bleeds into right column */}
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-extrabold leading-none mb-6"
                style={{
                  fontFamily: "Syne,sans-serif",
                  letterSpacing: "-0.03em",
                  fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                }}
              >
                Code.&nbsp;
                <span className="text-gold-gradient">Connect.</span>
                <br />
                Create.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.28 }}
                className="text-white/45 text-lg leading-relaxed mb-10 max-w-md"
              >
                Explore our lineup of keynote speakers and industry leaders who
                will inspire and enlighten at the conference.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.42 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  to="/events"
                  className="btn-gold px-8 py-3.5 text-base"
                >
                  Buy Ticket →
                </Link>
                <a
                  href="#schedule"
                  className="btn-outline px-8 py-3.5 text-base"
                >
                  View Schedule
                </a>
              </motion.div>
            </div>

            {/* Right column: speaker cards — fixed width, never shrinks */}
            <div
              className="hidden md:flex flex-col gap-4"
              style={{ width: "380px", flexShrink: 0 }}
            >
              {SPEAKERS.slice(0, 3).map((sp, i) => (
                <motion.div
                  key={sp.name}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                  className="glass rounded-2xl p-4 flex items-center gap-4"
                  style={{
                    marginLeft: i % 2 === 1 ? "2rem" : undefined,
                  }}
                >
                  <SpeakerAvatar
                    initials={sp.initials}
                    color={sp.color}
                    size={48}
                  />
                  <div className="flex-1 min-w-0">
                    <div
                      className="font-bold text-sm truncate"
                      style={{ fontFamily: "Syne,sans-serif" }}
                    >
                      {sp.name}
                    </div>
                    <div className="text-white/40 text-xs truncate">{sp.role}</div>
                  </div>
                  <span
                    className="ml-auto text-[10px] px-2.5 py-1 rounded-full font-semibold flex-shrink-0"
                    style={{
                      background: `${sp.color}18`,
                      color: sp.color,
                      fontFamily: "Syne,sans-serif",
                    }}
                  >
                    {sp.tag}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="mt-20 flex flex-col items-center gap-2 text-white/20"
          >
            <span className="text-[10px] tracking-widest uppercase">
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════ MARQUEE ══════════════════ */}
      <div
        className="overflow-hidden py-4 border-y"
        style={{
          borderColor: "rgba(212,175,55,.14)",
          background: "rgba(212,175,55,.025)",
        }}
      >
        <div className="marquee-track whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map(
            (item, i) => (
              <span
                key={i}
                className="inline-block px-8 text-xs font-semibold tracking-[.18em] uppercase"
                style={{
                  color: "rgba(212,175,55,.6)",
                  fontFamily: "Syne,sans-serif",
                }}
              >
                ✦ {item}
              </span>
            )
          )}
        </div>
      </div>

      {/* ══════════════════ STATS ══════════════════ */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {STATS.map(({ val, lbl }, i) => (
            <motion.div
              key={lbl}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.09 }}
              className="glass rounded-2xl p-6 text-center"
            >
              <div
                className="text-4xl md:text-5xl font-extrabold text-gold-gradient mb-1"
                style={{ fontFamily: "Syne,sans-serif" }}
              >
                {val}
              </div>
              <div className="text-white/38 text-sm">{lbl}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════ ABOUT + COUNTDOWN ══════════════════ */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left: About text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75 }}
          >
            <p
              className="text-yellow-500 text-xs tracking-[.15em] uppercase font-semibold mb-4"
              style={{ fontFamily: "Syne,sans-serif" }}
            >
              About
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
              style={{ fontFamily: "Syne,sans-serif" }}
            >
              Summitra 2025 is an immersive, IT Conference over the course of
              three days,{" "}
              <span className="text-gold-gradient">August 13–15.</span>
            </h2>
            <p className="text-white/45 text-base leading-relaxed mb-4">
              Our mission — to bridge the gap between cutting-edge technology
              and real-world application. This year's theme: "Code the Future."
            </p>
            <p className="text-white/30 text-sm leading-relaxed mb-8">
              A person's success is measured by the way they approach it and how
              they approach it. Join thousands of developers, founders, and tech
              leaders for three transformative days of inspiration and
              networking.
            </p>
            <Link to="/events" className="btn-gold px-7 py-3 text-sm">
              Get Your Ticket →
            </Link>
          </motion.div>

          {/* Right: Countdown */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75 }}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-col gap-3">
              <p
                className="text-white/25 text-xs tracking-[.18em] uppercase"
                style={{ fontFamily: "Syne,sans-serif" }}
              >
                Event Starts In
              </p>
              <Countdown />
            </div>

            {/* Video / preview teaser */}
            <div
              className="rounded-2xl overflow-hidden relative"
              style={{
                background:
                  "linear-gradient(135deg, rgba(212,175,55,.08), rgba(0,0,0,0))",
                border: "1px solid rgba(212,175,55,.15)",
                height: 200,
              }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-yellow-500/40 cursor-pointer hover:scale-110 transition-transform"
                  style={{ background: "rgba(212,175,55,.12)" }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="#D4AF37"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
                <span className="text-white/40 text-xs tracking-widest uppercase">
                  Watch Highlights Reel
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════ SPEAKERS ══════════════════ */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p
            className="text-yellow-500 text-xs tracking-[.15em] uppercase font-semibold mb-3"
            style={{ fontFamily: "Syne,sans-serif" }}
          >
            Featured Speakers
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2
              className="text-4xl md:text-5xl font-bold leading-tight"
              style={{ fontFamily: "Syne,sans-serif" }}
            >
              Meet all the top IT minds
            </h2>
            <p className="text-white/35 text-sm max-w-xs leading-relaxed">
              Explore our lineup of keynote speakers and industry leaders who
              will inspire and enlighten at the conference.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {SPEAKERS.map((sp, i) => (
            <motion.div
              key={sp.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -8 }}
              className="glass rounded-2xl p-5 text-center cursor-default group"
            >
              {/* Avatar */}
              <div className="relative mx-auto w-16 h-16 mb-4">
                <div
                  className="w-full h-full rounded-full flex items-center justify-center text-black text-2xl font-bold transition-transform duration-300 group-hover:scale-110"
                  style={{
                    fontFamily: "Syne,sans-serif",
                    background: `linear-gradient(135deg, ${sp.color}, ${sp.color}88)`,
                  }}
                >
                  {sp.initials}
                </div>
                {/* Tag badge */}
                <span
                  className="absolute -bottom-1 -right-1 text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                  style={{
                    background: `${sp.color}22`,
                    color: sp.color,
                    border: `1px solid ${sp.color}44`,
                    fontFamily: "Syne,sans-serif",
                  }}
                >
                  {sp.tag}
                </span>
              </div>
              <div
                className="font-bold text-sm mb-1 leading-snug"
                style={{ fontFamily: "Syne,sans-serif" }}
              >
                {sp.name}
              </div>
              <div className="text-white/35 text-xs leading-snug">{sp.role}</div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/events" className="btn-outline px-8 py-3 text-sm">
            Buy Ticket →
          </Link>
        </div>
      </section>

      {/* ══════════════════ SCHEDULE ══════════════════ */}
      <section id="schedule" className="py-20 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p
            className="text-yellow-500 text-xs tracking-[.15em] uppercase font-semibold mb-3"
            style={{ fontFamily: "Syne,sans-serif" }}
          >
            Day 1 · August 13
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2
              className="text-4xl md:text-5xl font-bold"
              style={{ fontFamily: "Syne,sans-serif" }}
            >
              Organise your schedule
            </h2>
            <p className="text-white/35 text-sm max-w-xs leading-relaxed">
              Explore our lineup of keynote speakers and industry leaders who
              will inspire and enlighten at the conference.
            </p>
          </div>
        </motion.div>

        <div className="space-y-3">
          {SCHEDULE.map(({ time, title, desc, speakers, tag }, i) => {
            const ts = TAG_STYLE[tag] || TAG_STYLE.talk;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className="glass rounded-xl px-5 py-5 hover:border-yellow-500/20 transition-all duration-300 group"
                style={{ cursor: "default" }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Time */}
                  <div className="flex items-center gap-3 sm:w-44 shrink-0">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: ts.dot }}
                    />
                    <span
                      className="text-xs font-mono text-white/45"
                      style={{ fontFamily: "Syne,sans-serif" }}
                    >
                      {time}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="hidden sm:block w-px h-10 bg-white/[.07] shrink-0" />

                  {/* Title & desc */}
                  <div className="flex-1 min-w-0">
                    <div
                      className="font-semibold text-sm mb-0.5"
                      style={{ fontFamily: "Syne,sans-serif" }}
                    >
                      {title}
                    </div>
                    <div className="text-white/35 text-xs leading-relaxed">
                      {desc}
                    </div>
                  </div>

                  {/* Speakers + tag */}
                  <div className="flex items-center gap-3 shrink-0">
                    {speakers.length > 0 && (
                      <div className="flex -space-x-2">
                        {speakers.map((initials) => {
                          const sp = speakerMap[initials];
                          return (
                            <div
                              key={initials}
                              className="w-7 h-7 rounded-full border-2 border-black flex items-center justify-center text-[10px] font-bold text-black"
                              style={{
                                background: `linear-gradient(135deg, ${sp?.color || "#D4AF37"}, ${sp?.color || "#D4AF37"}88)`,
                                fontFamily: "Syne,sans-serif",
                              }}
                              title={sp?.name}
                            >
                              {initials[0]}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <span
                      className="hidden sm:inline text-[10px] px-3 py-1.5 rounded-full font-semibold"
                      style={{
                        background: ts.bg,
                        color: ts.color,
                        fontFamily: "Syne,sans-serif",
                      }}
                    >
                      {tag}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link to="/events" className="btn-gold px-8 py-3.5 text-sm">
            Buy Ticket →
          </Link>
        </div>
      </section>

      {/* ══════════════════ RESOURCES ══════════════════ */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p
            className="text-yellow-500 text-xs tracking-[.15em] uppercase font-semibold mb-3"
            style={{ fontFamily: "Syne,sans-serif" }}
          >
            Past Events
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2
              className="text-4xl md:text-5xl font-bold"
              style={{ fontFamily: "Syne,sans-serif" }}
            >
              Resources from past conferences
            </h2>
            <p className="text-white/35 text-sm max-w-xs leading-relaxed">
              Explore our lineup of keynote speakers and industry leaders who
              will inspire and enlighten at the conference.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {RESOURCES.map(({ year, topic, img }, i) => (
            <motion.div
              key={year}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="group cursor-pointer"
            >
              <div
                className="w-full h-52 rounded-2xl overflow-hidden mb-4 relative"
                style={{
                  background: "#111",
                  backgroundImage: `url(${img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div
                  className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,.7) 0%, transparent 60%)",
                  }}
                />
                <span
                  className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    fontFamily: "Syne,sans-serif",
                    background: "rgba(0,0,0,.7)",
                    border: "1px solid rgba(212,175,55,.35)",
                    color: "#D4AF37",
                  }}
                >
                  {year}
                </span>
              </div>
              <p
                className="text-white/30 text-xs mb-1"
                style={{ fontFamily: "Syne,sans-serif" }}
              >
                Conference {year}
              </p>
              <h4
                className="font-bold text-base group-hover:text-yellow-400 transition-colors"
                style={{ fontFamily: "Syne,sans-serif" }}
              >
                {topic}
              </h4>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════ PRICING ══════════════════ */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p
            className="text-yellow-500 text-xs tracking-[.15em] uppercase font-semibold mb-3"
            style={{ fontFamily: "Syne,sans-serif" }}
          >
            Tickets
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-3"
            style={{ fontFamily: "Syne,sans-serif" }}
          >
            Pricing for tickets
          </h2>
          <p className="text-white/35 text-base max-w-md mx-auto">
            Explore our lineup of keynote speakers and industry leaders who will
            inspire and enlighten at the conference.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PRICING.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className={`rounded-2xl p-7 flex flex-col relative overflow-hidden ${plan.highlight ? "" : "glass"}`}
              style={
                plan.highlight
                  ? {
                      background:
                        "linear-gradient(135deg, rgba(212,175,55,.14), rgba(200,150,12,.07))",
                      border: "1px solid rgba(212,175,55,.35)",
                    }
                  : {}
              }
            >
              {plan.highlight && (
                <div
                  className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold"
                  style={{
                    background: "rgba(212,175,55,.2)",
                    color: "#D4AF37",
                    fontFamily: "Syne,sans-serif",
                    border: "1px solid rgba(212,175,55,.3)",
                  }}
                >
                  Most Popular
                </div>
              )}
              <div className="text-2xl mb-3">{plan.icon}</div>
              <h3
                className="text-xl font-bold mb-1"
                style={{ fontFamily: "Syne,sans-serif" }}
              >
                {plan.name}
              </h3>
              <p className="text-white/35 text-xs mb-5">{plan.desc}</p>

              <div className="mb-6">
                <span
                  className="text-4xl font-extrabold"
                  style={{
                    fontFamily: "Syne,sans-serif",
                    color: plan.highlight ? "#D4AF37" : "#fff",
                  }}
                >
                  {plan.price}
                </span>
                {plan.price !== "Free" && (
                  <span className="text-white/30 text-sm ml-1">/ ticket</span>
                )}
              </div>

              <div className="space-y-2.5 mb-7 flex-1">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2.5 text-sm">
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px]"
                      style={{
                        background: plan.highlight
                          ? "rgba(212,175,55,.2)"
                          : "rgba(255,255,255,.06)",
                        color: plan.highlight ? "#D4AF37" : "rgba(255,255,255,.5)",
                      }}
                    >
                      ✓
                    </span>
                    <span className="text-white/60">{f}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/events"
                className={`text-center py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${plan.highlight ? "btn-gold" : "btn-outline"}`}
                style={{ fontFamily: "Syne,sans-serif" }}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════ CTA BANNER ══════════════════ */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl p-12 text-center overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg,rgba(212,175,55,.1) 0%,rgba(200,150,12,.05) 100%)",
            border: "1px solid rgba(212,175,55,.2)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 0%,rgba(212,175,55,.15) 0%,transparent 70%)",
            }}
          />
          <div className="relative z-10">
            <p
              className="text-yellow-500 text-xs tracking-[.15em] uppercase font-semibold mb-4"
              style={{ fontFamily: "Syne,sans-serif" }}
            >
              Limited Seats Available
            </p>
            <h2
              className="text-4xl md:text-6xl font-extrabold mb-5"
              style={{
                fontFamily: "Syne,sans-serif",
                letterSpacing: "-0.03em",
              }}
            >
              Ready to join?
            </h2>
            <p className="text-white/40 max-w-md mx-auto mb-9 leading-relaxed">
              Secure your seat before it's gone. Real-time availability tracking
              lets you know exactly how many spots are left for each event.
            </p>
            <Link
              to="/events"
              className="btn-gold px-10 py-4 text-base pulse-gold"
            >
              Browse All Events →
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer
        className="border-t py-14"
        style={{ borderColor: "rgba(255,255,255,.05)" }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-black font-bold text-sm"
                  style={{
                    fontFamily: "Syne,sans-serif",
                    background: "linear-gradient(135deg,#D4AF37,#C8960C)",
                  }}
                >
                  E
                </div>
                <span
                  className="text-xl font-bold"
                  style={{ fontFamily: "Syne,sans-serif" }}
                >
                  Event<span className="text-gold-gradient">Book</span>
                </span>
              </div>
              <p className="text-white/30 text-sm leading-relaxed max-w-xs">
                India's premier tech conference platform. Browse, book, and
                experience unforgettable events live.
              </p>
              <div className="flex gap-3 mt-5">
                {["(888) 123 4567", "info@eventbook.in"].map((c) => (
                  <span
                    key={c}
                    className="text-white/25 text-xs"
                    style={{ fontFamily: "DM Sans,sans-serif" }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <p
                className="text-white/50 text-xs tracking-widest uppercase mb-4"
                style={{ fontFamily: "Syne,sans-serif" }}
              >
                Quick Links
              </p>
              <div className="flex flex-col gap-2.5">
                {[
                  { label: "Events", to: "/events" },
                  { label: "Admin", to: "/admin" },
                  { label: "Schedule", to: "#schedule" },
                ].map(({ label, to }) => (
                  <Link
                    key={label}
                    to={to}
                    className="text-white/30 hover:text-white/70 text-sm transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <p
                className="text-white/50 text-xs tracking-widest uppercase mb-4"
                style={{ fontFamily: "Syne,sans-serif" }}
              >
                Conference
              </p>
              <div className="space-y-2">
                <p className="text-white/30 text-sm">August 13–15, 2025</p>
                <p className="text-white/30 text-sm">Elgin Celina, New Delhi</p>
                <p className="text-white/30 text-sm">India</p>
              </div>
            </div>
          </div>

          <div
            className="pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-3"
            style={{ borderColor: "rgba(255,255,255,.05)" }}
          >
            <span className="text-white/20 text-xs">
              © 2025 Smart Event Booking System. All rights reserved.
            </span>
            <span className="text-white/20 text-xs">
              Built with MERN + MySQL
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
