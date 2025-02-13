import { useContext, useRef } from "react";
import noteContext from "../context/notes/noteContext";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "bootstrap-icons/font/bootstrap-icons.css";

const HomePage = ({ darkMode }) => {
  const context = useContext(noteContext);
  const { addNote } = context;
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Reference for file input

  const extensionToTag = {
    js: "JavaScript",
    py: "Python",
    java: "Java",
    cpp: "C++",
    c: "C",
    txt: "Text",
    md: "Markdown",
  };

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop().toLowerCase();
    const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");

    if (!extensionToTag[fileExtension]) {
      toast.error("Unsupported file type. Allowed: .txt, .js, .py, .java, .cpp, .c, .md");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      addNote(fileNameWithoutExt, e.target.result, extensionToTag[fileExtension]);
      navigate("/codes");
      toast.success("File Imported and Note Added Successfully");
    };
    reader.readAsText(file);
  };

  const handleClick = (title) => {
    const isLoggedIn = localStorage.getItem("token");

    if (!isLoggedIn) {
      toast.error("Please log in to access this feature.");
      navigate("/login");
      return;
    }

    if (title === "Add New Code") {
      navigate("/addnote");
    } else if (title === "Your Code" || title === "Share Code") {
      navigate("/codes");
    } else if (title === "Upload Code") {
      fileInputRef.current.click(); // Open file input
    }
  };

  const cards = [
    { title: "Add New Code", description: "Create a new Code and save it.", icon: "bi bi-file-earmark-plus" },
    { title: "Upload Code", description: "Upload your existing Code.", icon: "bi bi-upload" },
    { title: "Your Code", description: "Manage all your Code.", icon: "bi bi-journal-text" },
    { title: "Share Code", description: "Easily share Code with others.", icon: "bi bi-share" }
  ];

  return (
    <div className="container mt-5 mb-2">
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-2 g-4">
        {cards.map((card, index) => (
          <div key={index} className="col">
            <div
              className={`card text-center p-4 shadow-lg border-0 rounded-4 ${darkMode ? "bg-dark text-light" : "bg-light text-dark"}`}
              onClick={() => handleClick(card.title)}
              style={{
                transition: "all 0.3s ease-in-out",
                cursor: "pointer",
                height: "100%",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                transform: "scale(1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0px 8px 20px rgba(0, 0, 0, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.1)";
              }}
            >
              <div className="card-body">
                <i className={`${card.icon} text-primary display-4 mb-3`} style={{ fontSize: "3rem" }}></i>
                <h5 className="card-title mb-3">{card.title}</h5>
                <p className="card-text">{card.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hidden File Input for Uploading Code */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".txt,.js,.py,.java,.cpp,.c,.md"
        onChange={handleFileImport}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default HomePage;
