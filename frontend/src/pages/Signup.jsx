import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth";
import "../Signup.css";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const { signup } = useAuth();
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setMsg("Creating account...");
    try {
      await signup(form.name, form.email, form.password);
      nav("/login");
    } catch (err) {
      setMsg("Signup failed");
    }
  }

  return (
    <div className="signup-page">
      <div className="signup-card">
        {/* LEFT PANEL — LOGO */}
        <div className="left-panel">
          <img src="/mylogo.png" alt="My Events" className="logo-img" />
        </div>

        {/* RIGHT PANEL — FORM */}
        <div className="right-panel">
          <h2>Hello!</h2>
          <p className="subtitle">Please signup to continue</p>

          {msg && <p className="msg">{msg}</p>}

          <form onSubmit={submit} className="form">
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            <button type="submit" className="signup-btn">
              Sign Up
            </button>
          </form>

          <p className="signin-link">
            I'm already a member! <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../auth";

// export default function Signup() {
//   const [form, setForm] = useState({ name: "", email: "", password: "" });
//   const [msg, setMsg] = useState("");
//   const { signup } = useAuth();
//   const nav = useNavigate();

//   async function submit(e) {
//     e.preventDefault();
//     setMsg("Creating account...");
//     try {
//       await signup(form.name, form.email, form.password);
//       setMsg("Signup successful. Please login.");
//       nav("/login");
//     } catch (err) {
//       setMsg("Signup failed");
//     }
//   }

//   return (
//     <div>
//       <h2>Sign up</h2>
//       {msg && <p>{msg}</p>}
//       <form onSubmit={submit}>
//         <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} /><br/>
//         <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} /><br/>
//         <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} /><br/>
//         <button type="submit">Create account</button>
//       </form>
//     </div>
//   );
// }
