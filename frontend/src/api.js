// // src/api.js
// src/api.js
// export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";


// const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
export const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = options.headers ? { ...options.headers } : {};

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    throw { status: res.status, data };
  }
  return data;
}

// --- AUTH (keep your existing signup/login/getMe) ---

export function signup(name, email, password) {
  return request("/users/api/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export function login(email, password) {
  return request("/users/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getMe(token) {
  return request("/users/api/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// --- EVENTS ---

export function listEvents() {
  // gateway: /events/api/events -> eventsvc /api/events
  return request("/events/api/events");
}

export function uploadEventImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  // gateway: /events/upload-image -> eventsvc /upload-image
  return request("/events/upload-image", {
    method: "POST",
    body: formData,
  });
}

export function createEvent(eventData) {
  return request("/events/api/events", {
    method: "POST",
    body: JSON.stringify(eventData),
  });
}

export async function getEventById(id) {
  const events = await listEvents();
  return events.find((e) => String(e.id) === String(id));
}

// --- BOOKINGS (keep as you already had) ---
export function lockSeats(token, event_id, seats) {
  return request("/bookings/api/lock", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ event_id, seats }),
  });
}

export function confirmBooking(token, event_id) {
  return request("/bookings/api/confirm", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ event_id }),
  });
}

export function listMyBookings(token) { 
  return request("/bookings/api/bookings", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// // If VITE_API_BASE_URL is set in .env, use it; otherwise default to gateway
// const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// // Generic helper
// async function request(path, options = {}) {
//   const url = `${API_BASE}${path}`;

//   const headers = options.headers ? { ...options.headers } : {};

//   // Only set JSON header if body is NOT FormData
//   if (!(options.body instanceof FormData)) {
//     headers["Content-Type"] = headers["Content-Type"] || "application/json";
//   }

//   const res = await fetch(url, {
//     ...options,
//     headers,
//     credentials: "include", // keep cookies/JWT if used
//   });

//   const text = await res.text();
//   let data;
//   try {
//     data = text ? JSON.parse(text) : {};
//   } catch {
//     data = { raw: text };
//   }

//   if (!res.ok) {
//     throw { status: res.status, data };
//   }
//   return data;
// }

// //
// // ---------- AUTH ----------
// //

// export function signup(name, email, password) {
//   return request("/users/api/signup", {
//     method: "POST",
//     body: JSON.stringify({ name, email, password }),
//   });
// }

// export function login(email, password) {
//   return request("/users/api/login", {
//     method: "POST",
//     body: JSON.stringify({ email, password }),
//   });
// }

// export function getMe(token) {
//   return request("/users/api/me", {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// }

// //
// // ---------- EVENTS ----------
// //

// // List all events  ->  GET http://localhost:8080/events/api/events
// export function listEvents() {
//   return request("/events/api/events", {
//     method: "GET",
//   });
// }

// // Upload poster image  ->  POST http://localhost:8080/events/upload-image
// export function uploadEventImage(file) {
//   const formData = new FormData();
//   formData.append("file", file);

//   return request("/events/upload-image", {
//     method: "POST",
//     body: formData, // IMPORTANT: no JSON header
//   });
// }

// // Create a new event  ->  POST http://localhost:8080/events/api/events
// export function createEvent(eventData) {
//   return request("/events/api/events", {
//     method: "POST",
//     body: JSON.stringify(eventData),
//   });
// }

// // Get a single event by id  ->  GET http://localhost:8080/events/api/events/:id
// export function getEventById(id) {
//   return request(`/events/api/events/${id}`, {
//     method: "GET",
//   });
// }

// //
// // ---------- BOOKINGS ----------
// //

// export function lockSeats(token, event_id, seats) {
//   return request("/bookings/api/lock", {
//     method: "POST",
//     headers: { Authorization: `Bearer ${token}` },
//     body: JSON.stringify({ event_id, seats }),
//   });
// }

// export function confirmBooking(token, event_id) {
//   return request("/bookings/api/confirm", {
//     method: "POST",
//     headers: { Authorization: `Bearer ${token}` },
//     body: JSON.stringify({ event_id }),
//   });
// }

// export function listMyBookings(token) {
//   return request("/bookings/api/bookings", {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// }

// // // src/api.js
// // const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// // async function request(path, options = {}) {
// //   const url = `${API_BASE}${path}`;

// //   const headers = options.headers ? { ...options.headers } : {};

// //   // Only set JSON header if body is NOT FormData
// //   if (!(options.body instanceof FormData)) {
// //     headers["Content-Type"] = headers["Content-Type"] || "application/json";
// //   }

// //   const res = await fetch(url, {
// //     ...options,
// //     headers,
// //     credentials: "include",
// //   });

// //   const text = await res.text();
// //   let data;
// //   try {
// //     data = text ? JSON.parse(text) : {};
// //   } catch {
// //     data = { raw: text };
// //   }

// //   if (!res.ok) {
// //     throw { status: res.status, data };
// //   }
// //   return data;
// // }

// // /* ------------ AUTH ------------ */

// // export function signup(name, email, password) {
// //   return request("/users/api/signup", {
//     // method: "POST",
//     // body: JSON.stringify({ name, email, password }),
// //   });
// // }

// // export function login(email, password) {
// //   return request("/users/api/login", {
// //     method: "POST",
// //     body: JSON.stringify({ email, password }),
// //   });
// // }

// // export function getMe(token) {
// //   return request("/users/api/me", {
// //     headers: { Authorization: `Bearer ${token}` },
// //   });
// // }
// // /* ------------ EVENTS ------------ */
// // /**
// //  * eventsvc routes:
// //  *   GET  /events/        (list)
// //  *   POST /events/        (create)
// //  *   GET  /events/<id>    (detail)
// //  *   POST /upload-image   (via /events/upload-image in gateway)
// //  */

// // export function listEvents() {
// //   // -> GET http://localhost:8080/events/
// //   return request("/events/", {
// //     method: "GET",
// //   });
// // }

// // export function uploadEventImage(file) {
// //   const formData = new FormData();
// //   formData.append("file", file);

// //   // -> POST http://localhost:8080/events/upload-image
// //   return request("/events/upload-image", {
// //     method: "POST",
// //     body: formData,
// //   });
// // }

// // export function createEvent(eventData) {
// //   // -> POST http://localhost:8080/events/
// //   return request("/events/", {
// //     method: "POST",
// //     body: JSON.stringify(eventData),
// //   });
// // }

// // export function getEventById(id) {
// //   // -> GET http://localhost:8080/events/123
// //   return request(`/events/${id}`, {
// //     method: "GET",
// //   });
// // }

// // /* ------------ EVENTS ------------ */
// // /**
// //  * NOTE: These match eventsvc routes:
// //  *   GET  /events
// //  *   POST /events
// //  *   GET  /events/<id>
// //  *   POST /upload-image  (via gateway: /events/upload-image)
// //  */

// // // export function listEvents() {
// // //   // -> gateway /events  -> eventsvc /events
// // //   return request("/events", {
// // //     method: "GET",
// // //   });
// // // }

// // // export function uploadEventImage(file) {
// // //   const formData = new FormData();
// // //   formData.append("file", file);

// // //   // -> gateway /events/upload-image -> eventsvc /upload-image
// // //   return request("/events/upload-image", {
// // //     method: "POST",
// // //     body: formData,
// // //   });
// // // }

// // // export function createEvent(eventData) {
// // //   // -> gateway /events -> eventsvc /events
// // //   return request("/events", {
// // //     method: "POST",
// // //     body: JSON.stringify(eventData),
// // //   });
// // // }

// // // export function getEventById(id) {
// // //   // -> gateway /events/123 -> eventsvc /events/123
// // //   return request(`/events/${id}`, {
// // //     method: "GET",
// // //   });
// // // }
// // // export function listEvents() {
// // //   // -> GET http://localhost:8080/events/
// // //   return request("/events/", {
// // //     method: "GET",
// // //   });
// // // }

// // // export function uploadEventImage(file) {
// // //   const formData = new FormData();
// // //   formData.append("file", file);

// // //   // -> POST http://localhost:8080/events/upload-image
// // //   return request("/events/upload-image", {
// // //     method: "POST",
// // //     body: formData,
// // //   });
// // // }

// // // export function createEvent(eventData) {
// // //   // -> POST http://localhost:8080/events/
// // //   return request("/events/", {
// // //     method: "POST",
// // //     body: JSON.stringify(eventData),
// // //   });
// // // }

// // // export function getEventById(id) {
// // //   // -> GET http://localhost:8080/events/123
// // //   return request(`/events/${id}`, {
// // //     method: "GET",
// // //   });
// // // }
// // /* ------------ BOOKINGS ------------ */

// // export function lockSeats(token, event_id, seats) {
// //   return request("/bookings/api/lock", {
// //     method: "POST",
// //     headers: { Authorization: `Bearer ${token}` },
// //     body: JSON.stringify({ event_id, seats }),
// //   });
// // }

// // export function confirmBooking(token, event_id) {
// //   return request("/bookings/api/confirm", {
// //     method: "POST",
// //     headers: { Authorization: `Bearer ${token}` },
// //     body: JSON.stringify({ event_id }),
// //   });
// // }

// // export function listMyBookings(token) {
// //   return request("/bookings/api/bookings", {
//     // headers: { Authorization: `Bearer ${token}` },
// //   });
// // }
// // // // src/api.js
// // // const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// // // async function request(path, options = {}) {
// // //   const url = `${API_BASE}${path}`;

// // //   const headers = options.headers ? { ...options.headers } : {};

// // //   // Only set JSON header if body is NOT FormData
// // //   if (!(options.body instanceof FormData)) {
// // //     headers["Content-Type"] = headers["Content-Type"] || "application/json";
// // //   }

// // //   const res = await fetch(url, {
// // //     ...options,
// // //     headers,
// // //     credentials: "include",
// // //   });

// // //   const text = await res.text();
// // //   let data;
// // //   try {
// // //     data = text ? JSON.parse(text) : {};
// // //   } catch {
// // //     data = { raw: text };
// // //   }

// // //   if (!res.ok) {
// // //     throw { status: res.status, data };
// // //   }
// // //   return data;
// // // }
// // // // --- AUTH ---
// // // export function signup(name, email, password) {
// // //   return request("/users/api/signup", {
// // //     method: "POST",
// // //     body: JSON.stringify({ name, email, password }),
// // //   });
// // // }

// // // export function login(email, password) {
// // //   return request("/users/api/login", {
// // //     method: "POST",
// // //     body: JSON.stringify({ email, password }),
// // //   });
// // // }

// // // export function getMe(token) {
// // //   return request("/users/api/me", {
// // //     headers: { Authorization: `Bearer ${token}` },
// // //   });
// // // }

// // // // --- EVENTS ---
// // // // --- EVENTS ---

// // // export function listEvents() {
// // //   // /events/... goes to gateway, which forwards to eventsvc
// // //   return request("/events/api/events");
// // // }

// // // export function uploadEventImage(file) {
// // //   const formData = new FormData();
// // //   formData.append("file", file);

// // //   // goes to gateway -> eventsvc /upload-image
// // //   return request("/events/upload-image", {
// // //     method: "POST",
// // //     body: formData,
// // //   });
// // // }

// // // export function createEvent(eventData) {
// // //   return request("/events/api/events", {
// // //     method: "POST",
// // //     body: JSON.stringify(eventData),
// // //   });
// // // }

// // // export async function getEventById(id) {
// // //   const events = await listEvents();
// // //   return events.find((e) => String(e.id) === String(id));
// // // }

// // // // list all events
// // // // export function listEvents() {
// // // //   // -> GET http://localhost:8080/events
// // // //   return request("/events", {
// // // //     method: "GET",
// // // //   });
// // // // }

// // // // // upload poster image
// // // // export function uploadEventImage(file) {
// // // //   const formData = new FormData();
// // // //   formData.append("file", file);

// // // //   // -> POST http://localhost:8080/events/upload-image
// // // //   return request("/events/upload-image", {
// // // //     method: "POST",
// // // //     body: formData,
// // // //   });
// // // // }

// // // // // create an event
// // // // export function createEvent(eventData) {
// // // //   // -> POST http://localhost:8080/events
// // // //   return request("/events", {
// // // //     method: "POST",
// // // //     body: JSON.stringify(eventData),
// // // //   });
// // // // }

// // // // // get a single event by id
// // // // export function getEventById(id) {
// // // //   // -> GET http://localhost:8080/events/123
// // // //   return request(`/events/${id}`, {
// // // //     method: "GET",
// // // //   });
// // // // }

// // // // --- BOOKINGS ---
// // // export function lockSeats(token, event_id, seats) {
// // //   return request("/bookings/api/lock", {
// // //     method: "POST",
// // //     headers: { Authorization: `Bearer ${token}` },
// // //     body: JSON.stringify({ event_id, seats }),
// // //   });
// // // }

// // // export function confirmBooking(token, event_id) {
// // //   return request("/bookings/api/confirm", {
// // //     method: "POST",
// // //     headers: { Authorization: `Bearer ${token}` },
// // //     body: JSON.stringify({ event_id }),
// // //   });
// // // }

// // // export function listMyBookings(token) {
// // //   return request("/bookings/api/bookings", {
// // //     headers: { Authorization: `Bearer ${token}` },
// // //   });
// // // }

// // // // // src/api.js
// // // // // const API_BASE = import.meta.env.VITE_API_BASE_URL;
// // // // // console.log("API_BASE =", API_BASE); // optional for debugging

// // // // // async function request(path, options = {}) {
// // // // //   const res = await fetch(`${API_BASE}${path}`, {
// // // // //     headers: {
// // // // //       "Content-Type": "application/json",
// // // // //       ...(options.headers || {}),
// // // // //     },
// // // // //     ...options,
// // // // //   });

// // // // //   const text = await res.text();
// // // // //   let data;
// // // // //   try {
// // // // //     data = text ? JSON.parse(text) : {};
// // // // //   } catch {
// // // // //     data = { raw: text };
// // // // //   }

// // // // //   if (!res.ok) {
// // // // //     throw { status: res.status, data };
// // // // //   }
// // // // //   return data;
// // // // // }

// // // // // --- AUTH ---
// // // // export function signup(name, email, password) {
// // // //   return request("/users/api/signup", {
// // // //     method: "POST",
// // // //     body: JSON.stringify({ name, email, password }),
// // // //   });
// // // // }

// // // // export function login(email, password) {
// // // //   return request("/users/api/login", {
// // // //     method: "POST",
// // // //     body: JSON.stringify({ email, password }),
// // // //   });
// // // // }

// // // // export function getMe(token) {
// // // //   return request("/users/api/me", {
// // // //     headers: { Authorization: `Bearer ${token}` },
// // // //   });
// // // // }
// // // // // --- EVENTS ---

// // // // // 1) list all events
// // // // export function listEvents() {
// // // //   // goes to http://localhost:8080/events
// // // //   return request("/events", {
// // // //     method: "GET",
// // // //   });
// // // // }

// // // // // 2) upload poster image
// // // // export function uploadEventImage(file) {
// // // //   const formData = new FormData();
// // // //   formData.append("file", file);

// // // //   // goes to http://localhost:8080/events/upload-image
// // // //   return request("/events/upload-image", {
// // // //     method: "POST",
// // // //     body: formData,          // request() will NOT set JSON Content-Type for FormData
// // // //   });
// // // // }

// // // // // 3) create event
// // // // export function createEvent(eventData) {
// // // //   // goes to http://localhost:8080/events
// // // //   return request("/events", {
// // // //     method: "POST",
// // // //     body: JSON.stringify(eventData),
// // // //   });
// // // // }

// // // // // 4) get single event by id (optional helper)
// // // // export async function getEventById(id) {
// // // //   // http://localhost:8080/events/123
// // // //   return request(`/events/${id}`, {
// // // //     method: "GET",
// // // //   });
// // // // }

// // // // // --- EVENTS ---
// // // // // export function listEvents() {
// // // // //   return request("/events/api/events");
// // // // // }

// // // // // --- BOOKINGS ---
// // // // export function lockSeats(token, event_id, seats) {
// // // //   return request("/bookings/api/lock", {
// // // //     method: "POST",
// // // //     headers: { Authorization: `Bearer ${token}` },
// // // //     body: JSON.stringify({ event_id, seats }),
// // // //   });
// // // // }

// // // // export function confirmBooking(token, event_id) {
// // // //   return request("/bookings/api/confirm", {
// // // //     method: "POST",
// // // //     headers: { Authorization: `Bearer ${token}` },
// // // //     body: JSON.stringify({ event_id }),
// // // //   });
// // // // }

// // // // export function listMyBookings(token) {
// // // //   return request("/bookings/api/bookings", {
// // // //     headers: { Authorization: `Bearer ${token}` },
// // // //   });
// // // // }

// // // // // src/api.js (append this helper at bottom)
// // // // export async function getEventById(id) {
// // // //   const events = await listEvents();
// // // //   return events.find((e) => String(e.id) === String(id));
// // // // }
// // // // // --- EVENTS ---

// // // // export function uploadEventImage(file) {
// // // //   const formData = new FormData();
// // // //   formData.append("file", file);

// // // //   return request("/events/api/upload-image", {
// // // //     method: "POST",
// // // //     body: formData,
// // // //   });
// // // // }

// // // // export function createEvent(eventData) {
// // // //   return request("/events/api/events", {
// // // //     method: "POST",
// // // //     body: JSON.stringify(eventData),
// // // //   });
// // // // }
