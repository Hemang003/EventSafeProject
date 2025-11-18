// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import CreateEvent from "./pages/CreateEvent.jsx";

import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import EventsList from "./pages/EventsList.jsx";
import EventBooking from "./pages/EventBooking.jsx";
import Confirmed from "./pages/Confirmed.jsx";

export default function App() {
  return (
    <Routes>
      {/* ✅ Auth pages – no Layout, no header */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* ✅ Main app – wrapped in Layout (shows header) */}
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/events" replace />} />
        <Route element={<ProtectedRoute />}>
        <Route path="/events" element={<EventsList />} />
        <Route path="/events/:id" element={<EventBooking />} />
        <Route path="/events/create" element={<CreateEvent />} />  {/* NEW */}
        <Route path="/confirmed" element={<Confirmed />} />
      </Route>

      </Route>

      {/* Fallback */}
      <Route path="*" element={<p>Not found</p>} />
    </Routes>
  );
}
// import { Routes, Route, Navigate } from "react-router-dom";
// import Layout from "./Layout";
// import ProtectedRoute from "./ProtectedRoute";
// import Signup from "./pages/Signup";
// import Login from "./pages/Login";
// import EventsList from "./pages/EventsList";
// import EventBooking from "./pages/EventBooking";
// import Confirmed from "./pages/Confirmed";


// export default function App() {
//   return (
//     <Layout>
//       <Routes>
//         <Route path="/" element={<Navigate to="/events" replace />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/login" element={<Login />} />

//         <Route element={<ProtectedRoute />}>
//           <Route path="/events" element={<EventsList />} />
//           <Route path="/events/:id" element={<EventBooking />} />
//           <Route path="/confirmed" element={<Confirmed />} />
//         </Route>

//         <Route path="*" element={<p>Not found</p>} />
//       </Routes>
//     </Layout>
//   );
// }
