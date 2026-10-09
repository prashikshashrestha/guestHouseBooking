import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, AlertCircle } from "lucide-react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import { HOTEL_INFO } from "../utils/initialData";
import { validateRequired, validateEmail, validatePhone } from "../utils/validateForm";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const newErrors = {};
    if (!validateRequired(formData.fullName)) {
      newErrors.fullName = "Full name is required";
    }

    if (!validateRequired(formData.email)) {
      newErrors.email = "Email address is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!validateRequired(formData.phone)) {
      newErrors.phone = "Mobile phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit mobile phone number";
    }

    if (!validateRequired(formData.password)) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      navigate("/my-bookings");
    } catch (err) {
      setFormError(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 bg-stone-50 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-stone-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-2 shadow-inner">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold font-display-luxury text-stone-900">
            Create Guest Account
          </h1>
          <p className="text-xs text-stone-500">
            Join {HOTEL_INFO.name} for priority reservations, instant check-in, and dining orders
          </p>
        </div>

        {formError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Ramesh Karki"
            required
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            error={errors.fullName}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="guest@example.com"
            required
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={errors.email}
          />

          <Input
            label="Mobile Phone Number"
            placeholder="e.g. 9842042150"
            required
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            error={errors.phone}
            helperText="Used for reservation SMS and front desk lookup"
          />

          <Input
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            required
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            error={errors.password}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Re-enter your password"
            required
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            error={errors.confirmPassword}
          />

          <Button
            type="submit"
            variant="gold"
            size="md"
            disabled={isSubmitting}
            className="w-full font-bold py-3 text-xs uppercase tracking-wider"
          >
            {isSubmitting ? "Creating Account..." : "Create Account & Continue"}
          </Button>
        </form>

        <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
          <span>Already registered? </span>
          <Link to="/login" className="text-amber-700 font-bold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
