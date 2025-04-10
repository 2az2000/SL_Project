import React, { useEffect, useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function Editor({ value, setValue }) {
  const editorRef = useRef(null);

  // مدیریت unmounting
  useEffect(() => {
    return () => {
      if (editorRef.current) {
        editorRef.current
          .destroy()
          .catch((error) => console.log("Error destroying editor:", error));
      }
    };
  }, []);

  return (
    <div className="editor-wrapper">
      <CKEditor
        ref={editorRef}
        editor={ClassicEditor}
        data={value}
        onReady={(editor) => {
          editorRef.current = editor;
          // اضافه کردن کلاس RTL به محیط ویرایشگر
          editor.editing.view.change((writer) => {
            writer.setAttribute(
              "dir",
              "rtl",
              editor.editing.view.document.getRoot()
            );
          });
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          setValue(data);
        }}
        onError={(error, { willEditorRestart }) => {
          if (willEditorRestart) {
            editorRef.current = null;
          }
        }}
        config={{
          language: "fa",
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "|",
            "indent",
            "outdent",
            "|",
            "imageUpload",
            "blockQuote",
            "insertTable",
            "mediaEmbed",
            "undo",
            "redo",
          ],
          removePlugins: ["Title"],
          placeholder: "متن خود را وارد کنید...",
        }}
      />
    </div>
  );
}
