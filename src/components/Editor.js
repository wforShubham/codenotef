import React, { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { ACTIONS } from "../Actions";

function Editor({ socketRef, roomId, onCodeChange }) {
  const [code, setCode] = useState("");

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          setCode(code);
        }
      });
    }
    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  const handleChange = (value) => {
    setCode(value);
    onCodeChange(value);
    if (socketRef.current) {
      socketRef.current.emit(ACTIONS.CODE_CHANGE, {
        roomId,
        code: value,
      });
    }
  };

  return (
    <div style={{ height: "600px" }}>
      <CodeMirror
        value={code}
        extensions={[javascript()]}
        theme={oneDark}
        height="100%"
        onChange={handleChange}
      />
    </div>
  );
}

export default Editor;
