import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, CheckSquare } from 'lucide-react';

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content,
  onChange,
  placeholder = 'Digite seu texto aqui...',
  editable = true,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'task-list',
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'task-item',
        },
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('URL da imagem:');
    
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL do link:', previousUrl);
    
    // cancelled
    if (url === null) {
      return;
    }
    
    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="tiptap-editor border border-gray-300 rounded-md overflow-hidden">
      {editable && (
        <div className="flex items-center p-2 bg-gray-50 border-b border-gray-300">
          <button 
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
            title="Negrito"
          >
            <Bold className="h-5 w-5" />
          </button>
          <button 
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1 rounded hover:bg-gray-200 ml-1 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
            title="Itálico"
          >
            <Italic className="h-5 w-5" />
          </button>
          <button 
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1 rounded hover:bg-gray-200 ml-1 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
            title="Lista com marcadores"
          >
            <List className="h-5 w-5" />
          </button>
          <button 
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1 rounded hover:bg-gray-200 ml-1 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
            title="Lista numerada"
          >
            <ListOrdered className="h-5 w-5" />
          </button>
          <button 
            type="button"
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={`p-1 rounded hover:bg-gray-200 ml-1 ${editor.isActive('taskList') ? 'bg-gray-200' : ''}`}
            title="Lista de tarefas"
          >
            <CheckSquare className="h-5 w-5" />
          </button>
          <button 
            type="button"
            onClick={setLink}
            className={`p-1 rounded hover:bg-gray-200 ml-1 ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
            title="Adicionar link"
          >
            <LinkIcon className="h-5 w-5" />
          </button>
          <button 
            type="button"
            onClick={addImage}
            className="p-1 rounded hover:bg-gray-200 ml-1"
            title="Adicionar imagem"
          >
            <ImageIcon className="h-5 w-5" />
          </button>
        </div>
      )}
      <EditorContent 
        editor={editor} 
        className={`p-3 min-h-[120px] prose max-w-none ${!editable ? 'prose-sm' : ''}`}
      />
    </div>
  );
};

// Para exibir o conteúdo do TipTap sem editor
export const TiptapContent: React.FC<{ content: string }> = ({ content }) => {
  // Verificar se o conteúdo existe e convertê-lo para string de forma segura
  const contentStr = typeof content === 'string' ? content : '';
  
  // Se não houver conteúdo ou for apenas uma string vazia/espaços em branco, não renderiza nada
  if (!contentStr || contentStr.trim() === '' || contentStr === '<p></p>') {
    return null;
  }
  
  return (
    <div 
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: contentStr }} 
    />
  );
};

export default TiptapEditor;
