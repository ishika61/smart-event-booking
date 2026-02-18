const db = require("../db");

exports.createBooking = async (req, res) => {
  const { event_id, name, email, mobile, quantity } = req.body;

  const [event] = await db.query(
    "SELECT * FROM events WHERE id=?",
    [event_id]
  );

  if (!event.length) {
    return res.status(404).json({ message: "Event not found" });
  }

  if (event[0].available_seats < quantity) {
    return res.status(400).json({ message: "Not enough seats" });
  }

  const total_amount = quantity * event[0].price;

  await db.query(
    "INSERT INTO bookings (event_id, name, email, mobile, quantity, total_amount) VALUES (?, ?, ?, ?, ?, ?)",
    [event_id, name, email, mobile, quantity, total_amount]
  );

  await db.query(
    "UPDATE events SET available_seats = available_seats - ? WHERE id=?",
    [quantity, event_id]
  );

  const io = req.app.get("io");

  const [updated] = await db.query(
    "SELECT available_seats FROM events WHERE id=?",
    [event_id]
  );

  io.to(`event_${event_id}`).emit("seatUpdated", {
    event_id,
    available_seats: updated[0].available_seats,
  });

  res.json({ message: "Booking successful" });
};
