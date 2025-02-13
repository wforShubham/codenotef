import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const ForgetPassword = ({ darkMode }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://codenoteb.onrender.com/api/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const json = await response.json();
      setLoading(false);

      if (response.ok) {
        toast.success("Check your email for the reset link");
        navigate("/login");
      } else {
        toast.error(json.error || "Invalid email");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong. Please try again.");
      console.error("Error sending reset email:", error);
    }
  };

  return (
    <div className={`container mt-3 ${darkMode ? "dark-mode text-light" : "text-dark"}`}>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <h2 className="text-center mb-4">Forgot Password</h2>
          <form onSubmit={handleSubmit} className={`border p-4 rounded-4 border-info ${darkMode ? "bg-dark text-light border-secondary" : ""}`}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                placeholder="mail@example.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                className={`form-control rounded-4 ${darkMode ? "bg-dark text-light border-secondary" : ""}`}
                id="email"
                name="email"
              />
            </div>
            <button type="submit" className="btn btn-outline-success rounded-4 w-100" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm"></span> : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
