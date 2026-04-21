import { useEffect, useState } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { RefreshCcw, X } from 'lucide-react';

export function Toast() {
  const lastDeletedTask = useTaskStore((state) => state.lastDeletedTask);
  const undoDelete = useTaskStore((state) => state.undoDelete);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (lastDeletedTask) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000); // 5 seconds to undo

      return () => clearTimeout(timer);
    }
  }, [lastDeletedTask]);

  if (!lastDeletedTask || !isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="bg-slate-900 border border-slate-700 text-slate-100 shadow-2xl rounded-lg p-4 max-w-sm w-full flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium">Task Deleted</p>
          <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[200px]">
            "{lastDeletedTask.title}"
          </p>
        </div>

        <div className="flex items-center gap-2 border-l border-slate-700 pl-4 ml-2">
          <button
            onClick={() => {
              undoDelete();
              setIsVisible(false);
            }}
            className="text-primary hover:text-primary-dark font-medium text-sm flex items-center gap-1 transition-colors px-2 py-1 rounded"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Undo
          </button>
          
          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-slate-200 p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
