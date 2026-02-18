const db = require("../db");

exports.createEvent = async (req, res) => {
  const { title, description, location, date, total_seats, price, image } = req.body;

  await db.query(
    "INSERT INTO events (title, description, location, date, total_seats, available_seats, price, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [title, description, location, date, total_seats, total_seats, price, image]
  );

  res.json({ message: "Event created" });
};

exports.getEvents = async (req, res) => {
  const { location, date } = req.query;

  let query = "SELECT * FROM events WHERE 1=1";
  let values = [];

  if (location) {
    query += " AND location LIKE ?";
    values.push(`%${location}%`);
  }

  if (date) {
    query += " AND DATE(date)=?";
    values.push(date);
  }

  const [rows] = await db.query(query, values);
  res.json(rows);
};

exports.getEventById = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM events WHERE id=?", [req.params.id]);
  res.json(rows[0]);
};

exports.updateEvent = async (req, res) => {
  const { title, description, location, date, total_seats, price, image } = req.body;

  await db.query(
    "UPDATE events SET title=?, description=?, location=?, date=?, total_seats=?, price=?, image=? WHERE id=?",
    [title, description, location, date, total_seats, price, image, req.params.id]
  );

  res.json({ message: "Event updated" });
};

exports.deleteEvent = async (req, res) => {
  await db.query("DELETE FROM events WHERE id=?", [req.params.id]);
  res.json({ message: "Event deleted" });
};
