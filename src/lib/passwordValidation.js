export function validatePassword(password) {
  if (!password || password.length < 6) {
    return {
      isValid: false,
      error: "Password must be at least 6 characters long.",
    };
  }

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
    return {
      isValid: false,
      error: "Password must follow format: min 6 chars with uppercase, lowercase, digit, and special char (e.g. Aa123@).",
    };
  }

  return { isValid: true, error: "" };
}
