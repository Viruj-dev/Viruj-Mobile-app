export type AuthMode = "login" | "signup" | "reset";
export function validateAuth(mode: AuthMode, values: { name: string; email: string; password: string; confirmation: string; accepted: boolean }) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) return "Enter a valid email";
  if (mode === "reset") return "";
  if (!values.password) return "Enter your password";
  if (mode === "signup") {
    if (values.name.trim().length < 2) return "Name must be at least 2 characters";
    if (values.password.length < 8) return "Use at least 8 characters for your password";
    if (values.password !== values.confirmation) return "Passwords don't match";
    if (!values.accepted) return "You must accept the privacy policy to continue";
  }
  return "";
}
