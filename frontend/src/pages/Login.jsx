import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth";
import { useState } from "react";
import "../Login.css";
import mylogo from "/mylogo.png"; // adjust path if needed

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const nav = useNavigate();
  const loc = useLocation();

  async function submit(e) {
    e.preventDefault();
    setMsg("Logging in...");
    try {
      await login(form.email, form.password);
      const to = loc.state?.from?.pathname || "/events";
      nav(to, { replace: true });
    } catch {
      setMsg("Invalid email or password");
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">

        {/* LEFT SIDE */}
        <div className="login-left">
          <img src={mylogo} alt="My Events" className="login-logo" />
        </div>

        {/* RIGHT FORM SIDE */}
        <div className="login-right">
          <h2>Welcome Back!</h2>
          <p>Please login to continue</p>

          {msg && <p className="login-msg">{msg}</p>}

          <form onSubmit={submit}>
            <input
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <button type="submit" className="login-btn">Login</button>
          </form>

          <p className="login-footer">
            New here? <Link to="/signup">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// import { useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "../auth";
// import { useState } from "react";

// export default function Login() {
//   const { login } = useAuth();
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [msg, setMsg] = useState("");
//   const nav = useNavigate();
//   const loc = useLocation();

//   async function submit(e) {
//     e.preventDefault();
//     setMsg("Logging in...");
//     try {
//       await login(form.email, form.password);
//       const to = loc.state?.from?.pathname || "/events";
//       nav(to, { replace: true });
//     } catch {
//       setMsg("Invalid email or password");
//     }
//   }

//   return (
//     <div>
//       <h2>Login</h2>
//       {msg && <p>{msg}</p>}
//       <form onSubmit={submit}>
//         <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} /><br/>
//         <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} /><br/>
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// }
