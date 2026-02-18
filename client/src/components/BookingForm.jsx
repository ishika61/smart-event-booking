// import { useState } from "react";
// import axios from "../api/axios";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";

// export default function BookingForm({ event }) {
//   const [quantity, setQuantity] = useState(1);
//   const [category, setCategory] = useState("Regular");
//   const navigate = useNavigate();

//   const basePrice = event.price;
//   const finalPrice = category === "VIP" ? basePrice * 2 : basePrice;
//   const total = finalPrice * quantity;

//   const handleBooking = async () => {
//     await axios.post("/bookings", {
//       event_id: event.id,
//       name: "User",
//       email: "user@gmail.com",
//       mobile: "9999999999",
//       quantity,
//     });

//     navigate("/success", {
//       state: { total, category, quantity },
//     });
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="mt-6 bg-gray-900 p-6 rounded"
//     >
//       <h2 className="text-2xl mb-4">Book Tickets</h2>

//       <select
//         value={category}
//         onChange={(e) => setCategory(e.target.value)}
//         className="text-black p-2 mb-3 w-full"
//       >
//         <option>Regular</option>
//         <option>VIP</option>
//       </select>

//       <input
//         type="number"
//         min="1"
//         value={quantity}
//         onChange={(e) => setQuantity(Number(e.target.value))}
//         className="text-black p-2 mb-3 w-full"
//       />

//       <p>Price per ticket: ₹{finalPrice}</p>
//       <p className="text-green-400 text-lg">Total: ₹{total}</p>

//       <button
//         onClick={handleBooking}
//         className="bg-green-600 px-4 py-2 mt-4 w-full rounded"
//       >
//         Confirm Booking
//       </button>
//     </motion.div>
//   );
// }


import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  {
    id: "Regular",
    icon: "🎟️",
    label: "Regular",
    mult: 1,
    desc: "General admission to all main sessions",
  },
  {
    id: "VIP",
    icon: "⭐",
    label: "VIP",
    mult: 2,
    desc: "Front-row seating + exclusive networking lounge",
  },
  {
    id: "Premium",
    icon: "💎",
    label: "Premium",
    mult: 3,
    desc: "VIP perks + 1-on-1 speaker access & gift bag",
  },
];

function StepDot({ n, current, done }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-400 ${
          done    ? "bg-yellow-500 text-black" :
          current ? "border-2 border-yellow-500 text-yellow-400" :
                    "border border-white/15 text-white/25"
        }`}
        style={{ fontFamily:'Syne,sans-serif' }}
      >
        {done ? "✓" : n}
      </div>
    </div>
  );
}

export default function BookingForm({ event }) {
  const [step,     setStep]    = useState(1);   // 1 = category, 2 = details, 3 = confirm
  const [category, setCat]     = useState("Regular");
  const [quantity, setQty]     = useState(1);
  const [name,     setName]    = useState("");
  const [email,    setEmail]   = useState("");
  const [mobile,   setMobile]  = useState("");
  const [loading,  setLoading] = useState(false);
  const [error,    setError]   = useState("");
  const navigate = useNavigate();

  const cat         = CATEGORIES.find((c) => c.id === category);
  const unitPrice   = (event.price || 0) * cat.mult;
  const total       = unitPrice * quantity;
  const maxSeats    = event.available_seats || 0;

  const handleBook = async () => {
    if (!name.trim() || !email.trim() || !mobile.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await axios.post("/bookings", {
        event_id: event.id,
        name, email, mobile, quantity,
      });
      navigate("/success", {
        state: { total, category, quantity, name, eventTitle: event.title },
      });
    } catch (e) {
      setError(e.response?.data?.message || "Booking failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,.02)',
        border: '1px solid rgba(255,255,255,.08)',
      }}
    >
      {/* header */}
      <div
        className="px-6 py-5 border-b border-white/[.06]"
        style={{ background:'rgba(212,175,55,.05)' }}
      >
        <h2 className="text-xl font-bold mb-1" style={{ fontFamily:'Syne,sans-serif' }}>
          Book Tickets
        </h2>
        <p className="text-white/35 text-xs">Secure your seat instantly</p>

        {/* step indicators */}
        <div className="flex items-center gap-1.5 mt-4">
          {[1,2,3].map((n) => (
            <div key={n} className="flex items-center gap-1.5">
              <StepDot n={n} current={step===n} done={step>n} />
              {n < 3 && (
                <div className={`flex-1 h-px w-8 transition-colors duration-400 ${step>n ? "bg-yellow-500" : "bg-white/10"}`} />
              )}
            </div>
          ))}
          <div className="ml-2 text-white/30 text-xs">
            {step===1 ? "Choose ticket" : step===2 ? "Your details" : "Confirm"}
          </div>
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">

          {/* ── STEP 1: Category + Quantity ── */}
          {step === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity:0, x:20 }}
              animate={{ opacity:1, x:0 }}
              exit={{ opacity:0, x:-20 }}
              transition={{ duration:.3 }}
              className="space-y-5"
            >
              <div>
                <label className="text-white/40 text-xs uppercase tracking-widest block mb-3">
                  Ticket Category
                </label>
                <div className="space-y-2.5">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCat(c.id)}
                      className={`w-full p-4 rounded-xl text-left border transition-all duration-300 ${
                        category === c.id
                          ? "border-yellow-500/50 bg-yellow-500/[.08]"
                          : "border-white/[.07] hover:border-white/15 hover:bg-white/[.02]"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="flex items-center gap-2">
                          <span>{c.icon}</span>
                          <span
                            className="font-bold text-sm"
                            style={{
                              fontFamily:'Syne,sans-serif',
                              color: category === c.id ? '#D4AF37' : 'white',
                            }}
                          >
                            {c.label}
                          </span>
                        </span>
                        <span
                          className="text-sm font-bold"
                          style={{ fontFamily:'Syne,sans-serif', color:'#D4AF37' }}
                        >
                          ₹{((event.price || 0) * c.mult).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-white/35 text-xs pl-6">{c.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* quantity */}
              <div>
                <label className="text-white/40 text-xs uppercase tracking-widest block mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQty(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-xl border border-white/10 hover:border-yellow-500/30 flex items-center justify-center text-white/60 hover:text-white transition-all text-lg"
                  >−</button>
                  <span
                    className="text-2xl font-bold w-8 text-center"
                    style={{ fontFamily:'Syne,sans-serif' }}
                  >{quantity}</span>
                  <button
                    onClick={() => setQty(Math.min(maxSeats, quantity + 1))}
                    disabled={quantity >= maxSeats}
                    className="w-10 h-10 rounded-xl border border-white/10 hover:border-yellow-500/30 flex items-center justify-center text-white/60 hover:text-white transition-all text-lg disabled:opacity-30"
                  >+</button>
                  <span className="text-white/25 text-xs ml-1">
                    max {maxSeats}
                  </span>
                </div>
              </div>

              {/* price summary */}
              <div
                className="rounded-xl p-4"
                style={{ background:'rgba(212,175,55,.05)', border:'1px solid rgba(212,175,55,.12)' }}
              >
                <div className="flex justify-between text-sm text-white/50 mb-1.5">
                  <span>₹{unitPrice.toLocaleString()} × {quantity} ticket{quantity>1?"s":""}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-white/50 text-sm">Total</span>
                  <span
                    className="text-2xl font-bold text-gold-gradient"
                    style={{ fontFamily:'Syne,sans-serif' }}
                  >₹{total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="btn-gold w-full py-3.5 rounded-xl text-sm"
              >
                Continue →
              </button>
            </motion.div>
          )}

          {/* ── STEP 2: User details ── */}
          {step === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity:0, x:20 }}
              animate={{ opacity:1, x:0 }}
              exit={{ opacity:0, x:-20 }}
              transition={{ duration:.3 }}
              className="space-y-4"
            >
              <div>
                <label className="text-white/40 text-xs uppercase tracking-widest block mb-1.5">Full Name</label>
                <input
                  className="inp"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-white/40 text-xs uppercase tracking-widest block mb-1.5">Email Address</label>
                <input
                  className="inp"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="text-white/40 text-xs uppercase tracking-widest block mb-1.5">Mobile Number</label>
                <input
                  className="inp"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>

              {error && (
                <p className="text-red-400 text-xs px-1">{error}</p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setStep(1)}
                  className="btn-outline flex-1 py-3 rounded-xl text-sm"
                >← Back</button>
                <button
                  onClick={() => {
                    if (!name.trim() || !email.trim() || !mobile.trim()) {
                      setError("Please fill in all fields.");
                    } else {
                      setError("");
                      setStep(3);
                    }
                  }}
                  className="btn-gold flex-[2] py-3 rounded-xl text-sm"
                >
                  Review Order →
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: Confirm ── */}
          {step === 3 && (
            <motion.div
              key="s3"
              initial={{ opacity:0, x:20 }}
              animate={{ opacity:1, x:0 }}
              exit={{ opacity:0, x:-20 }}
              transition={{ duration:.3 }}
              className="space-y-4"
            >
              {/* summary rows */}
              {[
                ["Event",    event.title],
                ["Category", `${cat.icon} ${category}`],
                ["Tickets",  quantity],
                ["Name",     name],
                ["Email",    email],
                ["Mobile",   mobile],
              ].map(([k,v]) => (
                <div key={k} className="flex justify-between text-sm border-b border-white/[.05] pb-3">
                  <span className="text-white/35">{k}</span>
                  <span className="text-white/75 font-medium text-right max-w-[60%] truncate">{v}</span>
                </div>
              ))}

              <div
                className="rounded-xl p-4 flex justify-between items-baseline"
                style={{ background:'rgba(212,175,55,.07)', border:'1px solid rgba(212,175,55,.15)' }}
              >
                <span className="font-bold text-sm" style={{ fontFamily:'Syne,sans-serif' }}>Total Amount</span>
                <span
                  className="text-2xl font-extrabold text-gold-gradient"
                  style={{ fontFamily:'Syne,sans-serif' }}
                >₹{total.toLocaleString()}</span>
              </div>

              {error && <p className="text-red-400 text-xs px-1">{error}</p>}

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setStep(2)}
                  className="btn-outline flex-1 py-3 rounded-xl text-sm"
                >← Back</button>
                <button
                  onClick={handleBook}
                  disabled={loading}
                  className="btn-gold flex-[2] py-3 rounded-xl text-sm disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                      Processing…
                    </span>
                  ) : "✅ Confirm Booking"}
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
