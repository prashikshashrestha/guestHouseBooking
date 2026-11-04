import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Building,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { HOTEL_INFO } from "../../utils/initialData";

export const AdminLoginPage = () => {
  const { login, loginAsDemo, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const searchParams = new URLSearchParams(location.search);
  const isUnauthorized = searchParams.get("error") === "unauthorized";

  // If already authenticated as admin, redirect directly
  React.useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!email.trim()) {
      setFormError("Please enter your admin email or username.");
      return;
    }
    if (!password) {
      setFormError("Please enter your admin password.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password, "admin");
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setFormError(err.message || "Invalid administrative credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = async () => {
    setLoading(true);
    setFormError("");
    try {
      await loginAsDemo("admin");
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setFormError("Failed to sign in with demo admin credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07170f] via-[#0c2317] to-[#122e20] text-stone-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Decorative ambient elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand & Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 text-stone-950 font-bold text-2xl shadow-xl border border-amber-300/30 mb-4">
            K
          </div>
          <span className="text-[11px] font-bold tracking-widest text-amber-400 uppercase block mb-1">
            Authorized Personnel Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-display-luxury text-white">
            {HOTEL_INFO.name}
          </h1>
          <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
            Hotel Administration & Front Desk Management Console
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#0f2a1c]/90 backdrop-blur-xl border border-emerald-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Unauthorized alert notice */}
          {isUnauthorized && (
            <div className="mb-5 p-3.5 bg-rose-950/60 border border-rose-800/80 rounded-2xl flex items-start gap-3 text-rose-200 text-xs">
              <AlertCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-100">Access Restricted</p>
                <p className="text-rose-300 text-[11px] mt-0.5">
                  You must authenticate with an administrator account to view the management console.
                </p>
              </div>
            </div>
          )}

          {/* Form Error alert */}
          {formError && (
            <div className="mb-5 p-3.5 bg-rose-950/60 border border-rose-800/80 rounded-2xl flex items-start gap-3 text-rose-200 text-xs">
              <AlertCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />
              <p className="text-rose-200">{formError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Admin Email or Username
              </label>
              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                />
                <input
                  type="text"
                  placeholder="admin@kalikahotel.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#091b12] border border-emerald-900/80 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-stone-300">
                  Password
                </label>
                <span className="text-[11px] text-stone-500">
                  Secured 256-bit
                </span>
              </div>
              <div className="relative">
                <Lock
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#091b12] border border-emerald-900/80 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-stone-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Sign In to Console</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials shortcut */}
          <div className="mt-6 pt-5 border-t border-emerald-900/60 text-center">
            <span className="text-[11px] text-stone-400 block mb-2.5">
              Testing or demonstration?
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              disabled={loading}
              className="w-full py-2.5 px-3 rounded-xl bg-[#143524] hover:bg-[#1b442e] border border-amber-500/30 text-amber-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <KeyRound size={14} className="text-amber-400" />
              <span>1-Click Receptionist Demo Login</span>
            </button>
            <p className="text-[10px] text-stone-500 mt-2">
              Default: <code className="text-amber-400/90">admin@kalikahotel.com</code> / <code className="text-amber-400/90">admin123</code>
            </p>
          </div>
        </div>

        {/* Back to public site */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-amber-300 transition-colors"
          >
            <span>&larr; Return to Guest Booking Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
