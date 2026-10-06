import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, ShieldCheck, ArrowRight } from "lucide-react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import { HOTEL_INFO } from "../utils/initialData";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@kalikahotel.com");
  const [password, setPassword] = useState("admin123");
  const [role, setRole] = useState("admin");

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password, role);
    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="pt-28 pb-20 bg-stone-50 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-stone-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold font-display-luxury text-stone-900">
            Sign In to {HOTEL_INFO.name}
          </h1>
          <p className="text-xs text-stone-500">
            Access staff management dashboard or your guest reservation portal
          </p>
        </div>

        {/* Role toggle */}
        <div className="flex bg-stone-100 p-1.5 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`flex-1 py-2 rounded-lg transition-all ${
              role === "admin"
                ? "bg-stone-900 text-white shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Staff / Receptionist
          </button>
          <button
            type="button"
            onClick={() => setRole("guest")}
            className={`flex-1 py-2 rounded-lg transition-all ${
              role === "guest"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Guest User
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="staff@kalikahotel.com"
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Button type="submit" variant="gold" size="md" className="w-full font-bold">
            Sign In as {role === "admin" ? "Staff / Admin" : "Guest"}
          </Button>
        </form>

        <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
          <span>Don't have an account? </span>
          <Link to="/register" className="text-amber-700 font-bold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
