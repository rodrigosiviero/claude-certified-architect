import { useState, useEffect, useCallback } from 'react';
import { X, Save, StickyNote } from 'lucide-react';
import { useCourse } from '../context/CourseContext';

interface LessonNotesProps {
  lessonId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function LessonNotes({ lessonId, isOpen, onClose }: LessonNotesProps) {
  const { saveNote, getNote } = useCourse();
  const [content, setContent] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const note = getNote(lessonId);
      setContent(note?.content || '');
      setSaved(false);
    }
  }, [isOpen, lessonId, getNote]);

  const handleSave = useCallback(() => {
    saveNote(lessonId, content);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [content, lessonId, saveNote]);

  // Auto-save on close
  useEffect(() => {
    if (!isOpen && content.trim()) {
      saveNote(lessonId, content);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const existingNote = getNote(lessonId);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 z-50 flex flex-col shadow-xl transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <StickyNote className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold text-slate-900 dark:text-white">My Notes</h3>
            <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              Lesson {lessonId}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <Save className="w-3 h-3" /> Saved
              </span>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Textarea */}
        <div className="flex-1 p-4">
          <textarea
            value={content}
            onChange={(e) => { setContent(e.target.value); setSaved(false); }}
            placeholder="Write your notes here...&#10;&#10;Tips:&#10;- Key concepts to remember&#10;- Questions for later&#10;- Connections to other topics"
            className="w-full h-full resize-none bg-transparent text-slate-700 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-600 text-sm leading-relaxed focus:outline-none"
            autoFocus
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          {existingNote && (
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Last edited {new Date(existingNote.updatedAt).toLocaleString()}
            </span>
          )}
          <button
            onClick={handleSave}
            className="ml-auto px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>
    </>
  );
}
