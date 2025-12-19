import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile
} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../../Firebase";
import { doc, setDoc } from "firebase/firestore";

export const SignUp = () => {
  const [username, setUsername] = useState("");   
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (username.trim().length < 3) {
      return alert("Username must be at least 3 characters");
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await updateProfile(user, {
        displayName: username,
      });

      await sendEmailVerification(user);

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username,
        email,
        createdAt: new Date(),
      });

      alert("✅ Signup successful! Please verify your email.");
      navigate("/login");

    } catch (err) {
      console.error("Signup Error:", err);
      alert(err.message);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <form onSubmit={handleSignup}>
          <h2>Create Account</h2>

          {/* Username */}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />

          {/* Email */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />

          {/* Password */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6 characters)"
            required
          />

          <button type="submit">Sign Up</button>

          <p>
            Already have an account?
            <Link to="/login"> Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};
