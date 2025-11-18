import { useEffect, useState } from "react";
import { listMyBookings } from "../api";
import { useAuth } from "../auth";

export default function Confirmed() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [msg, setMsg] = useState("");

  async function load() {
    try {
      const data = await listMyBookings(token);
      setBookings(data);
      if (!data.length) setMsg("No confirmed bookings yet.");
    } catch {
      setMsg("Failed to load bookings.");
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2>Confirmed Bookings</h2>
      <button onClick={load}>Reload</button>
      {msg && <p>{msg}</p>}
      <ul>
        {bookings.map(b => (
          <li key={b.id}>Event #{b.event_id} — {b.seats} seat(s) — {b.status}</li>
        ))}
      </ul>
    </div>
  );
}
