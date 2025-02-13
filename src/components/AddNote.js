import { Copy, PlusCircle, Upload } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import noteContext from "../context/notes/noteContext";
import { useLocation, useNavigate } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { dracula } from "@uiw/codemirror-theme-dracula";

const AddNote = ({ darkMode }) => {
  const context = useContext(noteContext);
  const { addNote, editNote } = context;
  const location = useLocation();
  const navigate = useNavigate();

  const existingNote = location.state?.note;
  const readonly = location.state?.readOnly;

  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");

  // Compiler-related states
  const [language, setLanguage] = useState("javascript");
  const [stdin, setStdin] = useState(""); // User input for test cases
  const [output, setOutput] = useState("Output...");
  const [outputColor, setOutputColor] = useState("text-success");

  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title);
      setValue(existingNote.description);
      setTag(existingNote.tag);
    }
  }, [existingNote]);

  const handleSubmit = () => {
    if (existingNote) {
      editNote(existingNote._id, title, value, tag);
      toast.success("Note Updated Successfully");
      navigate("/codes");
    } else {
      addNote(title, value, tag);
      toast.success("Note Added Successfully");
      resetForm();
    }
  };

  const resetForm = () => {
    setTitle("");
    setValue("");
    setTag("");
  };

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
      toast.error(
        "Unsupported file type. Allowed: .txt, .js, .py, .java, .cpp, .c, .md"
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setTitle(fileNameWithoutExt);
      setTag(extensionToTag[fileExtension]);
      setValue(e.target.result);

      addNote(
        fileNameWithoutExt,
        e.target.result,
        extensionToTag[fileExtension]
      );
      navigate("/codes");
      toast.success("File Imported and Note Added Successfully");
    };
    reader.readAsText(file);
  };

  // Compiler Function
  const handleCompile = async () => {
    setOutput("Compiling...");
    setOutputColor("text-secondary");

    const decodeBase64 = (str) => {
      try {
        return atob(str);
      } catch (e) {
        return "Decoding Error: Invalid Base64 Data";
      }
    };

    const encodeToBase64 = (str) => {
      return btoa(unescape(encodeURIComponent(str)));
    };

    const requestBody = {
      code: encodeToBase64(value),
      language_id: getLanguageId(language),
      stdin: encodeToBase64(stdin),
      base64_encoded: true, // Tell API to return Base64 data
    };

    try {
      const response = await fetch(
        "https://codenoteb.onrender.com/api/compiler/compile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();
      console.log("API Response:", data); // Debugging

      if (data.stdout) {
        setOutput(decodeBase64(data.stdout)); // ✅ Decode output
        setOutputColor("text-success");
        toast.success("Code Executed Successfully");
      } else if (data.stderr) {
        setOutput(`Error: ${decodeBase64(data.stderr)}`); // ✅ Decode error message
        setOutputColor("text-danger");
        toast.error("Compilation Error");
      } else if (data.compile_output) {
        setOutput(`Error: ${decodeBase64(data.compile_output)}`); // ✅ Decode error message
        setOutputColor("text-danger");
        toast.error("Compilation Error");
      } else {
        setOutput("No output received.");
        setOutputColor("text-danger");
        toast.error("Something went wrong");
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setOutputColor("text-danger");
      toast.error("Error during compilation");
    }
  };

  // Function to map language names to Judge0 language IDs
  const getLanguageId = (lang) => {
    const langMap = {
      javascript: 63,
      python: 71,
      java: 62,
      cpp: 54,
      c: 50,
    };
    return langMap[lang] || 63; // Default to JavaScript if not found
  };

  return (
    <div className={`container mb-3 mt-0 ${darkMode ? "dark-mode" : ""}`}>
      <div className="row justify-content-center">
        <div className="col-12 col-md-10">
          <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
            <input
              type="text"
              disabled={readonly}
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`form-control rounded-4 flex-grow-1 ${
                darkMode ? "dark-mode" : ""
              }`}
              required
            />

            {!readonly && (
              <label className="btn btn-outline-info rounded-4">
                <Upload size={20} />
                <input
                  type="file"
                  accept=".txt,.js,.py,.java,.cpp,.c,.md"
                  onChange={handleFileImport}
                  style={{ display: "none" }}
                />
              </label>
            )}

            {!readonly && (
              <button
                className="btn btn-outline-success rounded-4"
                onClick={handleSubmit}
                disabled={title.length < 3 || value.length < 5}
              >
                {existingNote ? "Update" : "Create"}
              </button>
            )}

            {existingNote && (
              <button
                className="btn btn-secondary rounded-4"
                onClick={() => navigate("/")}
              >
                <PlusCircle size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="col-12 col-md-10">
          <div className="card rounded-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div className="d-flex gap-2">
                <div
                  className="rounded-circle bg-danger"
                  style={{ width: "12px", height: "12px" }}
                ></div>
                <div
                  className="rounded-circle bg-warning"
                  style={{ width: "12px", height: "12px" }}
                ></div>
                <div
                  className="rounded-circle bg-success"
                  style={{ width: "12px", height: "12px" }}
                ></div>
              </div>
              <button
                className="btn btn-light"
                onClick={() => {
                  navigator.clipboard.writeText(value);
                  toast.success("Copied to Clipboard", {
                    position: "top-right",
                  });
                }}
              >
                <Copy size={20} />
              </button>
            </div>

            <div className="card-body">
              <CodeMirror
                value={value}
                height="auto"
                minHeight="300px"
                maxHeight="600px"
                extensions={[javascript()]}
                theme={dracula}
                onChange={(val) => setValue(val)}
                editable={!readonly}
                className="rounded-4 code-editor"
              />

              <div className="mt-3">
                <input
                  type="text"
                  disabled={readonly}
                  placeholder="Tag"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className={`form-control rounded-4 ${
                    darkMode ? "dark-mode" : ""
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Compiler Section */}
        <div className="row justify-content-center">
        <div className="col-12 col-md-10 mt-4 border rounded-4">
          <div className={'d-flex gap-2 mt-3 ${darkMode ? "dark-mode" : ""} '}>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`form-control rounded-4 ${
                darkMode ? "dark-mode" : ""
              }`}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
            </select>

            <button
              className="btn btn-outline-primary rounded-4"
              onClick={handleCompile}
            >
              Run
            </button>
          </div>

          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            placeholder="Enter input for test cases"
            rows="3"
            className={`form-control rounded-4 mt-3 ${
              darkMode ? "dark-mode" : ""
            } `}
          />

          <textarea
            value={output}
            readOnly
            rows="10"
            className={`form-control mb-3 rounded-4 mt-3 ${outputColor} ${
              darkMode ? "dark-mode" : ""
            } `}
            style={{ minHeight: "200px" }}
          />
        </div>
        </div>
      </div>
    </div>
  );
};

export default AddNote;
