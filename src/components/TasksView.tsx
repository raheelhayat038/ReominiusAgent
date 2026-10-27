import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Tag, 
  Trash2, 
  Filter, 
  CheckSquare, 
  AlertCircle,
  MoreVertical,
  X,
  FileDown
} from 'lucide-react';
import { Task, Priority, TaskStatus, TaskCategory } from '../types';
import { sound } from '../utils/audio';

interface TasksViewProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewLayout, setViewLayout] = useState<'kanban' | 'list'>('kanban');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<TaskCategory>('Dev');
  const [dueDate, setDueDate] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [subtasksInput, setSubtasksInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const filteredTasks = tasks.filter((task) => {
    const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const columns: { status: TaskStatus; label: string }[] = [
    { status: 'todo', label: 'To Do' },
    { status: 'in_progress', label: 'In Progress' },
    { status: 'review', label: 'Review & Verify' },
    { status: 'completed', label: 'Completed' },
  ];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    sound.playSuccess();

    const subtasks = subtasksInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((text, idx) => ({ id: `sub-${Date.now()}-${idx}`, text, completed: false }));

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onAddTask({
      title,
      description,
      priority,
      status: 'todo',
      category,
      dueDate: dueDate || 'Today',
      estimatedMinutes: Number(estimatedMinutes) || 30,
      subtasks,
      tags: tags.length ? tags : [category],
    });

    setTitle('');
    setDescription('');
    setDueDate('');
    setSubtasksInput('');
    setTagsInput('');
    setIsAddModalOpen(false);
  };

  const toggleSubtask = (task: Task, subtaskId: string) => {
    sound.playClick();
    const updated = {
      ...task,
      subtasks: task.subtasks.map((st) =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      ),
    };
    onUpdateTask(updated);
  };

  const handleMoveStatus = (task: Task, newStatus: TaskStatus) => {
    sound.playClick();
    onUpdateTask({ ...task, status: newStatus });
  };

  const exportTasksCSV = () => {
    sound.playClick();
    const headers = ['Title', 'Priority', 'Status', 'Category', 'DueDate', 'Subtasks'];
    const rows = tasks.map((t) => [
      `"${t.title.replace(/"/g, '""')}"`,
      t.priority,
      t.status,
      t.category,
      t.dueDate,
      `"${t.subtasks.map((s) => (s.completed ? '[x] ' : '[ ] ') + s.text).join('; ')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'omniassist_tasks.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case 'urgent': return 'text-rose-400';
      case 'high': return 'text-amber-400';
      case 'medium': return 'text-blue-400';
      case 'low': return 'text-slate-400';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* Control Bar */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/40 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter tasks, tags, descriptions..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 w-52 sm:w-64 focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          {/* Interactive Filter Tabs - functional buttons */}
          <div className="hidden sm:flex items-center gap-1 p-0.5 bg-slate-900 rounded-lg border border-slate-800 text-xs">
            {['All', 'Dev', 'Personal', 'Work', 'Health', 'Finance'].map((cat) => (
              <button
                key={cat}
                onClick={() => { sound.playClick(); setSelectedCategory(cat); }}
                className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => { sound.playClick(); setViewLayout('kanban'); }}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                viewLayout === 'kanban' ? 'bg-slate-800 text-slate-100' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => { sound.playClick(); setViewLayout('list'); }}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                viewLayout === 'list' ? 'bg-slate-800 text-slate-100' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              List
            </button>
          </div>

          <button
            onClick={exportTasksCSV}
            title="Export CSV"
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <FileDown className="w-4 h-4" />
          </button>

          <button
            onClick={() => { sound.playClick(); setIsAddModalOpen(true); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow-xs shadow-indigo-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Kanban Grid */}
      <div className="flex-1 overflow-x-auto p-4">
        {viewLayout === 'kanban' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 h-full min-w-[750px]">
            {columns.map((col) => {
              const colTasks = filteredTasks.filter((t) => t.status === col.status);
              return (
                <div
                  key={col.status}
                  className="bg-slate-900/50 rounded-xl border border-slate-800/80 flex flex-col h-full overflow-hidden"
                >
                  <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-300">
                    <span className="flex items-center gap-2">
                      <span>{col.label}</span>
                      <span className="font-mono tabular-nums text-slate-500 font-normal">
                        ({colTasks.length})
                      </span>
                    </span>
                    <button
                      onClick={() => { sound.playClick(); setIsAddModalOpen(true); }}
                      className="text-slate-500 hover:text-slate-300"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
                    {colTasks.length === 0 ? (
                      <div className="h-28 flex items-center justify-center text-xs text-slate-600 border border-dashed border-slate-800/80 rounded-lg">
                        No tasks in this lane
                      </div>
                    ) : (
                      colTasks.map((task) => {
                        const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
                        return (
                          <div
                            key={task.id}
                            className="p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-xs space-y-2.5 group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs font-semibold text-slate-200 group-hover:text-white leading-snug">
                                {task.title}
                              </h4>
                              <button
                                onClick={() => { sound.playClick(); onDeleteTask(task.id); }}
                                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-opacity p-0.5"
                                title="Delete task"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>

                            {task.description && (
                              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                                {task.description}
                              </p>
                            )}

                            {/* Subtasks checklist */}
                            {task.subtasks.length > 0 && (
                              <div className="space-y-1 pt-1 border-t border-slate-800/60">
                                <div className="flex items-center justify-between text-[10px] text-slate-500">
                                  <span>Checklist</span>
                                  <span className="font-mono tabular-nums">
                                    {completedSubtasks}/{task.subtasks.length}
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  {task.subtasks.map((st) => (
                                    <button
                                      key={st.id}
                                      onClick={() => toggleSubtask(task, st.id)}
                                      className="flex items-center gap-1.5 text-[11px] text-left w-full text-slate-400 hover:text-slate-200 transition-colors"
                                    >
                                      {st.completed ? (
                                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                                      ) : (
                                        <Circle className="w-3 h-3 text-slate-600 shrink-0" />
                                      )}
                                      <span className={st.completed ? 'line-through text-slate-500' : ''}>
                                        {st.text}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Unboxed Metadata Line (Section 1A zero-pill compliance) */}
                            <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px] text-slate-500">
                              <div className="flex items-center gap-1.5">
                                <span className={`font-semibold capitalize ${getPriorityColor(task.priority)}`}>
                                  {task.priority}
                                </span>
                                <span aria-hidden="true">·</span>
                                <span>{task.category}</span>
                                <span aria-hidden="true">·</span>
                                <span className="font-mono tabular-nums">{task.dueDate}</span>
                              </div>

                              {/* Status mover select */}
                              <select
                                value={task.status}
                                onChange={(e) => handleMoveStatus(task, e.target.value as TaskStatus)}
                                className="bg-slate-950 border border-slate-800 text-[10px] text-slate-400 rounded px-1 py-0.5 cursor-pointer focus:outline-hidden"
                              >
                                <option value="todo">To Do</option>
                                <option value="in_progress">In Progress</option>
                                <option value="review">Review</option>
                                <option value="completed">Completed</option>
                              </select>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="max-w-4xl mx-auto space-y-2">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between gap-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      sound.playClick();
                      handleMoveStatus(task, task.status === 'completed' ? 'todo' : 'completed');
                    }}
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-600 hover:text-slate-400" />
                    )}
                  </button>
                  <div>
                    <h4 className={`text-xs font-semibold ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className={`font-medium ${getPriorityColor(task.priority)} capitalize`}>
                        {task.priority}
                      </span>
                      <span>·</span>
                      <span>{task.category}</span>
                      <span>·</span>
                      <span className="font-mono tabular-nums">{task.dueDate}</span>
                      {task.subtasks.length > 0 && (
                        <>
                          <span>·</span>
                          <span className="font-mono tabular-nums">
                            {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} subtasks
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={task.status}
                    onChange={(e) => handleMoveStatus(task, e.target.value as TaskStatus)}
                    className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded px-2 py-1 cursor-pointer focus:outline-hidden"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button
                    onClick={() => { sound.playClick(); onDeleteTask(task.id); }}
                    className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-semibold text-slate-100">Create New Task</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-500 hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Test Supabase RLS policies with Vercel preview"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Context, branch name, or specific requirements..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-hidden"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TaskCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-hidden"
                  >
                    <option value="Dev">Dev</option>
                    <option value="Personal">Personal</option>
                    <option value="Work">Work</option>
                    <option value="Health">Health</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Due Date / Time</label>
                  <input
                    type="text"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    placeholder="e.g. Today 18:00 or Friday"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Estimated Minutes</label>
                  <input
                    type="number"
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                    min={5}
                    step={5}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Subtasks (One per line)</label>
                <textarea
                  rows={2}
                  value={subtasksInput}
                  onChange={(e) => setSubtasksInput(e.target.value)}
                  placeholder="Check auth headers&#10;Verify migration rollback"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-medium text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white shadow-xs"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
