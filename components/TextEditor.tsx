import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useTheme } from "../contexts/ThemeContext";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <p>Loading Editor...</p>,
});

interface TextEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
  onSave?: (content: string) => Promise<void>;
}

const TextEditor: React.FC<TextEditorProps> = ({
  initialContent,
  onChange,
  onSave,
}) => {
  const { isDarkMode } = useTheme();
  const [value, setValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialContent) {
      setValue(initialContent);
    }
  }, [initialContent]);

  const modules = {
    toolbar: {
      container: [
        [{ font: [] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["link", "image"],
        ["clean"],
      ],
    },
  };

  const formats = [
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "align",
    "link",
    "image",
  ];

  const handleChange = (content: string) => {
    setValue(content);
    onChange(content);

    // Auto-save after user stops typing
    if (onSave) {
      const timeoutId = setTimeout(() => {
        handleSave(content);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  };

  const handleSave = async (content: string) => {
    if (!onSave || isSaving) return;

    try {
      setIsSaving(true);
      await onSave(content);
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="editor-wrapper">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        className={`editor-container ${isDarkMode ? "dark-mode" : ""}`}
      />
      <style jsx global>{`
        .editor-wrapper {
          padding: 1rem;
        }
        .editor-container {
          background-color: ${isDarkMode ? "#000000" : "white"};
          color: ${isDarkMode ? "#fff" : "#000"};
          border-radius: 4px;
        }
        .editor-container.dark-mode .ql-toolbar {
          background-color: #1a1a1a;
          border-color: #333;
        }
        .editor-container.dark-mode .ql-container {
          background-color: #000000;
          border-color: #333;
        }
        .editor-container.dark-mode .ql-editor {
          color: #fff !important; /* Force white text in dark mode */
          background-color: #000000;
        }
        .editor-container.dark-mode .ql-editor p {
          color: #fff !important; /* Ensure paragraphs also have white text */
        }
        .editor-container.dark-mode .ql-stroke {
          stroke: #fff;
        }
        .editor-container.dark-mode .ql-fill {
          fill: #fff;
        }
        .editor-container.dark-mode .ql-picker {
          color: #fff;
        }
        .ql-toolbar {
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
          border: 1px solid #ccc;
          border-bottom: none;
        }
        .ql-container {
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
          border: 1px solid #ccc;
          min-height: 200px;
        }
        .ql-editor {
          min-height: 200px;
        }
      `}</style>
    </div>
  );
};

export default TextEditor;
