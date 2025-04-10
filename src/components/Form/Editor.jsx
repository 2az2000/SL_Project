import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "./editor.css";

export default function Editor({ value, setValue }) {
  const [isReady, setIsReady] = useState(false);

  return (
    <div className="editor-wrapper">
      <CKEditor
        editor={ClassicEditor}
        data={value || ''}
        onReady={editor => {
          // اطمینان از وجود editor
          if (editor) {
            setIsReady(true);
            try {
              // تنظیمات RTL
              const element = editor.editing.view.document.getRoot();
              if (element) {
                editor.editing.view.change(writer => {
                  writer.setAttribute('dir', 'rtl', element);
                  writer.setAttribute('lang', 'fa', element);
                });
              }
            } catch (error) {
              console.log('RTL setup error:', error);
            }
          }
        }}
        onChange={(event, editor) => {
          if (editor && isReady) {
            try {
              const data = editor.getData();
              setValue(data);
            } catch (error) {
              console.log('Change error:', error);
            }
          }
        }}
        config={{
          language: 'fa',
          toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            '|',
            'indent',
            'outdent',
            '|',
            'blockQuote',
            'insertTable',
            'undo',
            'redo'
          ],
          placeholder: 'متن خود را وارد کنید...',
          removePlugins: ['Title'],
        }}
      />
    </div>
  );
}