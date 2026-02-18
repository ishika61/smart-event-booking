import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setOpen(false), [loc.pathname]);

  const links = [
    { label: "Events", to: "/events" },
    { label: "Admin", to: "/admin" },
  ];

  const active = (path) => loc.pathname === path;

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "py-3 bg-black/90 backdrop-blur-xl border-b border-white/[.06]"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-3 group">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-black font-bold text-sm transition-transform duration-300 group-hover:scale-110"
              style={{
                fontFamily: "Syne,sans-serif",
                background: "linear-gradient(135deg,#D4AF37,#C8960C)",
              }}
            >
              E
            </div>
            <span
              className="text-xl font-bold tracking-tight"
              style={{ fontFamily: "Syne,sans-serif" }}
            >
              Event<span className="text-gold-gradient">Book</span>
            </span>
          </Link>

          {/* ── Contact info (desktop) ── */}
          <div className="hidden lg:flex items-center gap-6 text-white/35 text-xs">
            <span>(888) 123 4567</span>
            <span>info@eventbook.in</span>
          </div>

          {/* ── Desktop nav ── */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={`relative text-sm font-medium tracking-wide transition-colors duration-300 group ${
                  active(to) ? "text-yellow-400" : "text-white/55 hover:text-white"
                }`}
              >
                {label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-yellow-400 transition-all duration-300 ${
                    active(to) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
            <Link to="/events" className="btn-gold px-5 py-2 text-sm">
              Buy Ticket →
            </Link>
          </div>

          {/* ── Hamburger ── */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`block h-0.5 bg-white transition-all duration-300 ${
                  i === 0
                    ? `w-6 ${open ? "rotate-45 translate-y-2" : ""}`
                    : i === 1
                    ? `w-4 ml-auto ${open ? "opacity-0" : ""}`
                    : `w-6 ${open ? "-rotate-45 -translate-y-2" : ""}`
                }`}
              />
            ))}
          </button>
        </div>

        {/* ── Mobile menu ── */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="md:hidden overflow-hidden bg-black/95 backdrop-blur-xl border-t border-white/[.05]"
            >
              <div className="px-6 py-5 flex flex-col gap-4">
                <div className="text-white/25 text-xs mb-1">
                  (888) 123 4567 · info@eventbook.in
                </div>
                {links.map(({ label, to }) => (
                  <Link
                    key={to}
                    to={to}
                    className="text-white/60 hover:text-white text-sm font-medium py-1.5 border-b border-white/[.04] transition-colors"
                  >
                    {label}
                  </Link>
                ))}
                <Link to="/events" className="btn-gold px-6 py-3 text-sm mt-2">
                  Buy Ticket →
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
