'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import imageCompression from 'browser-image-compression';
import { v4 as uuidv4 } from 'uuid';

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
}

const MenuBar = ({ editor, isUploading, onSelectImage }: { editor: any, isUploading: boolean, onSelectImage: () => void }) => {
    if (!editor) {
        return null;
    }

    const toggleLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Indtast URL', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const navButtonClass = (isActive: boolean) =>
        `p-2.5 rounded-lg transition-colors flex items-center justify-center ${isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'}`;

    return (
        <div className="flex flex-wrap items-center gap-1.5 p-2 bg-muted/20 border-b border-border/60 rounded-t-2xl sticky top-0 z-10 backdrop-blur-sm">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={navButtonClass(editor.isActive('bold'))}
                title="Fed tekst"
            >
                <Bold className="w-5 h-5" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={navButtonClass(editor.isActive('italic'))}
                title="Kursiv tekst"
            >
                <Italic className="w-5 h-5" />
            </button>

            <div className="w-px h-6 bg-border mx-1"></div>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={navButtonClass(editor.isActive('heading', { level: 2 }))}
                title="Underoverskrift 1"
            >
                <Heading2 className="w-5 h-5" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={navButtonClass(editor.isActive('heading', { level: 3 }))}
                title="Underoverskrift 2"
            >
                <Heading3 className="w-5 h-5" />
            </button>

            <div className="w-px h-6 bg-border mx-1"></div>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={navButtonClass(editor.isActive('bulletList'))}
                title="Punktliste"
            >
                <List className="w-5 h-5" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={navButtonClass(editor.isActive('orderedList'))}
                title="Nummereret liste"
            >
                <ListOrdered className="w-5 h-5" />
            </button>

            <div className="w-px h-6 bg-border mx-1"></div>

            <button
                type="button"
                onClick={toggleLink}
                className={navButtonClass(editor.isActive('link'))}
                title="Indsæt link"
            >
                <LinkIcon className="w-5 h-5" />
            </button>

            <div className="ml-auto">
                <button
                    type="button"
                    onClick={onSelectImage}
                    disabled={isUploading}
                    className={`p-2 px-3 flex items-center gap-2 rounded-lg transition-all font-bold text-xs uppercase tracking-widest ${isUploading ? 'bg-muted text-muted-foreground' : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground shadow-sm'}`}
                    title="Indsæt billede"
                >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                    {isUploading ? 'Uploader...' : 'Indsæt Billede'}
                </button>
            </div>
        </div>
    );
};

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            ImageExtension.configure({
                HTMLAttributes: {
                    class: 'rounded-xl shadow-md max-h-[600px] w-auto my-6 border border-border/40 object-cover',
                },
            }),
            LinkExtension.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline underline-offset-4 font-bold cursor-pointer hover:text-primary/80 transition-colors',
                },
            }),
            Placeholder.configure({
                placeholder: 'Begynd din fortælling her... (Marker tekst for at formatere)',
                emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:text-muted-foreground before:opacity-60 before:float-left before:h-0 before:pointer-events-none',
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-6 text-foreground',
            },
        },
    });

    // Update editor content if standard content prop changes out of banding (e.g., loaded from local storage)
    // Avoid re-rendering continuously when user types
    if (editor && content !== editor.getHTML() && !editor.isFocused) {
        // Findes der ændringer vi skal læse ind?
        // editor.commands.setContent(content) re-renders, best to do it only if completely different
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !editor) return;

        // Tjek filtype
        if (!file.type.startsWith('image/')) {
            alert('Kun billedfiler understøttes.');
            return;
        }

        setIsUploading(true);

        try {
            const options = {
                maxSizeMB: 0.8,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
                fileType: 'image/webp',
            };

            const compressedFile = await imageCompression(file, options);
            const fileExt = 'webp';
            const fileName = `${uuidv4()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('sejler-billeder')
                .upload(filePath, compressedFile, {
                    cacheControl: '3600',
                    upsert: false,
                    contentType: 'image/webp'
                });

            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabase.storage
                .from('sejler-billeder')
                .getPublicUrl(filePath);

            const publicUrl = publicUrlData.publicUrl;

            // Indsæt billedet i editoren!
            editor.chain().focus().setImage({ src: publicUrl }).run();

        } catch (error) {
            console.error('Billedupload fejlede:', error);
            alert('Kunne ikke uploade billedet.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="flex flex-col border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden text-foreground">
            <MenuBar
                editor={editor}
                isUploading={isUploading}
                onSelectImage={() => fileInputRef.current?.click()}
            />

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/jpeg, image/png, image/webp"
                onChange={handleFileSelect}
            />

            <div className="bg-background relative cursor-text text-lg">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
