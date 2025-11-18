
// src/pages/EventsList.jsx
import "../EventsList.css";
import { useEffect, useState } from "react";
import { listEvents, API_BASE } from "../api";
import { Link } from "react-router-dom";

const GROUPS = [
  { id: "movies", label: "Movies", match: "movie" },
  { id: "concerts", label: "Concerts", match: "concert" },
  { id: "sports", label: "Sports", match: "sport" },
  { id: "activities", label: "Activities", match: "activity" },
];

// Slides for hero carousel
const HERO_SLIDES = [
  {
    id: 1,
    title: "First few minutes FREE",
    subtitle: "Just enough to get you hooked.",
    cta: "Watch Now",
  },
  {
    id: 2,
    title: "Concerts around you",
    subtitle: "Discover trending live shows and festivals.",
    cta: "Explore Concerts",
  },
  {
    id: 3,
    title: "Sports & activities",
    subtitle: "Book matches, adventures and workshops in one place.",
    cta: "Discover Now",
  },
];

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);

  async function load() {
    try {
      const data = await listEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error loading events", e);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // auto-rotate carousel
  useEffect(() => {
    const id = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  function goToSlide(index) {
    const total = HERO_SLIDES.length;
    setActiveSlide((index + total) % total);
  }

  function formatDate(value) {
    if (!value) return "";
    const d = new Date(value);
    return d.toLocaleString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function getPoster(e) {
    if (e.image_url) return `${API_BASE}${e.image_url}`;
    return "/placeholder.png";
  }

  function eventsForGroup(group) {
    return events.filter((e) =>
      (e.category || "").toLowerCase().includes(group.match)
    );
  }

  return (
    <div className="bms-container">
      {/* ===== HERO CAROUSEL ===== */}
      <section className="bms-hero">
        <div className="hero-carousel">
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={
                "hero-slide" +
                (index === activeSlide ? " hero-slide--active" : "")
              }
            >
              <div className="hero-slide-inner">
                <h1>{slide.title}</h1>
                <p>{slide.subtitle}</p>
                <button className="hero-btn">{slide.cta}</button>
              </div>
            </div>
          ))}

          {/* arrows */}
          <button
            className="hero-arrow hero-arrow--left"
            onClick={() => goToSlide(activeSlide - 1)}
          >
            ‹
          </button>
          <button
            className="hero-arrow hero-arrow--right"
            onClick={() => goToSlide(activeSlide + 1)}
          >
            ›
          </button>

          {/* dots */}
          <div className="hero-dots">
            {HERO_SLIDES.map((slide, index) => (
              <button
                key={slide.id}
                className={
                  "hero-dot" +
                  (index === activeSlide ? " hero-dot--active" : "")
                }
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== EVENT SECTIONS ===== */}
      {GROUPS.map((g) => {
        const items = eventsForGroup(g);
        if (!items.length) return null;

        return (
          <section key={g.id} id={g.id} className="bms-section">
            <div className="bms-section-header">
              <h2>{g.label}</h2>
              <button className="bms-seeall-btn">See All ›</button>
            </div>

            <div className="bms-cards-row">
              {items.map((e) => (
                <Link key={e.id} to={`/events/${e.id}`} className="bms-card">
                  <img
                    src={getPoster(e)}
                    className="bms-card-img"
                    alt={e.title}
                  />

                  <div className="bms-card-info">
                    <h3>{e.title}</h3>
                    <p>{e.venue}</p>
                    <p className="date">{formatDate(e.date)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <footer className="bms-footer">
        © {new Date().getFullYear()} Ticket Booking
      </footer>
    </div>
  );
}
// // src/pages/EventsList.jsx
// import "../EventsList.css";
// import { useEffect, useState } from "react";
// import { listEvents, API_BASE } from "../api";
// import { Link } from "react-router-dom";

// const GROUPS = [
//   { id: "movies", label: "Movies", match: "movie" },
//   { id: "concerts", label: "Concerts", match: "concert" },
//   { id: "sports", label: "Sports", match: "sport" },
//   { id: "activities", label: "Activities", match: "activity" },
// ];

// // Simple hero carousel slides (you can change text/images later)
// const HERO_SLIDES = [
//   {
//     id: 1,
//     title: "First few minutes FREE",
//     subtitle: "Just enough to get you hooked.",
//     cta: "Watch Now",
//   },
//   {
//     id: 2,
//     title: "Live concerts near you",
//     subtitle: "Find trending concerts and festivals in your city.",
//     cta: "Explore Concerts",
//   },
//   {
//     id: 3,
//     title: "Sports & activities",
//     subtitle: "Book matches, adventures and workshops in one place.",
//     cta: "Discover Now",
//   },
// ];

// export default function EventsList() {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState("");
//   const [activeSlide, setActiveSlide] = useState(0);

//   async function load() {
//     setLoading(true);
//     setMsg("");
//     try {
//       const data = await listEvents();
//       setEvents(Array.isArray(data) ? data : []);
//       if (!data.length) setMsg("No events available right now.");
//     } catch (err) {
//       console.error(err);
//       setMsg("Failed to load events. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     load();
//   }, []);

//   // Auto-rotate hero slides
//   useEffect(() => {
//     const id = setInterval(() => {
//       setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
//     }, 5000);
//     return () => clearInterval(id);
//   }, []);

//   function goToSlide(index) {
//     setActiveSlide((index + HERO_SLIDES.length) % HERO_SLIDES.length);
//   }

//   function formatDate(value) {
//     if (!value) return "";
//     const d = new Date(value);
//     return d.toLocaleString(undefined, {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   }

//   function getPoster(e) {
//     if (e.image_url) {
//       return `${API_BASE}${e.image_url}`;
//     }
//     return "/placeholder-poster.png";
//   }

//   function eventsForGroup(group) {
//     const key = group.match.toLowerCase();
//     return events.filter((e) =>
//       (e.category || "").toLowerCase().includes(key)
//     );
//   }

//   return (
//     <div className="bms-page">
//       {/* HERO CAROUSEL */}
//       <section className="bms-hero">
//         <div className="hero-carousel">
//           {HERO_SLIDES.map((slide, index) => (
//             <div
//               key={slide.id}
//               className={
//                 "hero-slide" +
//                 (index === activeSlide ? " hero-slide--active" : "")
//               }
//             >
//               <div className="hero-slide-inner">
//                 <h1>{slide.title}</h1>
//                 <p>{slide.subtitle}</p>
//                 <button className="bms-hero-cta">{slide.cta}</button>
//               </div>
//             </div>
//           ))}

//           <button
//             className="hero-arrow hero-arrow--left"
//             onClick={() => goToSlide(activeSlide - 1)}
//           >
//             ‹
//           </button>
//           <button
//             className="hero-arrow hero-arrow--right"
//             onClick={() => goToSlide(activeSlide + 1)}
//           >
//             ›
//           </button>

//           <div className="hero-dots">
//             {HERO_SLIDES.map((slide, index) => (
//               <button
//                 key={slide.id}
//                 className={
//                   "hero-dot" +
//                   (index === activeSlide ? " hero-dot--active" : "")
//                 }
//                 onClick={() => goToSlide(index)}
//               />
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* STATUS TEXT */}
//       {msg && <p className="bms-status-text">{msg}</p>}
//       {loading && <p className="bms-status-text">Loading events…</p>}

//       {/* CATEGORY ROWS */}
//       <main className="bms-main">
//         {GROUPS.map((group) => {
//           const items = eventsForGroup(group);
//           if (!items.length) return null;

//           return (
//             <section
//               key={group.id}
//               id={group.id}
//               className="bms-section-row"
//             >
//               <div className="bms-section-header">
//                 <h2>{group.label}</h2>
//                 <button className="bms-seeall-btn">See All ›</button>
//               </div>

//               <div className="bms-card-strip">
//                 {items.map((e) => (
//                   <Link
//                     key={e.id}
//                     to={`/events/${e.id}`}
//                     className="bms-card"
//                   >
//                     <div className="bms-card-poster-wrap">
//                       <img
//                         className="bms-card-poster"
//                         src={getPoster(e)}
//                         alt={e.title}
//                       />
//                       {e.is_promoted && (
//                         <span className="bms-card-tag">PROMOTED</span>
//                       )}
//                     </div>
//                     <div className="bms-card-body">
//                       <h3 className="bms-card-title">{e.title}</h3>
//                       <p className="bms-card-venue">{e.venue}</p>
//                       <p className="bms-card-date">{formatDate(e.date)}</p>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             </section>
//           );
//         })}
//       </main>

//       {/* FOOTER */}
//       <footer className="bms-footer">
//         <p>© {new Date().getFullYear()} Ticket Booking • Inspired by BookMyShow</p>
//       </footer>
//     </div>
//   );
// }

// src/pages/EventsList.jsx
// import "../EventsList.css";
// import { useEffect, useState } from "react";
// import { listEvents, API_BASE } from "../api";
// import { Link } from "react-router-dom";

// const GROUPS = [
//   { id: "movies", label: "Movies", match: "movie" },
//   { id: "concerts", label: "Concerts", match: "concert" },
//   { id: "sports", label: "Sports", match: "sport" },
//   { id: "activities", label: "Activities", match: "activity" },
// ];

// export default function EventsList() {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState("");

//   async function load() {
//     setLoading(true);
//     setMsg("");
//     try {
//       const data = await listEvents();
//       setEvents(Array.isArray(data) ? data : []);
//       if (!data.length) setMsg("No events available right now.");
//     } catch (err) {
//       console.error(err);
//       setMsg("Failed to load events. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     load();
//   }, []);

//   function formatDate(value) {
//     if (!value) return "";
//     const d = new Date(value);
//     return d.toLocaleString(undefined, {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   }

//   function getPoster(e) {
//     if (e.image_url) {
//       return `${API_BASE}${e.image_url}`;
//     }
//     return "/placeholder-poster.png";
//   }

//   function eventsForGroup(group) {
//     const key = group.match.toLowerCase();
//     return events.filter((e) =>
//       (e.category || "").toLowerCase().includes(key)
//     );
//   }

//   return (
//     <div className="bms-page">
//       {/* HERO */}
//       <section className="bms-hero">
//         <div className="bms-hero-banner">
//           <div className="bms-hero-content">
//             <h1>5% unlimited cashback</h1>
//             <p>On all your movie, concert, sports and activity bookings.</p>
//             <button className="bms-hero-cta">Apply Now</button>
//           </div>
//         </div>
//       </section>

//       {/* STATUS TEXT */}
//       {msg && <p className="bms-status-text">{msg}</p>}
//       {loading && <p className="bms-status-text">Loading events…</p>}

//       {/* CATEGORY ROWS */}
//       <main className="bms-main">
//         {GROUPS.map((group) => {
//           const items = eventsForGroup(group);
//           if (!items.length) return null;

//           return (
//             <section
//               key={group.id}
//               id={group.id}
//               className="bms-section-row"
//             >
//               <div className="bms-section-header">
//                 <h2>{group.label}</h2>
//                 <button className="bms-seeall-btn">See All ›</button>
//               </div>

//               <div className="bms-card-strip">
//                 {items.map((e) => (
//                   <Link
//                     key={e.id}
//                     to={`/events/${e.id}`}
//                     className="bms-card"
//                   >
//                     <div className="bms-card-poster-wrap">
//                       <img
//                         className="bms-card-poster"
//                         src={getPoster(e)}
//                         alt={e.title}
//                       />
//                       {e.is_promoted && (
//                         <span className="bms-card-tag">PROMOTED</span>
//                       )}
//                     </div>
//                     <div className="bms-card-body">
//                       <h3 className="bms-card-title">{e.title}</h3>
//                       <p className="bms-card-venue">{e.venue}</p>
//                       <p className="bms-card-date">{formatDate(e.date)}</p>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             </section>
//           );
//         })}
//       </main>

//       {/* FOOTER */}
//       <footer className="bms-footer">
//         <p>© {new Date().getFullYear()} Ticket Booking • Inspired by BookMyShow</p>
//       </footer>
//     </div>
//   );
// }
// // src/pages/EventsList.jsx
// import "../EventsList.css";
// import { useEffect, useState } from "react";
// import { listEvents, API_BASE } from "../api";
// import { Link } from "react-router-dom";

// const GROUPS = [
//   { id: "movies", label: "Movies", match: "movie" },
//   { id: "concerts", label: "Concerts", match: "concert" },
//   { id: "sports", label: "Sports", match: "sport" },
//   { id: "activities", label: "Activities", match: "activity" },
// ];

// export default function EventsList() {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState("");

//   async function load() {
//     setLoading(true);
//     setMsg("");
//     try {
//       const data = await listEvents();
//       setEvents(Array.isArray(data) ? data : []);
//       if (!data.length) setMsg("No events available right now.");
//     } catch (err) {
//       console.error(err);
//       setMsg("Failed to load events. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     load();
//   }, []);

//   function formatDate(value) {
//     if (!value) return "";
//     const d = new Date(value);
//     return d.toLocaleString(undefined, {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   }

//   function getPoster(e) {
//     if (e.image_url) {
//       // API returns paths like /events/static/posters/xyz.png
//       return `${API_BASE}${e.image_url}`;
//     }
//     return "/placeholder-poster.png";
//   }

//   // filter events for each category row
//   function eventsForGroup(group) {
//     const key = group.match.toLowerCase();
//     return events.filter((e) =>
//       (e.category || "").toLowerCase().includes(key)
//     );
//   }

//   return (
//     <div className="bms-page">
//       {/* ===== TOP HEADER ===== */}
//       <header className="bms-header">
//         <div className="bms-header-left">
//           <div className="bms-logo">
//             <span className="bms-logo-red">book</span>
//             <span className="bms-logo-black">my</span>
//             <span className="bms-logo-red">show</span>
//           </div>
//         </div>

//         <div className="bms-search-wrap">
//           <input
//             className="bms-search-input"
//             placeholder="Search for Movies, Events, Sports and Activities"
//           />
//         </div>

//         <div className="bms-header-right">
//           <button className="bms-location-btn">
//             Mumbai <span className="bms-location-arrow">▼</span>
//           </button>
//           <button className="bms-signin-btn">Sign in</button>
//           <button className="bms-menu-btn">☰</button>
//         </div>
//       </header>

//       {/* ===== SUB NAVBAR ===== */}
//       <nav className="bms-subnav">
//         <div className="bms-subnav-left">
//           <a href="#movies" className="bms-subnav-link">
//             Movies
//           </a>
//           <a href="#concerts" className="bms-subnav-link">
//             Concerts
//           </a>
//           <a href="#sports" className="bms-subnav-link">
//             Sports
//           </a>
//           <a href="#activities" className="bms-subnav-link">
//             Activities
//           </a>
//         </div>
//         <div className="bms-subnav-right">
//           <span className="bms-subnav-small-link">ListYourShow</span>
//           <span className="bms-subnav-small-link">Offers</span>
//           <span className="bms-subnav-small-link">Gift Cards</span>
//         </div>
//       </nav>

//       {/* ===== HERO / BANNER ===== */}
//       <section className="bms-hero">
//         <div className="bms-hero-banner">
//           <div className="bms-hero-content">
//             <h1>5% unlimited cashback</h1>
//             <p>On all your movie, concert, sports and activity bookings.</p>
//             <button className="bms-hero-cta">Apply Now</button>
//           </div>
//         </div>
//       </section>

//       {/* ===== STATUS TEXT ===== */}
//       {msg && <p className="bms-status-text">{msg}</p>}
//       {loading && <p className="bms-status-text">Loading events…</p>}

//       {/* ===== CATEGORY ROWS (Movies, Concerts, Sports, Activities) ===== */}
//       <main className="bms-main">
//         {GROUPS.map((group) => {
//           const items = eventsForGroup(group);
//           if (!items.length) {
//             // if you prefer to always show section, comment this "return null"
//             return null;
//           }

//           return (
//             <section
//               key={group.id}
//               id={group.id}
//               className="bms-section-row"
//             >
//               <div className="bms-section-header">
//                 <h2>{group.label}</h2>
//                 <button className="bms-seeall-btn">See All ›</button>
//               </div>

//               <div className="bms-card-strip">
//                 {items.map((e) => (
//                   <Link
//                     key={e.id}
//                     to={`/events/${e.id}`}
//                     className="bms-card"
//                   >
//                     <div className="bms-card-poster-wrap">
//                       <img
//                         className="bms-card-poster"
//                         src={getPoster(e)}
//                         alt={e.title}
//                       />
//                       {e.is_promoted && (
//                         <span className="bms-card-tag">PROMOTED</span>
//                       )}
//                     </div>
//                     <div className="bms-card-body">
//                       <h3 className="bms-card-title">{e.title}</h3>
//                       <p className="bms-card-venue">{e.venue}</p>
//                       <p className="bms-card-date">{formatDate(e.date)}</p>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             </section>
//           );
//         })}
//       </main>

//       {/* ===== FOOTER ===== */}
//       <footer className="bms-footer">
//         <p>© {new Date().getFullYear()} Ticket Booking • Inspired by BookMyShow</p>
//       </footer>
//     </div>
//   );
// }
// // // src/pages/EventsList.jsx
// // import "../EventsList.css";
// // // src/pages/EventsList.jsx
// // import { useEffect, useState } from "react";

// // import { Link } from "react-router-dom";
// // import { listEvents, API_BASE } from "../api";


// // export default function EventsList() {
// //   const [events, setEvents] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [msg, setMsg] = useState("");

// //   async function load() {
// //     setLoading(true);
// //     setMsg("");
// //     try {
// //       const data = await listEvents();    // ✅ all events from DB
// //       setEvents(data);
// //       if (!data.length) setMsg("No events available right now.");
// //     } catch (err) {
// //       console.error(err);
// //       setMsg("Failed to load events. Please try again.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   useEffect(() => {
// //     load();
// //   }, []);

// //   function formatDate(value) {
// //     if (!value) return "";
// //     const d = new Date(value);
// //     return d.toLocaleString(undefined, {
// //       day: "2-digit",
// //       month: "short",
// //       year: "numeric",
// //     });
// //   }

// //   return (
// //     <div className="bms-page">
// //       {/* ===== TOP HEADER (Movies / Events / Sports / Activities text only) ===== */}
// //       <header className="bms-header">
// //         <div className="bms-header-left">
// //           <div className="bms-logo">myEvents</div>
// //         </div>

// //         <nav className="bms-nav">
// //           <span className="bms-nav-link">Movies</span>
// //           <span className="bms-nav-link">Events</span>
// //           <span className="bms-nav-link">Sports</span>
// //           <span className="bms-nav-link">Activities</span>
// //         </nav>

// //         <div className="bms-header-right">
// //           <button className="bms-header-btn" onClick={load} disabled={loading}>
// //             {loading ? "Loading..." : "Reload"}
// //           </button>
// //         </div>
// //       </header>

// //       {/* ===== HERO / BANNER ===== */}
// //       <section className="bms-hero">
// //         <div className="bms-hero-slide">
// //           <div className="bms-hero-text">
// //             <h1>Book Your Next Experience</h1>
// //             <p>
// //               Discover concerts, movies, sports and activities – all in one place.
// //               Secure bookings with instant confirmation.
// //             </p>
// //             <button className="bms-hero-cta">Explore Events</button>
// //           </div>
// //           <div className="bms-hero-placeholder">
// //             <span>Promo Banner</span>
// //           </div>
// //         </div>
// //         <div className="bms-hero-dots">
// //           <span className="bms-hero-dot bms-hero-dot--active" />
// //           <span className="bms-hero-dot" />
// //           <span className="bms-hero-dot" />
// //         </div>
// //       </section>

// //       {/* ===== STATUS ===== */}
// //       {msg && <p className="bms-status-text">{msg}</p>}

// //       {/* ===== ALL EVENTS GRID (NO FILTER / NO GROUPING) ===== */}
// //             <main className="bms-content">
// //         {/* All Events section */}
// //         <section className="bms-section">
// //           <div className="bms-section-header">
// //             <h2>All Events</h2>
// //           </div>

// //           <div className="bms-card-row">
// //             {events.map((e) => {
// //               const posterUrl = e.image_url
// //                 ? `${API_BASE}${e.image_url}`
// //                 : "/placeholder-poster.png"; // optional fallback

// //               return (
// //                 <Link
// //                   key={e.id}
// //                   to={`/events/${e.id}`}
// //                   className="bms-card"
// //                 >
// //                   <div className="bms-card-poster-wrap">
// //                     <img
// //                       className="bms-card-poster"
// //                       src={posterUrl}
// //                       alt={e.title}
// //                     />
// //                   </div>
// //                   <div className="bms-card-body">
// //                     <h3>{e.title}</h3>
// //                     <p>{e.venue}</p>
// //                     <p>
// //                       {new Date(e.date).toLocaleDateString("en-US", {
// //                         day: "numeric",
// //                         month: "short",
// //                         year: "numeric",
// //                       })}
// //                     </p>
// //                   </div>
// //                 </Link>
// //               );
// //             })}
// //           </div>
// //         </section>
// //       </main>

// //       {/* ===== FOOTER ===== */}
// //       <footer className="bms-footer">
// //         <p>© {new Date().getFullYear()} myEvents • All rights reserved.</p>
// //       </footer>
// //     </div>
// //   );
// // }
