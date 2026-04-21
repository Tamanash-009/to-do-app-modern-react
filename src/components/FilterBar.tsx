import { Search } from 'lucide-react';
import { useTaskStore, type FilterType } from '../store/useTaskStore';
import { cn } from '../utils/cn';

export function FilterBar() {
  const filter = useTaskStore((state) => state.filter);
  const setFilter = useTaskStore((state) => state.setFilter);
  const searchQuery = useTaskStore((state) => state.searchQuery);
  const setSearchQuery = useTaskStore((state) => state.setSearchQuery);

  const filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 relative z-10">
      <div className="flex space-x-1 glass-panel p-1 rounded-lg w-full sm:w-auto overflow-hidden">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-md transition-all flex-1 sm:flex-none",
              filter === f.value
                ? "bg-white dark:bg-slate-700 text-primary shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
          className="w-full pl-9 pr-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none rounded-lg text-sm focus:border-primary transition-colors text-slate-800 dark:text-slate-100 placeholder-slate-400"
        />
      </div>
    </div>
  );
}
