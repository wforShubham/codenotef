import "./App.css";
import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import NoteState from "./context/notes/NoteState";
import Alert from "./components/Alert";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Paste from "./components/Paste";
import AddNote from "./components/AddNote";
import Notes from "./components/Notes";
import Contact from "./components/Contact";
import Admin from "./components/Admin";
import ForgetPassword from "./components/ForgetPassword";
import ResetPassword from "./components/ResetPassword";
import VerificationPage from "./components/VerificationPage";
import EditorPage from "./components/EditorPage";
import Chome from "./components/Chome";



function App() {
  const [alert, setAlert] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#121212" : "#dae2eb";
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);
  

  const showAlert = (message, type) => {
    setAlert({ msg: message, type: type });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };


  return (
    <NoteState>
      <Router>
        <Navbar  darkMode={darkMode} setDarkMode={setDarkMode} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <Alert alert={alert} />
        <div className={`container ${darkMode ? "dark-mode" : ""}`}>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/addnote" element={<Notes darkMode={darkMode} />} />
            <Route exact path="/about" element={<About />} />
            <Route exact path="/codes" element={<Paste darkMode={darkMode} />} />
            <Route exact path="/login" element={<Login darkMode={darkMode} setIsAuthenticated={setIsAuthenticated}  />} />
            <Route exact path="/signup" element={<Signup darkMode={darkMode} />} />
            <Route exact path="/updatenote" element={<AddNote darkMode={darkMode} />} />
            <Route exact path="/admin" element={<Admin darkMode={darkMode} />} />
            <Route exact path="/contact" element={<Contact darkMode={darkMode} />} />
            <Route exact path="/forget-password" element={<ForgetPassword darkMode={darkMode} />} />
            <Route exact path="/reset-password/:id/:token" element={<ResetPassword darkMode={darkMode} />} />
            <Route exact path="/verify-email/:token" element={<VerificationPage darkMode={darkMode} />} />
            <Route exact path="/editor/:roomId" element={<EditorPage darkMode={darkMode} />} />
            <Route exact path="/chome" element={<Chome darkMode={darkMode} />} />
          </Routes>
        </div>
      </Router>
    </NoteState>
  );
}

export default App;
