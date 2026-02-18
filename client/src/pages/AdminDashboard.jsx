import { useEffect, useState } from "react";
import axios from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";

/* ─── helpers ───────────────────────────────── */
const EMPTY_FORM = {
  title:"", description:"", location:"", date:"",
  total_seats:"", price:"", image:"",
};

function Input({ label, type="text", placeholder, value, onChange, required }) {
  return (
    <div>
      <label className="text-white/40 text-xs uppercase tracking-widest block mb-1.5">
        {label}{required && <span className="text-yellow-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        className="inp"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}

/* ─── Login modal ───────────────────────────── */
function LoginModal({ onLogin }) {
  const [email,    setEmail]    = useState("admin@gmail.com");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const submit = async () => {
    setLoading(true); setError("");
    try {
      const r = await axios.post("/admin/login", { email, password });
      localStorage.setItem("adminToken", r.data.token);
      onLogin(r.data.token);
    } catch {
      setError("Invalid credentials. Try admin@gmail.com / admin123");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 hero-bg">
      <motion.div
        initial={{ opacity:0, y:28 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:.65 }}
        className="glass rounded-3xl p-8 w-full max-w-sm"
        style={{ borderColor:'rgba(212,175,55,.2)' }}
      >
        <div
          className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-black font-bold text-lg mb-5"
          style={{ background:'linear-gradient(135deg,#D4AF37,#C8960C)', fontFamily:'Syne,sans-serif' }}
        >A</div>
        <h2 className="text-2xl font-bold text-center mb-1" style={{ fontFamily:'Syne,sans-serif' }}>Admin Login</h2>
        <p className="text-white/35 text-xs text-center mb-7">Sign in to manage events</p>

        <div className="space-y-4">
          <Input label="Email"    type="email"    value={email}    onChange={e=>setEmail(e.target.value)}    placeholder="admin@gmail.com" />
          <Input label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
        </div>

        {error && <p className="text-red-400 text-xs mt-3 px-1">{error}</p>}

        <button
          onClick={submit}
          disabled={loading}
          className="btn-gold w-full mt-5 py-3.5 rounded-xl text-sm disabled:opacity-60"
        >
          {loading
            ? <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin"/>
                Signing in…
              </span>
            : "Sign in →"}
        </button>
      </motion.div>
    </div>
  );
}

/* ─── Event form modal ──────────────────────── */
function EventModal({ initial, onSave, onClose }) {
  const [form,    setForm]    = useState(initial || EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const isEdit = !!initial?.id;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.title || !form.location || !form.date || !form.price || !form.total_seats) {
      setError("Title, location, date, price and seats are required."); return;
    }
    setLoading(true); setError("");
    try {
      if (isEdit) {
        await axios.put(`/events/${initial.id}`, form);
      } else {
        await axios.post("/events", form);
      }
      onSave();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to save event.");
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={(e)=>{ if(e.target===e.currentTarget) onClose(); }}>
      <motion.div
        initial={{ opacity:0, scale:.95, y:20 }}
        animate={{ opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:.95, y:20 }}
        transition={{ duration:.3 }}
        className="glass rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-7 m-4"
        style={{ borderColor:'rgba(212,175,55,.2)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold" style={{ fontFamily:'Syne,sans-serif' }}>
            {isEdit ? "Edit Event" : "Create New Event"}
          </h3>
          <button onClick={onClose} className="text-white/30 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-all">✕</button>
        </div>

        <div className="space-y-4">
          <Input label="Title *"       value={form.title}       onChange={set("title")}       placeholder="Event title" />
          <Input label="Location *"    value={form.location}    onChange={set("location")}    placeholder="City, Venue" />
          {/* <Input label="Date *"        type="datetime-local"    value={form.date}             onChange={set("date")} /> */}
          <div>
  <label className="text-white/40 text-xs uppercase tracking-widest block mb-1.5">
    Date *
  </label>
  <input
    type="datetime-local"
    className="inp"
    value={form.date}
    onChange={(e) =>
      setForm((f) => ({
        ...f,
        date: e.target.value,
      }))
    }
  />
</div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Price (₹) *"       type="number" value={form.price}       onChange={set("price")}       placeholder="500" />
            <Input label="Total Seats *"     type="number" value={form.total_seats} onChange={set("total_seats")} placeholder="100" />
          </div>
          <div>
            <label className="text-white/40 text-xs uppercase tracking-widest block mb-1.5">Description</label>
            <textarea
              className="inp resize-none"
              rows={3}
              placeholder="Brief description of the event…"
              value={form.description}
              onChange={set("description")}
            />
          </div>
          <Input label="Image URL" value={form.image} onChange={set("image")} placeholder="https://…" />
        </div>

        {error && <p className="text-red-400 text-xs mt-3 px-1">{error}</p>}

        <div className="flex gap-3 mt-6">
          <button onClick={onClose}  className="btn-outline flex-1 py-3 rounded-xl text-sm">Cancel</button>
          <button onClick={submit} disabled={loading} className="btn-gold flex-[2] py-3 rounded-xl text-sm disabled:opacity-60">
            {loading
              ? <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin"/>
                  Saving…
                </span>
              : isEdit ? "Save Changes" : "Create Event ✅"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Main Dashboard ────────────────────────── */
export default function AdminDashboard() {
  const [token,   setToken]   = useState(() => localStorage.getItem("adminToken") || "");
  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(null); // null | "create" | eventObj (for edit)
  const [delId,   setDelId]   = useState(null);
  const [search,  setSearch]  = useState("");
  const [toastMsg,setToast]   = useState("");

  const toast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const r = await axios.get("/events");
      setEvents(r.data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { if (token) fetchEvents(); }, [token]);

  const deleteEvent = async (id) => {
    try {
      await axios.delete(`/events/${id}`);
      setDelId(null);
      toast("Event deleted successfully.");
      fetchEvents();
    } catch { toast("Failed to delete event."); }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setToken("");
  };

  if (!token) return <LoginModal onLogin={setToken} />;

  const filtered = events.filter((e) =>
    e.title?.toLowerCase().includes(search.toLowerCase()) ||
    e.location?.toLowerCase().includes(search.toLowerCase())
  );

  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"2-digit" }) : "—";

  const pct = (e) => e.total_seats > 0 ? Math.round((e.available_seats/e.total_seats)*100) : 0;

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10"
        >
          <div>
            <p className="text-yellow-500 text-xs tracking-[.15em] uppercase font-semibold mb-2">Admin Panel</p>
            <h1 className="text-4xl md:text-5xl font-extrabold" style={{ fontFamily:'Syne,sans-serif', letterSpacing:'-0.02em' }}>
              Dashboard
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setModal("create")}
              className="btn-gold px-5 py-2.5 text-sm rounded-xl"
            >
              + New Event
            </button>
            <button onClick={logout} className="btn-outline px-5 py-2.5 text-sm rounded-xl">
              Logout
            </button>
          </div>
        </motion.div>

        {/* ── Stats row ── */}
        <motion.div
          initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label:"Total Events",    val: events.length },
            { label:"Total Seats",     val: events.reduce((s,e)=>s+(e.total_seats||0),0).toLocaleString() },
            { label:"Available Seats", val: events.reduce((s,e)=>s+(e.available_seats||0),0).toLocaleString() },
            { label:"Booked Seats",    val: events.reduce((s,e)=>s+((e.total_seats||0)-(e.available_seats||0)),0).toLocaleString() },
          ].map(({ label, val }) => (
            <div key={label} className="glass rounded-2xl p-5 text-center">
              <div className="text-2xl md:text-3xl font-extrabold text-gold-gradient mb-1" style={{ fontFamily:'Syne,sans-serif' }}>{val}</div>
              <div className="text-white/35 text-xs">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* ── Search ── */}
        <div className="glass rounded-2xl p-3 mb-5 flex gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="inp pl-10"
              placeholder="Search events…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button onClick={fetchEvents}
            className="px-4 py-2.5 rounded-xl text-sm border border-white/10 hover:border-yellow-500/25 text-white/50 hover:text-white transition-all">
            Refresh
          </button>
        </div>

        {/* ── Table ── */}
        <motion.div
          initial={{ opacity:0 }} animate={{ opacity:1 }}
          transition={{ delay:.18 }}
          className="glass rounded-2xl overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 rounded-full border-2 border-yellow-500/30 border-t-yellow-400 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-white/30">
              <div className="text-4xl mb-3 opacity-30">📭</div>
              <p>{search ? "No events match your search" : "No events yet. Create one!"}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table w-full">
                <thead>
                  <tr>
                    <th className="text-left">Title</th>
                    <th className="text-left hidden md:table-cell">Location</th>
                    <th className="text-left hidden sm:table-cell">Date</th>
                    <th className="text-right">Price</th>
                    <th className="text-center hidden lg:table-cell">Availability</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((event) => (
                    <tr key={event.id}>
                      <td className="font-medium text-white/85 max-w-[180px] truncate" style={{ fontFamily:'Syne,sans-serif' }}>
                        {event.title}
                      </td>
                      <td className="hidden md:table-cell">
                        <div className="flex items-center gap-1.5 text-white/45">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                          </svg>
                          {event.location}
                        </div>
                      </td>
                      <td className="hidden sm:table-cell text-white/45">{fmt(event.date)}</td>
                      <td className="text-right">
                        <span className="text-yellow-500 font-semibold text-sm" style={{ fontFamily:'Syne,sans-serif' }}>
                          ₹{event.price?.toLocaleString()}
                        </span>
                      </td>
                      <td className="hidden lg:table-cell">
                        <div className="flex items-center gap-2 px-2">
                          <div className="flex-1 h-1 rounded-full bg-white/[.06] overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width:`${pct(event)}%`,
                                background: pct(event)>50?"#4ade80": pct(event)>20?"#facc15":"#f87171"
                              }}
                            />
                          </div>
                          <span className="text-xs text-white/35 w-16 text-right">
                            {event.available_seats}/{event.total_seats}
                          </span>
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setModal(event)}
                            className="px-3 py-1.5 rounded-lg text-xs border border-white/10 hover:border-yellow-500/30 hover:text-yellow-400 transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDelId(event.id)}
                            className="px-3 py-1.5 rounded-lg text-xs border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        <p className="text-white/20 text-xs mt-4 text-right">
          {filtered.length} event{filtered.length!==1?"s":""} shown
        </p>
      </div>

      {/* ── Create / Edit modal ── */}
      <AnimatePresence>
        {modal && (
          <EventModal
            initial={modal === "create" ? null : modal}
            onSave={() => { setModal(null); toast(modal==="create"?"Event created!":"Event updated!"); fetchEvents(); }}
            onClose={() => setModal(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Delete confirm ── */}
      <AnimatePresence>
        {delId && (
          <div className="modal-overlay">
            <motion.div
              initial={{ opacity:0, scale:.9 }}
              animate={{ opacity:1, scale:1 }}
              exit={{ opacity:0, scale:.9 }}
              className="glass rounded-3xl p-8 max-w-sm w-full m-4 text-center"
              style={{ borderColor:'rgba(239,68,68,.2)' }}
            >
              <div className="text-4xl mb-4">🗑️</div>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily:'Syne,sans-serif' }}>Delete Event?</h3>
              <p className="text-white/40 text-sm mb-7">
                This will permanently delete the event and all related bookings. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDelId(null)} className="btn-outline flex-1 py-3 rounded-xl text-sm">Cancel</button>
                <button onClick={() => deleteEvent(delId)} className="flex-1 py-3 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-500 transition-colors text-white" style={{ fontFamily:'Syne,sans-serif' }}>
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity:0, y:20 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:20 }}
            className="fixed bottom-8 right-8 z-[200] px-5 py-3 rounded-xl text-sm font-semibold"
            style={{
              fontFamily:'Syne,sans-serif',
              background:'linear-gradient(135deg,#D4AF37,#C8960C)',
              color:'#000',
              boxShadow:'0 8px 30px rgba(212,175,55,.4)',
            }}
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}




