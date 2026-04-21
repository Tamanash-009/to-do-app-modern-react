import { useState } from 'react';
import { useTaskStore, type Priority } from '../store/useTaskStore';
import { Plus, Calendar } from 'lucide-react';
import { cn } from '../utils/cn';

export function TaskInput() {
  const addTask = useTaskStore((state) => state.addTask);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      priority,
      dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
    });
    
    setTitle('');
    setPriority('medium');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-4 rounded-xl flex flex-col sm:flex-row gap-3 items-center mb-8 relative z-10 animate-fade-in-up">
      <div className="flex-1 w-full bg-white/50 dark:bg-slate-800/50 rounded-lg flex items-center px-4 py-2 border-2 border-transparent focus-within:border-primary transition-colors">
        <Plus className="w-5 h-5 text-slate-400 mr-2 flex-shrink-0" />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full bg-transparent outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400"
          aria-label="Task title"
        />
      </div>

      <div className="flex w-full sm:w-auto gap-3">
        <div className="relative flex-1 sm:flex-none flex items-center bg-white/50 dark:bg-slate-800/50 rounded-lg px-3 py-2">
          <Calendar className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="bg-transparent outline-none text-sm text-slate-600 dark:text-slate-300 w-full cursor-pointer dark:[color-scheme:dark]"
            aria-label="Due date"
          />
        </div>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className={cn(
            "rounded-lg px-3 py-2 text-sm outline-none cursor-pointer border-2 transition-colors flex-1 sm:flex-none appearance-none font-medium",
            priority === 'low' && "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50",
            priority === 'medium' && "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50",
            priority === 'high' && "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/50"
          )}
          aria-label="Priority"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={!title.trim()}
        className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 whitespace-nowrap"
      >
        Add Task
      </button>
    </form>
  );
}
