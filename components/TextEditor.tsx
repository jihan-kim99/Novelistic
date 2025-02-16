import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

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
        className="editor-container"
      />
      <style jsx global>{`
        .editor-wrapper {
          padding: 1rem;
        }
        .editor-container {
          background-color: white;
          border-radius: 4px;
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
