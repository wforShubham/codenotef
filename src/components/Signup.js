import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

const Signup = ({ darkMode }) => {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(""); 
  const [emailVerification, setEmailVerification] = useState(""); // New state for email verification message
  const navigate = useNavigate();

  // Function to validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, cpassword } = credentials;

    // Validate email format
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    } else {
      setEmailError(""); // Reset email error if valid
    }

    if (password !== cpassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    const response = await fetch("https://codenoteb.onrender.com/api/auth/createuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const json = await response.json();
    setLoading(false);

    if (json.success) {
      console.log(json);
      toast.success("Account Created! Check your email for verification.");
      setEmailVerification("A verification link has been sent to your email. Please verify before logging in.");
    } else {
      toast.error(json.error || "Invalid Credentials");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className={`container mt-2 ${darkMode ? "dark-mode text-light" : "text-dark"}`}>
      <div className="row justify-content-center">
        <div className="col-12 col-sm-8 col-md-6 col-lg-4">
          <h2 className="my-3 text-center">Sign up</h2>
          <form
            onSubmit={handleSubmit}
            className={`border p-4 my-3 border-info rounded-4 ${darkMode ? "bg-dark text-light border-secondary" : ""}`}
          >
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                placeholder="John"
                name="name"
                type="text"
                className={`form-control rounded-4 ${darkMode ? "bg-dark text-light border-secondary placeholder-light" : ""}`}
                id="name"
                onChange={onChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                placeholder="mail@gmail.com"
                name="email"
                type="email"
                className={`form-control rounded-4 ${darkMode ? "bg-dark text-light border-secondary placeholder-light" : ""}`}
                id="email"
                onChange={onChange}
              />
              {emailError && (
                <div className="text-danger mt-2">
                  {emailError} {/* Show the email error message */}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                placeholder="Min. 6 character"
                name="password"
                type="password"
                className={`form-control rounded-4 ${darkMode ? "bg-dark text-light border-secondary placeholder-light" : ""}`}
                id="password"
                onChange={onChange}
                minLength={5}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="cpassword" className="form-label">
                Confirm Password
              </label>
              <input
                placeholder="Min. 6 character"
                name="cpassword"
                type="password"
                className={`form-control rounded-4 ${darkMode ? "bg-dark text-light border-secondary placeholder-light" : ""}`}
                id="cpassword"
                onChange={onChange}
                minLength={5}
              />
            </div>
            <button
              type="submit"
              className="btn btn-outline-success rounded-4 w-100"
              disabled={loading} // Disable button while loading
            >
              {loading ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                "Create"
              )}
            </button>

            {emailVerification && (
              <div className="alert alert-info mt-3 text-center">
                {emailVerification}
              </div>
            )}

            <div className="mt-2 text-center">
              <Link to="/login" className="text-primary cursor-pointer">
                Already have an account?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
