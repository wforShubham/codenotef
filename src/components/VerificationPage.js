import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const VerificationPage = () => {
  const { token } = useParams(); // Get the token from URL params
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your email...");
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`https://codenoteb.onrender.com/api/auth/verify/${token}`, {
          method: "GET",
        });

        const data = await response.json();
        if (data.success) {
          setMessage("Your email has been verified successfully! You can now log in.");
          setSuccess(true);
          setTimeout(() => navigate("/login"), 3000); // Redirect to login after 3 sec
        } else {
          setMessage(data.error || "Invalid or expired verification link.");
          setSuccess(false);
        }
      } catch (error) {
        setMessage("Something went wrong. Please try again.");
        setSuccess(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div style={styles.container}>
      <h2>Email Verification</h2>
      <p style={{ color: success ? "green" : "red" }}>{message}</p>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    textAlign: "center",
  },
};

export default VerificationPage;
