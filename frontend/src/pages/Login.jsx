import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-sm mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-6">Welcome back</h1>
      {error && <div className="text-sm text-red-600 mb-3">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#EFE1E0]" required />
        <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#EFE1E0]" required />
        <button className="btn-primary w-full py-3">Login</button>
      </form>
      <p className="text-sm text-[#6B5760] mt-4">No account? <Link to="/register" className="font-semibold text-accent">Register</Link></p>
    </div>
  );
}
