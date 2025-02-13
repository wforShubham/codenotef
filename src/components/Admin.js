import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react"; // Import the Trash2 icon
import { useNavigate } from "react-router-dom";

const Admin = ({ darkMode }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      toast.error("Login to access");
      return;
    }
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://codenoteb.onrender.com/api/contact/messages", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        toast.error("Failed to fetch messages");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
    setLoading(false);
  };

  const deleteMessage = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://codenoteb.onrender.com/api/contact/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Message deleted successfully");
        setMessages(messages.filter((message) => message._id !== id));
      } else {
        toast.error("Failed to delete message");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    if(localStorage.getItem("token")) {
      fetchMessages();
    }
  }, []);

  return (
    <div className={`container mt-3 ${darkMode ? "dark-mode text-light" : "text-dark"}`}>
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <h2 className="text-center mb-4">Admin Messages</h2>

          <div
            className={`border p-4 my-3 border-info rounded-4 ${darkMode ? "bg-dark text-light border-secondary" : ""}`}
          >
            {loading ? (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div>
                {messages.length > 0 ? (
                  <ul className="list-group">
                    {messages.map((message) => (
                      <li
                        key={message._id}
                        className={`list-group-item d-flex justify-content-between align-items-center ${darkMode ? "bg-dark text-light border-secondary" : ""}`}
                      >
                        <div>
                          <h5>{message.name}</h5>
                          <p className="mb-1">{message.email}</p>
                          <p className="mb-1">{message.message}</p>
                        </div>
                        <button
                          className="btn btn-outline-danger rounded-circle"
                          onClick={() => deleteMessage(message._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center">No messages available.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
