// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Landing from "./pages/Landing";
// import Events from "./pages/Events";
// import EventDetails from "./pages/EventDetails";
// import Success from "./pages/Success";
// import AdminDashboard from "./pages/AdminDashboard";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Navbar />
//       <Routes>
//         <Route path="/"         element={<Landing />} />
//         <Route path="/events"   element={<Events />} />
//         <Route path="/event/:id" element={<EventDetails />} />
//         <Route path="/success"  element={<Success />} />
//         <Route path="/admin"    element={<AdminDashboard />} />
//       </Routes>
//     </BrowserRouter>
//   );



import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Success from "./pages/Success";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"         element={<Landing />} />
        <Route path="/events"   element={<Events />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/success"  element={<Success />} />
        <Route path="/admin"    element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}


