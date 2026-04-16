import { useState } from 'react';
import { StickyNote } from 'lucide-react';
import LessonNotes from './LessonNotes';
import { useCourse } from '../context/CourseContext';

interface NotesFabProps {
  lessonId: string;
}

export default function NotesFab({ lessonId }: NotesFabProps) {
  const [open, setOpen] = useState(false);
  const { getNote } = useCourse();
  const hasNote = !!getNote(lessonId);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all z-30 ${
          hasNote
            ? 'bg-amber-500 hover:bg-amber-400 text-white'
            : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
        }`}
        title="Add notes"
      >
        <StickyNote className="w-5 h-5" />
      </button>
      <LessonNotes lessonId={lessonId} isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
