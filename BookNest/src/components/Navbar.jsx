import { Link } from "react-router-dom";
import React from "react";
import { useAuth } from "./Context/AuthContext";

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <h2 className="logo">BookNest</h2>

      <input
        type="text"
        placeholder="Search by categories and title"
        className="SerachBox"
      />

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/myBooks">My_Books</Link></li>
        <li><Link to="/addBooks">Add_Books</Link></li>

        {user ? (
          <>
            <li style={{ color: "lightgreen" }}>
              Hi, {user.displayName || "User"}
            </li>
            <li>
              <button onClick={logout} style={{ cursor: "pointer" }}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};
