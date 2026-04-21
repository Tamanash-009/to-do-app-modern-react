import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTaskStore, type Task } from '../store/useTaskStore';
import { Check, Trash2, GripVertical, Clock, Edit2, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../utils/cn';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const toggleComplete = useTaskStore((state) => state.toggleComplete);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const editTask = useTaskStore((state) => state.editTask);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { zIndex: 50 } : {}),
  };

  const handleSaveEdit = () => {
    if (editTitle.trim() && editTitle.trim() !== task.title) {
      editTask(task.id, { title: editTitle.trim() });
    } else {
      setEditTitle(task.title);
    }
    setIsEditing(false);
  };

  const priorityColors = {
    low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    high: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400 border-rose-200 dark:border-rose-800',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-3 p-4 mb-3 rounded-xl border transition-all duration-200 bg-white dark:bg-slate-800",
        isDragging ? "shadow-2xl border-primary opacity-90 scale-105" : "shadow-sm border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md",
        task.completed && "opacity-60 bg-slate-50 dark:bg-slate-900/50"
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 -ml-2 rounded"
        aria-label="Drag handle"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      <button
        onClick={() => toggleComplete(task.id)}
        className={cn(
          "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
          task.completed
            ? "bg-primary border-primary text-white"
            : "border-slate-300 dark:border-slate-600 hover:border-primary dark:hover:border-primary text-transparent"
        )}
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
      >
        <Check className={cn("w-3.5 h-3.5", task.completed ? "scale-100" : "scale-0")} style={{ transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }} />
      </button>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit();
                if (e.key === 'Escape') {
                  setEditTitle(task.title);
                  setIsEditing(false);
                }
              }}
              autoFocus
              className="flex-1 bg-transparent border-b border-primary outline-none px-1 py-0.5 text-slate-800 dark:text-slate-100"
            />
            <button onClick={handleSaveEdit} className="text-emerald-500 hover:text-emerald-600 p-1">
              <Check className="w-4 h-4" />
            </button>
            <button onClick={() => { setEditTitle(task.title); setIsEditing(false); }} className="text-slate-400 hover:text-slate-600 p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <span
            className={cn(
              "block truncate text-slate-800 dark:text-slate-100 font-medium transition-all",
              task.completed && "line-through text-slate-400 dark:text-slate-500"
            )}
            onDoubleClick={() => !task.completed && setIsEditing(true)}
          >
            {task.title}
          </span>
        )}

        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          <span className={cn("text-xs px-2 py-0.5 rounded-full border border-transparent font-medium uppercase tracking-wider", priorityColors[task.priority])}>
            {task.priority}
          </span>
          
          {task.dueDate && (
            <div className={cn(
               "flex items-center text-xs font-medium gap-1",
               task.completed ? "text-slate-400" : (task.dueDate < Date.now() ? "text-rose-500 dark:text-rose-400" : "text-slate-500 dark:text-slate-400")
            )}>
              <Clock className="w-3 h-3" />
              <span>{format(task.dueDate, 'MMM d, yyyy')}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
        {!task.completed && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
            title="Edit task"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => deleteTask(task.id)}
          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-md transition-colors"
          title="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
