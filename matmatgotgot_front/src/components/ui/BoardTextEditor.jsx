import { EditorContent, useEditor } from '@tiptap/react';
import styles from './BoardTextEditor.module.css';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import ResizeImage from 'tiptap-extension-resize-image';
import axios from 'axios';
import { useEffect } from 'react';

const BoardTextEditor = ({ data, setData }) => {
  const editor = useEditor({
    extensions: [StarterKit, Image, ResizeImage],
    content: data || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setData(editor.getHTML());
    },
  });
  useEffect(() => {
    if (editor && data && editor.isEmpty) {
      // 에디터가 있고, data가 들어왔는데 현재 에디터가 비어있다면 내용을 세팅함
      editor.commands.setContent(data);
    }
  }, [editor, data]);
  return (
    <div className={styles.editor_wrap}>
      <MenuBar editor={editor} />
      <div style={{ position: 'relative' }}>
        {!data && (
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: 20,
              color: 'gray',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            내용을 입력하세요.
          </div>
        )}
        <EditorContent editor={editor} className={styles.editor_content} />
      </div>
    </div>
  );
};

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    input.onchange = () => {
      const file = input.files && input.files[0];
      if (!file) {
        return;
      }
      const form = new FormData();
      form.append('image', file);
      axios
        .post(`${import.meta.env.VITE_IMG_SERVER}/boards/image-upload`, form, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => {
          //공용폴더 이미지
          const imageUrl = `${import.meta.env.VITE_IMG_SERVER}/editor/${res.data}`;
          editor.chain().focus().setImage({ src: imageUrl }).run();
        })
        .catch((err) => {
          console.log(err);
        });
    };
  };

  return (
    <div className={styles.menu_bar}>
      <button
        type="button"
        className={editor.isActive('bold') ? styles.active : ''}
        onClick={() => {
          editor.chain().focus().toggleBold().run();
        }}
      >
        Bold
      </button>
      <button
        type="button"
        className={editor.isActive('italic') ? styles.active : ''}
        onClick={() => {
          editor.chain().focus().toggleItalic().run();
        }}
      >
        Italic
      </button>
      <button
        type="button"
        className={
          editor.isActive('heading', { level: 2 }) ? styles.active : ''
        }
        onClick={() => {
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        }}
      >
        H2
      </button>
      <button
        type="button"
        className={editor.isActive('bulletList') ? styles.active : ''}
        onClick={() => {
          editor.chain().focus().toggleBulletList().run();
        }}
      >
        List
      </button>
      <button type="button" onClick={addImage}>
        Image
      </button>

      {/* --- 되돌리기 버튼 추가 --- */}
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()} // 되돌릴 내용이 없을 때 버튼 비활성화 (선택 사항)
      >
        Undo
      </button>
    </div>
  );
};

export default BoardTextEditor;
