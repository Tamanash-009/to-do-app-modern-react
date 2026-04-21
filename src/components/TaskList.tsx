import { useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useTaskStore } from '../store/useTaskStore';
import { TaskItem } from './TaskItem';
import { ClipboardList } from 'lucide-react';

export function TaskList() {
  const tasks = useTaskStore((state) => state.tasks);
  const filter = useTaskStore((state) => state.filter);
  const searchQuery = useTaskStore((state) => state.searchQuery);
  const reorderTasks = useTaskStore((state) => state.reorderTasks);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // minimum distance before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Apply visibility filter
    if (filter === 'pending') {
      result = result.filter((t) => !t.completed);
    } else if (filter === 'completed') {
      result = result.filter((t) => t.completed);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q));
    }

    return result;
  }, [tasks, filter, searchQuery]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((t) => t.id === active.id);
      const newIndex = tasks.findIndex((t) => t.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderTasks(oldIndex, newIndex);
      }
    }
  };

  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <ClipboardList className="w-8 h-8 text-slate-300 dark:text-slate-500" />
        </div>
        <p className="text-lg font-medium text-slate-600 dark:text-slate-300">No tasks found</p>
        <p className="text-sm mt-1 text-center max-w-xs leading-relaxed">
          {searchQuery ? "Try adjusting your search query." : filter === 'completed' ? "You don't have any completed tasks yet." : "You're all caught up! Add a new task above."}
        </p>
      </div>
    );
  }

  // We only allow reordering if we are viewing 'all' tasks without search
  // because array indices wouldn't match the main store correctly otherwise.
  const isReorderable = filter === 'all' && !searchQuery.trim();

  if (!isReorderable) {
    return (
      <div className="space-y-1 relative z-10 animate-fade-in">
        {filteredTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    );
  }

  return (
    <div className="relative z-10 animate-fade-in">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredTasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-1">
            {filteredTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
