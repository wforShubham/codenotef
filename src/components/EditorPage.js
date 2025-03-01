import React, { useEffect, useRef, useState } from "react";
import Client from "./Client";
import Editor from "./Editor";
import { initSocket } from "../Socket";
import { ACTIONS } from "../Actions";
import codelogo from "./cnlg.png";
import {
  useNavigate,
  useLocation,
  Navigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-hot-toast";


function EditorPage() {
  const [clients, setClients] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("python3");
  const codeRef = useRef(localStorage.getItem("savedCode") || ""); // Load saved code
  const Location = useLocation();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const socketRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      const handleErrors = (err) => {
        console.log("Error", err);
        toast.error("Socket connection failed, Try again later");
        navigate("/");
      };

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: Location.state?.username,
      });

      socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
        if (username !== Location.state?.username) {
          toast.success(`${username} joined the room.`);
        }
        setClients(clients);

        // Sync code when new user joins
        socketRef.current.emit(ACTIONS.SYNC_CODE, {
          code: codeRef.current,
          socketId,
        });
      });

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) => prev.filter((client) => client.socketId !== socketId));
      });
    };
    init();

    // Ensure user is logged in
    const isLoggedIn = localStorage.getItem("token");
    if (!isLoggedIn) {
      toast.error("Please log in to access this feature.");
      navigate("/login");
      return;
    }

    return () => {
      socketRef.current && socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  if (!Location.state) {
    return <Navigate to="/" />;
  }

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success(`Room ID is copied`);
    } catch (error) {
      console.log(error);
      toast.error("Unable to copy the room ID");
    }
  };

  const leaveRoom = async () => {
    navigate("/");
  };

  const handleCodeChange = (code) => {
    codeRef.current = code;
    localStorage.setItem("savedCode", code); // Save code to localStorage
  };

  return (
    <div className="vh-100 d-flex flex-column rounded-4">
      <div className="row flex-grow-1">
        {/* Client panel */}
        <div className="col-md-2 bg-dark text-light d-flex flex-column">
          <img
            src={codelogo}
            alt="Logo"
            className="img-fluid mx-auto mt-4"
            style={{ maxWidth: "150px", marginTop: "-43px" }}
          />
          <hr style={{ marginTop: "1rem" }} />

          {/* Client list container */}
          <div className="d-flex flex-column flex-grow-1 overflow-auto">
            <span className="mb-2">Members</span>
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>

          <hr />
          {/* Buttons */}
          <div className="mt-auto mb-5">
            <button
              className="btn btn-outline-success mx-1 rounded-4 w-100 mb-2"
              onClick={copyRoomId}
            >
              Copy Room ID
            </button>
            <button
              className="btn btn-outline-danger rounded-4 w-100"
              onClick={leaveRoom}
            >
              Leave Room
            </button>
          </div>
        </div>

        {/* Editor panel */}
        <div className="col-md-10 text-light d-flex flex-column">
          {/* Language selector */}
          <div className="bg-dark p-2 d-flex justify-content-end">
          </div>

          <Editor
            socketRef={socketRef}
            roomId={roomId}
            onCodeChange={handleCodeChange}
            initialCode={codeRef.current} // Load saved code into editor
          />
        </div>
      </div>
    </div>
  );
}

export default EditorPage;
