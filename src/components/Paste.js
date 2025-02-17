import { Calendar, Copy, Eye, PencilLine, Trash2, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import { useContext, useEffect, useState } from "react";
import noteContext from "../context/notes/noteContext";
import { useNavigate } from "react-router-dom";

// Utility function to format date
const formatDate = (date) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
};

// Utility function to truncate text
const truncateText = (text, limit) => {
  return text.length > limit ? `${text.substring(0, limit)}...` : text;
};

const Paste = ({ darkMode }) => {
  const context = useContext(noteContext);
  const { notes, getNotes, deleteNote } = context;
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [loading, setLoading] = useState(true); // Track loading state
  const navigate = useNavigate();

  // Fetch notes on component mount
  useEffect(() => {
    if (localStorage.getItem("token")) {
      getNotes();
      setLoading(false);
    } else {
      navigate("/login");
    }
  }, []);

  // Filter notes based on search term
  const filteredPastes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle delete note
  const handleDelete = (noteId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this note?");
    if (confirmDelete) {
      deleteNote(noteId);
      toast.success("Deleted Successfully");
    }
  };

  // Handle share note
  const shareNote = (title, description) => {
    const shareText = `📝 ${title}\n\n${description}`;

    if (navigator.share) {
      navigator
        .share({
          title: title,
          text: shareText,
        })
        .then(() => toast.success("Shared Successfully!"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      const encodedText = encodeURIComponent(shareText);
      const whatsappUrl = `https://wa.me/?text=${encodedText}`;
      const mailtoUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodedText}`;

      const choice = window.prompt(
        "Choose an option: \n1️⃣ WhatsApp \n2️⃣ Email \n3️⃣ Copy to Clipboard",
        "1"
      );

      if (choice === "1") {
        window.open(whatsappUrl, "_blank");
      } else if (choice === "2") {
        window.open(mailtoUrl, "_blank");
      } else {
        navigator.clipboard.writeText(shareText);
        toast.success("Copied to Clipboard!");
      }
    }
  };

  return (
    <div className={`container mb-2 ${darkMode ? "dark-mode" : ""}`}>
      <div className="d-flex justify-content-center mb-4">
        <input
          type="search"
          placeholder="Search Code Note..."
          className={`form-control rounded-4 ${darkMode ? "bg-dark text-light border-secondary placeholder-light" : ""}`}
          style={{ width: "100%", maxWidth: "400px" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={`card rounded-4 ${darkMode ? "bg-dark text-light border-secondary" : ""}`}>
        <div className="card-header d-flex justify-content-between">
          <h2 className={`h4 ${darkMode ? "text-light" : "text-dark"}`}>All Codes</h2>
          <div className="d-flex gap-2 mt-3 mx-1">
            <div className="rounded-circle bg-danger" style={{ width: "12px", height: "12px" }}></div>
            <div className="rounded-circle bg-warning" style={{ width: "12px", height: "12px" }}></div>
            <div className="rounded-circle bg-success" style={{ width: "12px", height: "12px" }}></div>
          </div>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : filteredPastes.length > 0 ? (
            <div className="row">
              {filteredPastes.map((note) => (
                <div key={note._id} className="col-12 mb-3">
                  <div className={`card mb-3 rounded-4 ${darkMode ? "bg-dark text-light border-secondary" : ""}`}>
                    <div className="card-body d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className={`card-title ${darkMode ? "text-light" : "text-dark"}`}>
                          {note.title}
                        </h5>
                        {/* <p className={`card-text ${darkMode ? "text-light" : "text-dark"}`}>
                          {truncateText(note.description, 100)}
                        </p> */}
                        <small className={`${darkMode ? "text-secondary" : "text-muted"}`}>
                          <Calendar size={16} className="me-1" />
                          {formatDate(note.date)}
                        </small>
                      </div>
                      <div className="d-flex gap-2 flex-wrap">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => {
                            localStorage.removeItem("noteTitle");
                            localStorage.removeItem("noteDescription");
                            localStorage.removeItem("noteTag");
                            navigate("/updatenote", { state: { note } });
                          }}
                        >
                          <PencilLine size={16} />
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(note._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          className="btn btn-outline-warning btn-sm"
                          onClick={() => {
                            toast.success(`Viewing note: ${note.title}`);
                            navigate("/updatenote", { state: { note, readOnly: true } });
                          }}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="btn btn-outline-success btn-sm"
                          onClick={() => {
                            navigator.clipboard.writeText(note.description);
                            toast.success("Copied to Clipboard");
                          }}
                        >
                          <Copy size={16} />
                        </button>
                        <button
                          className="btn btn-outline-info btn-sm"
                          onClick={() => shareNote(note.title, note.description)}
                        >
                          <Share2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-danger">No Notes Found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Paste;
