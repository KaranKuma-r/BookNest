import React, { useState } from "react";
import { createUserWithEmailAndPassword,sendEmailVerification  } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../Firebase";
import { Link } from "react-router-dom";

export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleSignup = async (e) => {
  e.preventDefault();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await sendEmailVerification(user);
    alert("✅ Signup successful! Please verify your email before logging in.");
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
          <h2>Sign Up</h2>
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
          <button type="submit">Sign Up</button>
          <p>
            Already have an account? 
             <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};
