# 🎟 Smart Event Booking System

A full-stack Event Booking Web Application built using:

- ⚛ React (Vite)
- 🟢 Node.js + Express
- 🗄 MySQL (Railway)
- ☁ Render Deployment
- 🔐 JWT Authentication
- 🔄 Real-time Seat Locking (WebSocket)

---


---

# 📁 Project Structure

smart-event-booking/
│
├── client/ → React Frontend (Vite)
└── server/ → Node.js Backend



---

# ⚙️ Local Setup Instructions

---

## 🔹 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/smart-event-booking.git
cd smart-event-booking
```

 2️⃣ Backend Setup
 ```
cd server
npm install
```


2️⃣ Backend Setup
cd server
npm install


Create .env file inside server/:
```

PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=event_booking
DB_PORT=3306

JWT_SECRET=supersecretkey123
JWT_EXPIRES=1h
```

Start backend:
```
npm start
```

Backend runs at:
```
http://localhost:5000
```

3️⃣ Frontend Setup

Open new terminal:
```
cd client
npm install
npm run dev
```

Frontend runs at:
```
http://localhost:5173
```

🗄 Database Setup (MySQL)
🔹 Option 1 — Local MySQL

Create database:

CREATE DATABASE event_booking;
Use this database and run:
````
CREATE TABLE events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255) NOT NULL,
  date DATETIME NOT NULL,
  total_seats INT NOT NULL,
  available_seats INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image VARCHAR(500)
);

CREATE TABLE bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  quantity INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  status ENUM('confirmed','cancelled') DEFAULT 'confirmed',
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);
````
🔹 Option 2 — Railway Cloud MySQL (Production)
````
Go to https://railway.app

Create new project
Add MySQL service
Copy MYSQL_URL
````
In Render → Backend → Environment Variables add:
````
PORT=10000
NODE_ENV=production
DATABASE_URL=<paste MYSQL_URL here>
JWT_SECRET=supersecretkey123
JWT_EXPIRES=1h
````
🌐 Deployment (Render)
🔹 Deploy Backend

Create Web Service in Render
Root Directory: server
Build Command:
```
npm install
```

Start Command:
```
npm start

```
Add environment variables as shown above.

🔹 Deploy Frontend

Create Static Site in Render

Root Directory: 
```
client
````
Build Command:
```````
npm install && npm run build
````````

Publish Directory:

dist

🔐 Admin Login

Default credentials:
````
Email: admin@gmail.com
Password: admin123
````
🔄 Features
- Admin Login
- Create / Edit / Delete Events
- Search Events
- Book Tickets
- Real-time Seat Availability
- JWT Authentication
- Responsive Design

Progressive Web App Support

📱 Responsive & PWA

To build production version:
```
cd client
npm run build
```
🛠 Tech Stack

Frontend:
React
Vite
Tailwind CSS
Axios
Socket.io Client

Backend:
Node.js
Express
MySQL2
JWT
Socket.io
Database:


MySQL (Railway)

👩‍💻 Author

Ishika Savita
B.Tech Electrical Engineering
Full Stack Developer


---

