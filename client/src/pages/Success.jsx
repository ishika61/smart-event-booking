// import Confetti from "react-confetti";
// import { useLocation } from "react-router-dom";
// import { QRCodeCanvas } from "qrcode.react";
// import { saveAs } from "file-saver";
// import { useRef } from "react";

// export default function Success() {
//   const location = useLocation();
//   const { total, category, quantity } = location.state || {};
//   const qrRef = useRef();

//   const downloadQR = () => {
//     const canvas = qrRef.current.querySelector("canvas");
//     const image = canvas.toDataURL("image/png");
//     saveAs(image, "ticket.png");
//   };

//   return (
//     <div className="h-screen flex flex-col items-center justify-center">
//       <Confetti />

//       <h1 className="text-4xl mb-4">Booking Successful 🎉</h1>

//       <p>Category: {category}</p>
//       <p>Tickets: {quantity}</p>
//       <p>Total Paid: ₹{total}</p>

//       <div ref={qrRef} className="mt-4">
//         <QRCodeCanvas value={`Paid ₹${total}`} />
//       </div>

//       <button
//         onClick={downloadQR}
//         className="bg-blue-600 px-4 py-2 mt-4"
//       >
//         Download Ticket
//       </button>
//     </div>
//   );
// }


import Confetti from "react-confetti";
import { useLocation, Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { saveAs } from "file-saver";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Success() {
  const location = useLocation();
  const { total, category, quantity, name, eventTitle } = location.state || {};
  const qrRef   = useRef();
  const [dims, setDims] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [showConf, setShowConf] = useState(true);

  useEffect(() => {
    const onResize = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    const t = setTimeout(() => setShowConf(false), 6000);
    return () => { window.removeEventListener("resize", onResize); clearTimeout(t); };
  }, []);

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    canvas.toBlob((blob) => saveAs(blob, `ticket-${eventTitle || "event"}.png`));
  };

  const qrData = JSON.stringify({
    event: eventTitle,
    name, category, quantity,
    total: `₹${total}`,
    bookedAt: new Date().toISOString(),
  });

  const items = [
    ["Event",    eventTitle || "N/A"],
    ["Name",     name       || "Guest"],
    ["Category", category   || "Regular"],
    ["Tickets",  quantity   || 1],
    ["Total",    `₹${(total || 0).toLocaleString()}`],
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16 hero-bg relative overflow-hidden">

      {/* Confetti */}
      {showConf && (
        <Confetti
          width={dims.w}
          height={dims.h}
          recycle={false}
          numberOfPieces={350}
          colors={["#D4AF37","#F0D060","#C8960C","#fff","#facc15"]}
        />
      )}

      {/* glowing circle */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <motion.div
        initial={{ opacity:0, scale:.94, y:30 }}
        animate={{ opacity:1, scale:1,   y:0 }}
        transition={{ duration:.75, ease:[.16,1,.3,1] }}
        className="relative z-10 glass rounded-3xl p-8 md:p-12 max-w-md w-full text-center"
        style={{ borderColor:'rgba(212,175,55,.18)' }}
      >
        {/* tick animation */}
        <motion.div
          initial={{ scale:0 }}
          animate={{ scale:1 }}
          transition={{ delay:.2, type:"spring", stiffness:200, damping:15 }}
          className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6"
          style={{ background:'linear-gradient(135deg,#D4AF37,#C8960C)' }}
        >
          <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </motion.div>

        <motion.h1
          initial={{ opacity:0, y:16 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:.35, duration:.55 }}
          className="text-3xl md:text-4xl font-extrabold mb-1"
          style={{ fontFamily:'Syne,sans-serif' }}
        >
          Booking Confirmed!
        </motion.h1>

        <motion.p
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ delay:.5 }}
          className="text-white/40 text-sm mb-8"
        >
          Your e-ticket is ready. Download the QR code below.
        </motion.p>

        {/* details */}
        <motion.div
          initial={{ opacity:0, y:12 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:.55 }}
          className="text-left space-y-2.5 mb-8 rounded-2xl p-5"
          style={{ background:'rgba(212,175,55,.04)', border:'1px solid rgba(212,175,55,.12)' }}
        >
          {items.map(([k,v]) => (
            <div key={k} className="flex justify-between text-sm">
              <span className="text-white/35">{k}</span>
              <span className="text-white/80 font-semibold truncate max-w-[55%] text-right">{v}</span>
            </div>
          ))}
        </motion.div>

        {/* QR Code */}
        <motion.div
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ delay:.7 }}
          className="flex flex-col items-center gap-4"
        >
          <p className="text-white/30 text-xs tracking-widest uppercase">Your QR Ticket</p>
          <div
            ref={qrRef}
            className="p-3 rounded-2xl"
            style={{ background:'white' }}
          >
            <QRCodeCanvas
              value={qrData}
              size={160}
              bgColor="#ffffff"
              fgColor="#080808"
              level="H"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
            <button
              onClick={downloadQR}
              className="btn-gold flex-1 py-3 rounded-xl text-sm"
            >
              ⬇️ Download Ticket
            </button>
            <Link
              to="/events"
              className="btn-outline flex-1 py-3 rounded-xl text-sm text-center"
            >
              Browse More →
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
