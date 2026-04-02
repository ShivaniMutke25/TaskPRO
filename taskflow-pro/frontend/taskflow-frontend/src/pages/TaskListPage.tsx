import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { taskApi } from '../api/tasks';
import type { Task, TaskStatus } from '../types';
import { Plus, Trash2, Edit2, Filter, Loader2, CheckSquare } from 'lucide-react';

const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: 'All', value: '' },
  { label: 'To Do', value: 'TODO' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Done', value: 'DONE' },
];

function statusBadge(status: TaskStatus) {
  if (status === 'DONE') return <span className="badge-done">Done</span>;
  if (status === 'IN_PROGRESS') return <span className="badge-in-progress">In Progress</span>;
  return <span className="badge-todo">To Do</span>;
}

function priorityBadge(p: string) {
  const cls = `badge-${p.toLowerCase()}`;
  return <span className={cls}>{p}</span>;
}

export default function TaskListPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['tasks', page, statusFilter],
    queryFn: () => taskApi.getAll(page, 10, statusFilter || undefined),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => taskApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const tasks = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Tasks</h2>
          <p className="text-slate-400 text-sm mt-1">{data?.totalElements ?? 0} total tasks</p>
        </div>
        <Link to="/tasks/new" className="btn-primary">
          <Plus size={16} /> New Task
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        <Filter size={14} className="text-slate-500" />
        <p className="text-sm text-slate-500 mr-1">Filter:</p>
        {STATUS_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => { setStatusFilter(opt.value); setPage(0); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === opt.value ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-slate-500">
            <Loader2 size={20} className="animate-spin mr-2" /> Loading...
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <CheckSquare size={40} className="mx-auto mb-3 opacity-20" />
            <p>No tasks found.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 text-slate-500 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">Title</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Priority</th>
                <th className="text-left px-4 py-3">Due Date</th>
                <th className="text-left px-4 py-3">Assigned To</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tasks.map((task: Task) => (
                <tr key={task.id} className="hover:bg-white/3 transition-colors">
                  <td className="px-5 py-3.5">
                    <Link to={`/tasks/${task.id}`} className="font-medium text-white hover:text-indigo-300 transition-colors">{task.title}</Link>
                    {task.description && <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{task.description}</p>}
                  </td>
                  <td className="px-4 py-3.5">{statusBadge(task.status)}</td>
                  <td className="px-4 py-3.5">{task.priority && priorityBadge(task.priority)}</td>
                  <td className="px-4 py-3.5 text-slate-400">{task.dueDate ?? '—'}</td>
                  <td className="px-4 py-3.5 text-slate-400 text-xs truncate max-w-[140px]">{task.assignedTo ?? '—'}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 justify-end">
                      <Link to={`/tasks/${task.id}/edit`} className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                        <Edit2 size={14} />
                      </Link>
                      <button
                        onClick={() => { if (confirm('Delete this task?')) deleteMutation.mutate(task.id); }}
                        className="p-1.5 rounded hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-5">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-40">← Prev</button>
          <span className="text-slate-500 text-sm">Page {page + 1} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-40">Next →</button>
        </div>
      )}
    </div>
  );
}
