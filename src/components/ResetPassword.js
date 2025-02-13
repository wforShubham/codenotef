import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const ResetPassword = ({ darkMode }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id, token } = useParams();

  // Decode token (important for special characters)
  const decodedToken = decodeURIComponent(token);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`https://codenoteb.onrender.com/api/reset-password/${id}/${decodedToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const json = await response.json();
      setLoading(false);

      if (response.ok) {
        toast.success("Password reset successfully");
        navigate("/login");
      } else {
        toast.error(json.error || "Invalid or expired link");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong. Please try again");
      console.error("Error resetting password:", error);
    }
  };

  return (
    <div className={`container mt-3 ${darkMode ? "dark-mode text-light" : "text-dark"}`}>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <h2 className="text-center mb-4">Reset Password</h2>
          <form onSubmit={handleSubmit} className={`border p-4 rounded-4 border-info ${darkMode ? "bg-dark text-light border-secondary" : ""}`}>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">New Password</label>
              <input
                placeholder="Min. 6 characters"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                className={`form-control rounded-4 ${darkMode ? "bg-dark text-light border-secondary" : ""}`}
                id="password"
                name="password"
              />
            </div>
            <button type="submit" className="btn btn-outline-success rounded-4 w-100" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm"></span> : "Reset"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
