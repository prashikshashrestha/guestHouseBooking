export const validatePhone = (phone) => {
  // Nepali phone number or general format (at least 10 digits)
  const cleaned = phone.replace(/[^0-9]/g, "");
  return cleaned.length >= 10;
};

export const validateEmail = (email) => {
  if (!email) return true; // optional in some offline forms
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateRequired = (val) => {
  return val !== undefined && val !== null && String(val).trim().length > 0;
};
