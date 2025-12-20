import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = res.user;

      // ✅ EMAIL VERIFICATION CHECK (ONLY HERE)
      if (!user.emailVerified) {
        await signOut(auth);
        setError("Please verify your email before logging in.");
        setLoading(false);
        return;
      }

      console.log("✅ User logged in successfully!");
      setEmail("");
      setPassword("");
      navigate("/");

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email first");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setError("");
    setMessage("");
    setResetLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("📩 Password reset link sent to your email.");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.message);
    }

    setResetLoading(false);
  };

  return (
    <div className="login_page">
      <div className="login-container">
        <div className="login-box">
          <h2>LOGIN</h2>

          <form onSubmit={handleLogin}>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}

            <button type="submit" disabled={loading} className="login_button">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <button
            onClick={handleResetPassword}
            disabled={resetLoading}
            className="forgot_button"
          >
            {resetLoading ? "Sending..." : "Forgot Password?"}
          </button>
        </div>
      </div>
    </div>
  );
};
