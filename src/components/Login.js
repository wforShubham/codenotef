import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";


const Login = ({ darkMode , setIsAuthenticated }) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [forgetPass, setForgetPass] = useState(false);
  const navigate = useNavigate();


  // 🔥 Handle Manual Email/Password Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("https://codenoteb.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const json = await response.json();
    setLoading(false);

    if (json.success) {
      localStorage.setItem("token", json.authtoken);
      navigate("/");
      toast.success("Logged in Successfully");
      window.location.reload();
    } else {
      setForgetPass(true);
      toast.error("Invalid Credentials");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
      <div className={`container mt-3 ${darkMode ? "dark-mode text-light" : "text-dark"}`}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-4">
            <h2 className="text-center mb-4">Login</h2>
            <form
              onSubmit={handleSubmit}
              className={`border p-4 my-3 rounded-4 ${darkMode ? "bg-dark text-light border-secondary" : "border-info"}`}
            >
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input
                  type="email"
                  className={`form-control rounded-4 ${darkMode ? "bg-dark text-light border-secondary" : ""}`}
                  id="email"
                  name="email"
                  value={credentials.email}
                  onChange={onChange}
                  placeholder="mail@example.com"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className={`form-control rounded-4 ${darkMode ? "bg-dark text-light border-secondary" : ""}`}
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={onChange}
                  placeholder="Min. 6 characters"
                />
              </div>

              <button type="submit" className="btn btn-outline-success rounded-4 w-100" disabled={loading}>
                {loading ? <div className="spinner-border spinner-border-sm"></div> : "Login"}
              </button>

              <div className="mt-3 text-center">
                {forgetPass ? <Link to="/forget-password">Forgot Password?</Link> : <Link to="/signup">Create an account?</Link>}
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

export default Login;
