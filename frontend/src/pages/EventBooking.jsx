// src/pages/EventBooking.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getEventById,
  listEvents,
  lockSeats,
  confirmBooking,
  API_BASE,
} from "../api";
import { useAuth } from "../auth";

export default function EventBooking() {
  const { id } = useParams();
  const nav = useNavigate();
  const { token } = useAuth();

  const [event, setEvent] = useState(null);
  const [related, setRelated] = useState([]);
  const [seats, setSeats] = useState(1);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  // --------------------------------------------------
  // 1) LOAD MAIN EVENT
  // --------------------------------------------------
  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        const e = await getEventById(id);
        console.log("Loaded event", e);
        setEvent(e || null);
      } catch (err) {
        console.error("Error loading event by id", err);
        setMsg("Failed to load event.");
        setEvent(null);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadEvent();
  }, [id]);

  // --------------------------------------------------
  // 2) LOAD RELATED (SAME CATEGORY)
  // --------------------------------------------------
  useEffect(() => {
    async function loadRelated() {
      if (!event || !event.category) {
        setRelated([]);
        return;
      }

      try {
        const all = await listEvents();
        const mainCategory = String(event.category).toLowerCase();

        const sameCategory = all.filter((ev) => {
          if (!ev || !ev.category) return false;
          const cat = String(ev.category).toLowerCase();
          return ev.id !== event.id && cat === mainCategory;
        });

        console.log("Related events:", sameCategory);
        setRelated(sameCategory.slice(0, 6)); // show up to 6
      } catch (err) {
        console.error("Failed to load related events", err);
        setRelated([]);
      }
    }

    loadRelated();
  }, [event]);

  // --------------------------------------------------
  // HELPERS
  // --------------------------------------------------
  function formatDate(value) {
    if (!value) return "";
    const d = new Date(value);
    return d.toLocaleString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const posterUrl =
    event && event.image_url
      ? `${API_BASE}${event.image_url}`
      : "/placeholder-poster.png";

  const availableSeats = event?.available_seats ?? 0;

  // --------------------------------------------------
  // ACTIONS
  // --------------------------------------------------
  async function handleLock() {
    if (!token) {
      setMsg("Please log in to lock seats.");
      nav("/login");
      return;
    }
    try {
      setMsg("Locking your seats...");
      const seatCount = Number(seats) || 1;
      const res = await lockSeats(token, Number(id), seatCount);
      console.log("Lock seats response", res);
      setMsg(res.message || "Seats locked successfully.");
    } catch (err) {
      console.error("Lock seats error", err);
      setMsg("Failed to lock seats. Please try again.");
    }
  }

  async function handleConfirm() {
    if (!token) {
      setMsg("Please log in to book tickets.");
      nav("/login");
      return;
    }
    try {
      setMsg("Confirming your booking...");
      const res = await confirmBooking(token, Number(id));
      console.log("Confirm booking response", res);
      setMsg(res.message || "Booking confirmed!");
      setTimeout(() => nav("/confirmed"), 800);
    } catch (err) {
      console.error("Confirm booking error", err);
      setMsg("Failed to confirm booking. Please try again.");
    }
  }

  // --------------------------------------------------
  // RENDER STATES
  // --------------------------------------------------
  if (loading) return <p style={{ padding: 24 }}>Loading event...</p>;
  if (!event) return <p style={{ padding: 24 }}>Event not found.</p>;

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <div className="event-page">
      {/* ================== HERO SECTION ================== */}
      <section className="event-hero-wrapper">
        <div className="event-hero">
          <div
            className="event-hero-bg"
            style={{ backgroundImage: `url(${posterUrl})` }}
          />
          <div className="event-hero-gradient" />

          <div className="bms-container event-hero-content">
            <div className="event-hero-grid">
              {/* Poster card */}
              <div className="event-hero-poster-card">
                <img
                  src={posterUrl}
                  alt={event.title}
                  className="event-hero-poster"
                />
                <div className="event-hero-poster-footer">In {event.venue}</div>
              </div>

              {/* Info col */}
              <div className="event-hero-info">
                <h1 className="event-title">{event.title}</h1>

                <div className="event-meta-main">
                  <div className="event-meta-line">
                    {event.city && event.country && (
                      <span>
                        {event.city}, {event.country}
                      </span>
                    )}
                    {event.language && (
                      <>
                        {" "}
                        • <span>{event.language}</span>
                      </>
                    )}
                    {event.category && (
                      <>
                        {" "}
                        • <span>{event.category}</span>
                      </>
                    )}
                  </div>

                  <div className="event-meta-line">
                    {event.date && <span>On {formatDate(event.date)}</span>}
                    {event.organizer && (
                      <>
                        {" "}
                        • <span>By {event.organizer}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Booking box */}
                <div className="event-book-box">
                  <div className="event-seats-control">
                    <span className="event-seats-label">Number of seats</span>
                    <input
                      type="number"
                      min="1"
                      max={availableSeats || undefined}
                      value={seats}
                      onChange={(e) => setSeats(e.target.value)}
                      className="event-seats-input"
                    />
                    {event.price != null && (
                      <span className="event-price-note">
                        ₹{event.price.toFixed(2)} per seat •{" "}
                        {availableSeats} seats left
                      </span>
                    )}
                  </div>

                  <div className="event-book-actions">
                    <button
                      className="event-lock-btn"
                      onClick={handleLock}
                      disabled={!availableSeats}
                    >
                      Lock seats
                    </button>
                    <button
                      className="event-book-btn"
                      onClick={handleConfirm}
                      disabled={!availableSeats}
                    >
                      Book tickets
                    </button>
                  </div>
                </div>

                {msg && <p className="event-msg">{msg}</p>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================== BODY: ABOUT + RELATED ================== */}
      <section className="event-body-shell">
        <div className="bms-container event-body">
          {/* About the event */}
          <div className="event-about">
            <h2>About the event</h2>
            <p>{event.description || "No description available."}</p>
          </div>

          {/* You may also like */}
          {related.length > 0 && (
            <div className="event-related">
              <h2>You may also like</h2>
              <div className="bms-cards-row">
                {related.map((ev) => {
                  const rPoster = ev.image_url
                    ? `${API_BASE}${ev.image_url}`
                    : "/placeholder-poster.png";

                  return (
                    <Link
                      key={ev.id}
                      to={`/events/${ev.id}`}
                      className="bms-card"
                    >
                      <img
                        src={rPoster}
                        alt={ev.title}
                        className="bms-card-img"
                      />
                      <div className="bms-card-info">
                        <h3>{ev.title}</h3>
                        <p>{ev.venue}</p>
                        <p className="date">
                          {ev.date ? formatDate(ev.date) : ""}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ================== FOOTER ================== */}
      <footer className="event-footer">
        © {new Date().getFullYear()} myEvents • Inspired by BookMyShow
      </footer>
    </div>
  );
}
// // src/pages/EventBooking.jsx
// import { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import {
//   getEventById,
//   listEvents,
//   lockSeats,
//   confirmBooking,
//   API_BASE,
// } from "../api";
// import { useAuth } from "../auth";

// export default function EventBooking() {
//   const { id } = useParams();
//   const nav = useNavigate();
//   const { token } = useAuth();

//   const [event, setEvent] = useState(null);
//   const [related, setRelated] = useState([]);
//   const [seats, setSeats] = useState(1);
//   const [msg, setMsg] = useState("");
//   const [loading, setLoading] = useState(true);

//   // --- Load main event ---
//   useEffect(() => {
//     async function loadEvent() {
//       try {
//         const e = await getEventById(id);
//         setEvent(e || null);
//       } catch (err) {
//         console.error(err);
//         setMsg("Failed to load event.");
//       } finally {
//         setLoading(false);
//       }
//     }
//     loadEvent();
//   }, [id]);

//   // --- Load related events (same category) ---
//   useEffect(() => {
//     async function loadRelated() {
//       if (!event || !event.category) return;
//       try {
//         const all = await listEvents();
//         const sameCategory = all.filter(
//           (e) =>
//             e.id !== event.id &&
//             e.category &&
//             e.category.toLowerCase() === event.category.toLowerCase()
//         );
//         setRelated(sameCategory.slice(0, 6)); // show few events only
//       } catch (err) {
//         console.error("Failed to load related events", err);
//       }
//     }
//     loadRelated();
//   }, [event]);

//   function formatDate(value) {
//     if (!value) return "";
//     const d = new Date(value);
//     return d.toLocaleString(undefined, {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   }

//   const posterUrl =
//     event && event.image_url
//       ? `${API_BASE}${event.image_url}`
//       : "/placeholder-poster.png";

//   // --- Actions ---

//   async function handleLock() {
//     if (!token) {
//       setMsg("Please log in to lock seats.");
//       nav("/login");
//       return;
//     }
//     try {
//       setMsg("Locking your seats...");
//       const res = await lockSeats(token, Number(id), Number(seats));
//       setMsg(res.message || "Seats locked successfully.");
//     } catch (err) {
//       console.error(err);
//       setMsg("Failed to lock seats. Please try again.");
//     }
//   }

//   async function handleConfirm() {
//     if (!token) {
//       setMsg("Please log in to book tickets.");
//       nav("/login");
//       return;
//     }
//     try {
//       setMsg("Confirming your booking...");
//       const res = await confirmBooking(token, Number(id));
//       setMsg(res.message || "Booking confirmed!");
//       setTimeout(() => nav("/confirmed"), 800);
//     } catch (err) {
//       console.error(err);
//       setMsg("Failed to confirm booking. Please try again.");
//     }
//   }

//   if (loading) return <p style={{ padding: 24 }}>Loading event...</p>;
//   if (!event) return <p style={{ padding: 24 }}>Event not found.</p>;

//   return (
//     <div className="event-page">
//       {/* ===== HERO SECTION ===== */}
//       <section className="event-hero-wrapper">
//         <div className="event-hero">
//           <div
//             className="event-hero-bg"
//             style={{ backgroundImage: `url(${posterUrl})` }}
//           />
//           <div className="event-hero-gradient" />

//           <div className="bms-container event-hero-content">
//             <div className="event-hero-grid">
//               {/* Poster card */}
//               <div className="event-hero-poster-card">
//                 <img
//                   src={posterUrl}
//                   alt={event.title}
//                   className="event-hero-poster"
//                 />
//                 <div className="event-hero-poster-footer">In {event.venue}</div>
//               </div>

//               {/* Info column */}
//               <div className="event-hero-info">
//                 <h1 className="event-title">{event.title}</h1>

//                 <div className="event-meta-main">
//                   <div className="event-meta-line">
//                     {event.city && event.country && (
//                       <span>
//                         {event.city}, {event.country}
//                       </span>
//                     )}
//                     {event.language && (
//                       <>
//                         {" "}
//                         • <span>{event.language}</span>
//                       </>
//                     )}
//                     {event.category && (
//                       <>
//                         {" "}
//                         • <span>{event.category}</span>
//                       </>
//                     )}
//                   </div>

//                   <div className="event-meta-line">
//                     {event.date && (
//                       <span>On {formatDate(event.date)}</span>
//                     )}
//                     {event.organizer && (
//                       <>
//                         {" "}
//                         • <span>By {event.organizer}</span>
//                       </>
//                     )}
//                   </div>
//                   {/* Seats line removed as you asked */}
//                 </div>

//                 {/* Booking box */}
//                 <div className="event-book-box">
//                   <div className="event-seats-control">
//                     <span className="event-seats-label">Number of seats</span>
//                     <input
//                       type="number"
//                       min="1"
//                       max={event.available_seats || undefined}
//                       value={seats}
//                       onChange={(e) => setSeats(e.target.value)}
//                       className="event-seats-input"
//                     />
//                     {event.price != null && (
//                       <span className="event-price-note">
//                         ₹{event.price.toFixed(2)} per seat •{" "}
//                         {event.available_seats} seats left
//                       </span>
//                     )}
//                   </div>

//                   <div className="event-book-actions">
//                     <button
//                       className="event-lock-btn"
//                       onClick={handleLock}
//                       disabled={!event.available_seats}
//                     >
//                       Lock seats
//                     </button>
//                     <button
//                       className="event-book-btn"
//                       onClick={handleConfirm}
//                       disabled={!event.available_seats}
//                     >
//                       Book tickets
//                     </button>
//                   </div>
//                 </div>

//                 {msg && <p className="event-msg">{msg}</p>}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ===== BODY: ABOUT + YOU MAY ALSO LIKE ===== */}
//       <section className="event-body-shell">
//         <div className="bms-container event-body">
//           {/* About the event */}
//           <div className="event-about">
//             <h2>About the event</h2>
//             <p>{event.description || "No description available."}</p>
//           </div>

//           {/* You may also like */}
//           {related.length > 0 && (
//             <div className="event-related">
//               <h2>You may also like</h2>
//               <div className="bms-cards-row">
//                 {related.map((ev) => {
//                   const rPoster = ev.image_url
//                     ? `${API_BASE}${ev.image_url}`
//                     : "/placeholder-poster.png";

//                   return (
//                     <Link
//                       key={ev.id}
//                       to={`/events/${ev.id}`}
//                       className="bms-card"
//                     >
//                       <img
//                         src={rPoster}
//                         alt={ev.title}
//                         className="bms-card-img"
//                       />
//                       <div className="bms-card-info">
//                         <h3>{ev.title}</h3>
//                         <p>{ev.venue}</p>
//                         <p className="date">
//                           {ev.date ? formatDate(ev.date) : ""}
//                         </p>
//                       </div>
//                     </Link>
//                   );
//                 })}
//               </div>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* ===== FOOTER ===== */}
//       <footer className="event-footer">
//         © {new Date().getFullYear()} myEvents • Inspired by BookMyShow
//       </footer>
//     </div>
//   );
// }
// // import { useEffect, useState } from "react";
// // import { useParams, useNavigate } from "react-router-dom";
// // import { getEventById, lockSeats, confirmBooking } from "../api";
// // import { useAuth } from "../auth";

// // export default function EventBooking() {
// //   const { id } = useParams();
// //   const { token } = useAuth();
// //   const nav = useNavigate();
// //   const [event, setEvent] = useState(null);
// //   const [seats, setSeats] = useState(1);
// //   const [msg, setMsg] = useState("");

// //   useEffect(() => {
// //     async function load() {
// //       const e = await getEventById(id);
// //       setEvent(e || null);
// //     }
// //     load();
// //   }, [id]);

// //   async function lock() {
// //     try {
// //       const res = await lockSeats(token, Number(id), Number(seats));
// //       setMsg(res.message || "Seats locked.");
// //     } catch (e) {
// //       setMsg("Failed to lock seats.");
// //     }
// //   }

// //   async function confirm() {
// //     try {
// //       const res = await confirmBooking(token, Number(id));
// //       setMsg(res.message || "Booking confirmed.");
// //       setTimeout(() => nav("/confirmed"), 600);
// //     } catch (e) {
// //       setMsg("Failed to confirm booking.");
// //     }
// //   }

// //   if (!event) return <p>Loading event...</p>;

// //   return (
// //     <div>
// //       <h2>Book: {event.title}</h2>
// //       <p>{event.venue}</p>
// //       <div>
// //         <input type="number" min="1" value={seats} onChange={e=>setSeats(e.target.value)} style={{width:60}}/>{" "}
// //         <button onClick={lock}>Lock</button>{" "}
// //         <button onClick={confirm}>Confirm</button>
// //       </div>
// //       {msg && <p>{msg}</p>}
// //     </div>
// //   );
// // }
