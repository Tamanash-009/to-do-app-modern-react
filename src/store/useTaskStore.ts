import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  priority: Priority;
  dueDate?: number;
}

export type FilterType = 'all' | 'pending' | 'completed';

interface TaskState {
  tasks: Task[];
  filter: FilterType;
  searchQuery: string;
  lastDeletedTask: Task | null;
  
  // Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  editTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  clearCompleted: () => void;
  reorderTasks: (startIndex: number, endIndex: number) => void;
  undoDelete: () => void;
  setFilter: (filter: FilterType) => void;
  setSearchQuery: (query: string) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      filter: 'all',
      searchQuery: '',
      lastDeletedTask: null,

      addTask: (taskData) => set((state) => ({
        tasks: [
          {
            id: crypto.randomUUID(),
            createdAt: Date.now(),
            completed: false,
            ...taskData,
          },
          ...state.tasks,
        ],
      })),

      editTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, ...updates } : task
        ),
      })),

      deleteTask: (id) => set((state) => {
        const taskToDelete = state.tasks.find((t) => t.id === id);
        return {
          tasks: state.tasks.filter((t) => t.id !== id),
          lastDeletedTask: taskToDelete || null,
        };
      }),

      toggleComplete: (id) => set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        ),
      })),

      clearCompleted: () => set((state) => ({
        tasks: state.tasks.filter((t) => !t.completed),
      })),

      reorderTasks: (startIndex, endIndex) => set((state) => {
        const result = Array.from(state.tasks);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return { tasks: result };
      }),

      undoDelete: () => set((state) => {
        if (!state.lastDeletedTask) return state;
        return {
          tasks: [state.lastDeletedTask, ...state.tasks],
          lastDeletedTask: null,
        };
      }),

      setFilter: (filter) => set({ filter }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
    }),
    {
      name: 'todo-storage',
      partialize: (state) => ({ tasks: state.tasks }), // Only persist tasks
    }
  )
);
