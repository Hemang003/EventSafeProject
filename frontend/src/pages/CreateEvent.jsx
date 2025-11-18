// frontend/src/pages/CreateEvent.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import mylogo from "/mylogo.png";
import "../CreateEvent.css";

const API_BASE = "http://localhost:8080";

// ---- helper calls ----
async function uploadPoster(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/events/upload-image`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Poster upload failed");
  }

  return data; // { url: "/events/static/posters/..." }
}

async function createEventApi(payload) {
  const res = await fetch(`${API_BASE}/events/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Event creation failed");
  }
  return data;
}

export default function CreateEvent() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    title: "",
    date: "",
    venue: "",
    total_seats: "",
    description: "",
    price: "",
    category: "",
    city: "",
    country: "",
    organizer: "",
    language: "",
    expiry_date: "",
  });

  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handlePosterChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPosterFile(file);
    setPosterPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      let image_url = null;

      // 1) upload poster if selected
      if (posterFile) {
        const res = await uploadPoster(posterFile);
        image_url = res.url;
      }

      // 2) create event
      const payload = {
        title: form.title,
        date: form.date,
        venue: form.venue,
        total_seats: Number(form.total_seats),

        description: form.description || null,
        price: form.price ? Number(form.price) : null,
        category: form.category || null,
        city: form.city || null,
        country: form.country || null,
        organizer: form.organizer || null,
        language: form.language || null,
        expiry_date: form.expiry_date || null,
        image_url,
      };

      await createEventApi(payload);
      setMsg("✅ Event created successfully!");
      setTimeout(() => nav("/events"), 1000);
    } catch (err) {
      console.error("Create event error:", err);
      setMsg(err.message || "Failed to create event. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ce-page">
      <div className="ce-card">
        {/* LEFT SIDE: LOGO + POSTER PREVIEW */}
        <div className="ce-left">
          <img src={mylogo} alt="My Events" className="ce-logo" />

          <div className="ce-poster-block">
            <label className="ce-label">Poster image</label>
            <input type="file" accept="image/*" onChange={handlePosterChange} />
            {posterPreview && (
              <div className="ce-poster-preview">
                <img src={posterPreview} alt="Poster preview" />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="ce-right">
          <h1>Create Event</h1>
          <p className="ce-subtitle">Fill in the details to publish your event.</p>

          {msg && <p className="ce-msg">{msg}</p>}

          <form className="ce-form" onSubmit={handleSubmit}>
            <div className="ce-grid">
              <div className="ce-field">
                <label className="ce-label">Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Arijit Singh Live"
                  required
                />
              </div>

              <div className="ce-field">
                <label className="ce-label">Date &amp; Time</label>
                <input
                  type="datetime-local"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="ce-field">
                <label className="ce-label">Venue</label>
                <input
                  name="venue"
                  value={form.venue}
                  onChange={handleChange}
                  placeholder="Scotiabank Arena, Toronto"
                  required
                />
              </div>

              <div className="ce-field">
                <label className="ce-label">Total Seats</label>
                <input
                  type="number"
                  min="1"
                  name="total_seats"
                  value={form.total_seats}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="ce-field ce-span2">
                <label className="ce-label">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Short description of the event..."
                />
              </div>

              <div className="ce-field">
                <label className="ce-label">Price (per seat)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="99.50"
                />
              </div>

              <div className="ce-field">
                <label className="ce-label">Category</label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Concert, Sports, Comedy..."
                />
              </div>

              <div className="ce-field">
                <label className="ce-label">City</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Toronto"
                />
              </div>

              <div className="ce-field">
                <label className="ce-label">Country</label>
                <input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Canada"
                />
              </div>

              <div className="ce-field">
                <label className="ce-label">Organizer</label>
                <input
                  name="organizer"
                  value={form.organizer}
                  onChange={handleChange}
                  placeholder="MyEvents Live"
                />
              </div>

              <div className="ce-field">
                <label className="ce-label">Language</label>
                <input
                  name="language"
                  value={form.language}
                  onChange={handleChange}
                  placeholder="English / Hindi"
                />
              </div>

              <div className="ce-field">
                <label className="ce-label">Booking closes on</label>
                <input
                  type="datetime-local"
                  name="expiry_date"
                  value={form.expiry_date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button className="ce-btn" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Event"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
