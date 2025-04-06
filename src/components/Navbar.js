import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import codelogo from "./cnlg.png";
import toast from "react-hot-toast";
import { BsSun, BsMoon } from "react-icons/bs";

const Navbar = ({ darkMode, setDarkMode, isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);

  // Fetch user authentication & role
  const fetchUserRole = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUserRole(null);
        setIsAuthenticated(false);
        return;
      }

      const response = await fetch("https://codenoteb.onrender.com/api/user-role", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserRole(data.role);
        setIsAuthenticated(true);
      } else {
        setUserRole(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      setUserRole(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserRole(null);
    navigate("/login");
    toast.success("Logged Out Successfully");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={codelogo} width={200} height={50} alt="CodeNote Logo" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/codes" ? "active" : ""}`} to="/codes">
                Codes
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/chome" ? "active" : ""}`} to="/chome">
                CodeTogether
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/about" ? "active" : ""}`} to="/about">
                About
              </Link>
            </li>

            {/* Show Admin page for admins, Contact for others */}
            {userRole === "admin" ? (
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/admin" ? "active" : ""}`} to="/admin">
                  Admin
                </Link>
              </li>
            ) : (
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/contact" ? "active" : ""}`} to="/contact">
                  Contact
                </Link>
              </li>
            )}
          </ul>

          {/* Dark Mode Toggle */}
          <button
            className="btn rounded-circle mx-2"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: darkMode ? "#f8f9fa" : "#343a40",
              border: "none",
              color: darkMode ? "#121212" : "#ffffff",
              cursor: "pointer",
            }}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <BsSun size={20} /> : <BsMoon size={20} />}
          </button>

          {/* Show Login/Signup if not authenticated, otherwise Logout */}
          {!isAuthenticated ? (
            <div>
              <Link className="btn btn-outline-success mx-1 rounded-4" to="/login">
                Login
              </Link>
              <Link className="btn btn-outline-success mx-1 rounded-4" to="/signup">
                Signup
              </Link>
            </div>
          ) : (
            <button onClick={handleLogout} className="btn btn-outline-danger rounded-4">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
