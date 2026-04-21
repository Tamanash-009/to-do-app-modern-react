import { useEffect, useState } from 'react';
import { TaskInput } from './components/TaskInput';
import { FilterBar } from './components/FilterBar';
import { TaskList } from './components/TaskList';
import { Analytics } from './components/Analytics';
import { Toast } from './components/Toast';
import { useTaskStore } from './store/useTaskStore';
import { Moon, Sun, CheckCircle2, ListTodo } from 'lucide-react';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check local storage or system preference on initial load
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const clearCompleted = useTaskStore((state) => state.clearCompleted);
  const tasks = useTaskStore((state) => state.tasks);
  const hasCompletedTasks = tasks.some((t) => t.completed);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 dark:bg-blue-900/20 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-emerald-400/20 dark:bg-emerald-900/20 blur-[120px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-purple-400/20 dark:bg-indigo-900/20 blur-[120px]" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 relative z-10 animate-fade-in">
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-primary/30">
              <ListTodo className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Tasks</h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Manage your day</p>
            </div>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>

        <Analytics />

        <div className="opacity-0 fill-mode-forwards" style={{ animation: "fadeInUp 0.5s ease-out 0.2s forwards" }}>
          <TaskInput />
        </div>
        
        <div className="opacity-0 fill-mode-forwards mt-8" style={{ animation: "fadeInUp 0.5s ease-out 0.3s forwards" }}>
          <div className="flex items-center justify-between mb-4">
            <FilterBar />
            
            {hasCompletedTasks && (
              <button
                onClick={clearCompleted}
                className="hidden sm:flex text-sm text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 font-medium transition-colors items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 -mt-6"
              >
                <CheckCircle2 className="w-4 h-4" />
                Clear completed
              </button>
            )}
          </div>
          
          {hasCompletedTasks && (
             <button
                onClick={clearCompleted}
                className="w-full sm:hidden mb-6 text-sm text-center text-amber-600 hover:text-rose-500 font-medium transition-colors focus:ring ring-rose-200 outline-none rounded-lg py-2 uppercase tracking-widest border border-amber-200 dark:border-amber-900/30 bg-white/50 dark:bg-slate-800/50"
             >
                Clear completed tasks
             </button>
          )}

          <TaskList />
        </div>
      </div>
      
      <Toast />
    </div>
  );
}

export default App;
