// src/Layout.jsx
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "./auth";
import "./EventsList.css";

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">

      {/* HEADER */}
      <header className="bms-header">
        <div className="bms-header-left">
          <Link to="/events" className="bms-logo-link">
            <img src="/mylogo.png" alt="My Events" className="logo-imgs" />
          </Link>
        </div>

        <div className="bms-search-wrap">
          <input
            className="bms-search-input"
            placeholder="Search for Movies, Events, Sports and Activities"
          />
        </div>

        <div className="bms-header-right">
          <nav className="layout-topnav-links">
            <Link to="/confirmed">My Events</Link>

            {user ? (
              <>
                <span className="layout-topnav-user">
                  Hi, {user.name || user.email}
                </span>
                <button className="layout-topnav-btn" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/signup">Sign up</Link>
                <Link to="/login">Login</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* SUB NAV */}
      <nav className="bms-subnav">
        <div className="bms-subnav-left">
          <a href="#movies" className="bms-subnav-link">Movies</a>
          <a href="#concerts" className="bms-subnav-link">Concerts</a>
          <a href="#sports" className="bms-subnav-link">Sports</a>
          <a href="#activities" className="bms-subnav-link">Activities</a>
        </div>

        <div className="bms-subnav-right">
          <span className="bms-subnav-small-link">ListYourShow</span>
          <span className="bms-subnav-small-link">Offers</span>
          <span className="bms-subnav-small-link">Gift Cards</span>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
// // // src/Layout.jsx
// import { Link, Outlet } from "react-router-dom";
// import { useAuth } from "./auth";
// import "./EventsList.css"; // reuse the BookMyShow header styles

// export default function Layout() {
//   const { user, logout } = useAuth();

//   return (
//     <div className="app-shell">
//       {/* TOP SMALL BAR: Events / Confirmed / Create / Login/Logout */}


//       {/* MAIN BOOKMYSHOW-STYLE HEADER */}
//       <header className="bms-header">
//         <div className="bms-header-left">
//           <Link to="/events" className="bms-logo-link">
//             <div className="bms-logo">
//               <span className="logo-img"><img src="/mylogo.png" alt="My Events" className="logo-img" />
// </span>
             
//             </div>
//           </Link>
//         </div>

//         <div className="bms-search-wrap">
//           <input
//             className="bms-search-input"
//             placeholder="Search for Movies, Events, Sports and Activities"
//           />
//         </div>

//         <div className="bms-header-right">
     
//      <nav className="layout-topnav-links">
        
//           <Link to="/confirmed">My Events</Link>
//           {user ? (
//             <>
//               <span className="layout-topnav-user">
//                 Hi, {user.name || user.email}
//               </span>
//               <button className="layout-topnav-btn" onClick={logout}>
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <Link to="/signup">Sign up</Link>
//               <Link to="/login">Login</Link>
//             </>
//           )}
//         </nav>  


    
//         </div>
//       </header>

//       {/* SUB NAVBAR: Movies / Concerts / Sports / Activities */}
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

//       {/* CHILD PAGES */}
//       <main>
//         <Outlet />
//       </main>
//     </div>
//   );
// }
