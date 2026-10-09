import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Lock, ShieldCheck, UserCheck, AlertCircle } from "lucide-react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import { HOTEL_INFO } from "../utils/initialData";
import { validateRequired, validateEmail } from "../utils/validateForm";

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginAsDemo } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("guest");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const from = location.state?.from?.pathname || (role === "admin" ? "/admin" : "/my-bookings");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const newErrors = {};
    if (!validateRequired(email)) {
      newErrors.email = "Email address is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!validateRequired(password)) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password, role);
      navigate(from, { replace: true });
    } catch (err) {
      setFormError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = async (demoRole) => {
    setIsSubmitting(true);
    setFormError("");
    try {
      await loginAsDemo(demoRole);
      navigate(demoRole === "admin" ? "/admin" : "/my-bookings", { replace: true });
    } catch (_err) {
      setFormError("Could not log in with demo account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 bg-stone-50 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-stone-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-2 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold font-display-luxury text-stone-900">
            Sign In to {HOTEL_INFO.name}
          </h1>
          <p className="text-xs text-stone-500">
            Access your reservations, booking invoices, and customer account
          </p>
        </div>

        {/* Form Error Banner */}
        {formError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Role toggle: Guest vs Staff */}
        <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setRole("guest");
              setErrors({});
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              role === "guest"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Guest Account
          </button>
          <button
            type="button"
            onClick={() => {
              setRole("admin");
              setErrors({});
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              role === "admin"
                ? "bg-stone-900 text-white shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Staff / Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
            }}
            placeholder={role === "admin" ? "admin@kalikahotel.com" : "guest@example.com"}
            error={errors.email}
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
            }}
            placeholder="••••••••"
            error={errors.password}
          />

          <Button
            type="submit"
            variant="gold"
            size="md"
            disabled={isSubmitting}
            className="w-full font-bold py-3 text-xs uppercase tracking-wider"
          >
            {isSubmitting ? "Signing In..." : `Sign In as ${role === "admin" ? "Staff" : "Guest"}`}
          </Button>
        </form>

        {/* Quick Demo Access Bar */}
        <div className="pt-2 border-t border-stone-100 space-y-2">
          <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider text-center">
            One-Click Demo Access
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo("guest")}
              className="py-2 px-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 hover:border-amber-400 transition-colors flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Guest Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("admin")}
              className="py-2 px-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 hover:border-amber-400 transition-colors flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-stone-800" />
              <span>Staff Demo</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
          <span>Don't have an account? </span>
          <Link to="/register" className="text-amber-700 font-bold hover:underline">
            Register new guest account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
