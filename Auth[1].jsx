import { useState } from "react";
import "./Auth.css";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    )}
  </svg>
);

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "", email: "", password: "", confirmPassword: ""
  });

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading("manual");
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      localStorage.setItem("token", data.token);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => (window.location.href = "/dashboard"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (signupForm.password !== signupForm.confirmPassword) {
      return setError("Passwords do not match.");
    }
    setLoading("manual");
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupForm.name,
          email: signupForm.email,
          password: signupForm.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      localStorage.setItem("token", data.token);
      setSuccess("Account created! Redirecting...");
      setTimeout(() => (window.location.href = "/dashboard"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  };

  const handleGoogleAuth = () => {
    setLoading("google");
    window.location.href = `${API}/auth/google`;
  };

  const handleFacebookAuth = () => {
    setLoading("facebook");
    window.location.href = `${API}/auth/facebook`;
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError(""); setSuccess("");
  };

  return (
    <div className="auth-root">
      <div className="auth-bg">
        <div className="auth-orb orb-1" />
        <div className="auth-orb orb-2" />
        <div className="auth-orb orb-3" />
        <div className="auth-grid" />
      </div>

      <div className="auth-wrapper">
        <div className={`auth-card ${mode === "signup" ? "card-tall" : ""}`}>
          <div className="auth-brand">
            <div className="brand-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="url(#hexGrad)" stroke="none"/>
                <defs>
                  <linearGradient id="hexGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#c9a96e"/>
                    <stop offset="100%" stopColor="#e8c98a"/>
                  </linearGradient>
                </defs>
                <text x="14" y="19" textAnchor="middle" fill="#0d0b08" fontSize="13" fontWeight="700">M</text>
              </svg>
            </div>
            <span className="brand-name">Meridian</span>
          </div>

          <div className="auth-tabs">
            <button
              className={`tab-btn ${mode === "login" ? "tab-active" : ""}`}
              onClick={() => switchMode("login")}
            >
              Sign In
            </button>
            <button
              className={`tab-btn ${mode === "signup" ? "tab-active" : ""}`}
              onClick={() => switchMode("signup")}
            >
              Sign Up
            </button>
            <div className={`tab-indicator ${mode === "signup" ? "indicator-right" : ""}`} />
          </div>

          <div className="auth-heading">
            {mode === "login" ? (
              <>
                <h1>Welcome back</h1>
                <p>Sign in to continue your journey</p>
              </>
            ) : (
              <>
                <h1>Create account</h1>
                <p>Join thousands of users today</p>
              </>
            )}
          </div>

          {error && <div className="auth-alert alert-error">{error}</div>}
          {success && <div className="auth-alert alert-success">{success}</div>}

          <div className="social-row">
            <button
              className="social-btn google-btn"
              onClick={handleGoogleAuth}
              disabled={!!loading}
            >
              {loading === "google" ? <span className="spinner" /> : <GoogleIcon />}
              <span>Google</span>
            </button>
            <button
              className="social-btn facebook-btn"
              onClick={handleFacebookAuth}
              disabled={!!loading}
            >
              {loading === "facebook" ? <span className="spinner" /> : <FacebookIcon />}
              <span>Facebook</span>
            </button>
          </div>

          <div className="divider">
            <span>or continue with email</span>
          </div>

          {mode === "login" ? (
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <div className="field-group">
                <label htmlFor="login-email">Email address</label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="field-group">
                <label htmlFor="login-password">
                  Password
                  <a href="/forgot-password" className="forgot-link">Forgot?</a>
                </label>
                <div className="password-wrap">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                    autoComplete="current-password"
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </div>
              <button type="submit" className="submit-btn" disabled={!!loading}>
                {loading === "manual" ? <span className="spinner spinner-light" /> : "Sign In"}
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleSignupSubmit}>
              <div className="field-group">
                <label htmlFor="signup-name">Full name</label>
                <input
                  id="signup-name"
                  type="text"
                  placeholder="John Doe"
                  value={signupForm.name}
                  onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                  required
                  autoComplete="name"
                />
              </div>
              <div className="field-group">
                <label htmlFor="signup-email">Email address</label>
                <input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="field-group">
                <label htmlFor="signup-password">Password</label>
                <div className="password-wrap">
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </div>
              <div className="field-group">
                <label htmlFor="signup-confirm">Confirm password</label>
                <div className="password-wrap">
                  <input
                    id="signup-confirm"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                    required
                    autoComplete="new-password"
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                    <EyeIcon open={showConfirm} />
                  </button>
                </div>
              </div>
              <p className="terms-note">
                By creating an account you agree to our{" "}
                <a href="/terms">Terms of Service</a> and{" "}
                <a href="/privacy">Privacy Policy</a>.
              </p>
              <button type="submit" className="submit-btn" disabled={!!loading}>
                {loading === "manual" ? <span className="spinner spinner-light" /> : "Create Account"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
