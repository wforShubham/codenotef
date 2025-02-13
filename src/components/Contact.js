import React, { useState } from "react";
import toast from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";

const Contact = ({ darkMode }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false); // State to handle loader

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    const response = await fetch("https://codenoteb.onrender.com/api/contact/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      }),
    });

    const json = await response.json();
    console.log(json);

    setLoading(false); // Stop loading

    if (json.success) {
      toast.success("Message submitted successfully");
    } else {
      toast.error("Failed to submit message");
    }
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div
      className={`container mt-3 ${
        darkMode ? "dark-mode text-light" : "text-dark"
      }`}
    >
      <div className="row justify-content-center">
        <div className={`col-12 col-md-6 col-lg-4`}>
          <h2 className="text-center mb-4">Contact Us</h2>
          <form
            onSubmit={handleSubmit}
            className={`border p-4 my-3 border-info rounded-4 ${
              darkMode ? "bg-dark text-light border-secondary" : ""
            }`}
          >
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                placeholder="Your Name"
                onChange={onChange}
                value={formData.name}
                type="text"
                className={`form-control rounded-4 ${
                  darkMode
                    ? "bg-dark text-light border-secondary placeholder-light"
                    : ""
                }`}
                id="name"
                name="name"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                placeholder="mail@example.com"
                onChange={onChange}
                value={formData.email}
                type="email"
                className={`form-control rounded-4 ${
                  darkMode
                    ? "bg-dark text-light border-secondary placeholder-light"
                    : ""
                }`}
                id="email"
                name="email"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                Message
              </label>
              <textarea
                placeholder="Your Message"
                onChange={onChange}
                value={formData.message}
                className={`form-control rounded-4 ${
                  darkMode
                    ? "bg-dark text-light border-secondary placeholder-light"
                    : ""
                }`}
                id="message"
                name="message"
                rows="4"
              />
            </div>

            <button
              type="submit"
              className="btn btn-outline-primary rounded-4 w-100"
              disabled={loading} // Disable button while loading
            >
              {loading ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
