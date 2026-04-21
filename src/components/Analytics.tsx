import { useTaskStore } from '../store/useTaskStore';
import { PieChart, ListChecks, CheckCircle2, Circle } from 'lucide-react';

export function Analytics() {
  const tasks = useTaskStore((state) => state.tasks);
  
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="glass-panel rounded-2xl p-6 mb-8 relative z-10 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-2 mb-6 text-slate-800 dark:text-slate-100">
        <PieChart className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold tracking-tight">Analytics Overview</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
            <ListChecks className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{total}</p>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">Total</p>
        </div>

        {/* Completed Tasks */}
        <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-4 border border-emerald-100 dark:border-emerald-900/30 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/50 flex items-center justify-center mb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{completed}</p>
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-500 uppercase tracking-wide mt-1">Completed</p>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-4 border border-amber-100 dark:border-amber-900/30 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/50 flex items-center justify-center mb-2">
            <Circle className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{pending}</p>
          <p className="text-xs font-medium text-amber-600 dark:text-amber-500 uppercase tracking-wide mt-1">Pending</p>
        </div>

        {/* Completion Rate */}
        <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-4 border border-primary/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div
            className="absolute bottom-0 left-0 w-full bg-primary/10 transition-all duration-1000 ease-out z-0"
            style={{ height: `${percentage}%` }}
          />
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 relative z-10">
            <span className="text-primary font-bold text-sm">{percentage}%</span>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 relative z-10">{percentage}%</p>
          <p className="text-xs font-medium text-primary uppercase tracking-wide mt-1 relative z-10">Success Rate</p>
        </div>
      </div>
    </div>
  );
}
