import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signOut
} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../../Firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (username.trim().length < 3) {
      return alert("Username must be at least 3 characters");
    }

    setLoading(true);

    try {
      // 1️⃣ Create user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // 2️⃣ Update profile
      await updateProfile(user, {
        displayName: username,
      });

      // 3️⃣ Save user in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username,
        email,
        createdAt: serverTimestamp(),
      });

      // 4️⃣ Send verification email
      await sendEmailVerification(user);

      // 5️⃣ IMPORTANT: logout user after signup
      await signOut(auth);

      alert("✅ Account created! Please verify your email before logging in.");

      // 6️⃣ Redirect to login
      navigate("/login");

    } catch (err) {
      console.error("Signup Error:", err);

      if (err.code === "auth/email-already-in-use") {
        alert("❌ Email already registered. Please login.");
      } else {
        alert(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <form onSubmit={handleSignup}>
          <h2>Create Account</h2>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6 characters)"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          <p>
            Already have an account?
            <Link to="/login"> Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};
