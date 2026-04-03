import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../api/tasks';
import type { TaskRequest, Priority } from '../types';
import { ArrowLeft, Loader2, Save } from 'lucide-react';

const PRIORITIES: Priority[] = ['LOW', 'MEDIUM', 'HIGH'];

export default function TaskFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<TaskRequest>({
    title: '', description: '', priority: 'MEDIUM', dueDate: '', assignedTo: '',
  });
  const [error, setError] = useState('');

  // Load existing task for editing
  const { data: existingTask } = useQuery({
    queryKey: ['task', id],
    queryFn: () => taskApi.getById(Number(id)),
    enabled: isEdit,
  });

  useEffect(() => {
    if (existingTask) {
      setForm({
        title: existingTask.title,
        description: existingTask.description ?? '',
        priority: existingTask.priority,
        dueDate: existingTask.dueDate ?? '',
        assignedTo: existingTask.assignedTo ?? '',
      });
    }
  }, [existingTask]);

  const mutation = useMutation({
    mutationFn: (data: TaskRequest) =>
      isEdit ? taskApi.update(Number(id), data) : taskApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      navigate('/tasks');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to save task. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    mutation.mutate(form);
  };

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white">{isEdit ? 'Edit Task' : 'Create New Task'}</h2>
          <p className="text-slate-400 text-sm mt-0.5">{isEdit ? 'Update the task details below' : 'Fill in the details for your new task'}</p>
        </div>
      </div>

      <div className="card">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-sm font-medium text-slate-300 mb-1.5 block">Title *</label>
            <input
              id="task-title"
              type="text"
              className="input-field"
              placeholder="Task title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-1.5 block">Description</label>
            <textarea
              id="task-description"
              className="input-field min-h-[100px] resize-none"
              placeholder="Optional description..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-1.5 block">Priority</label>
              <select
                id="task-priority"
                className="input-field"
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value as Priority })}
              >
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-1.5 block">Due Date</label>
              <input
                id="task-due-date"
                type="date"
                className="input-field"
                value={form.dueDate}
                onChange={e => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-1.5 block">Assign To (email)</label>
            <input
              id="task-assign"
              type="email"
              className="input-field"
              placeholder="user@example.com"
              value={form.assignedTo}
              onChange={e => setForm({ ...form, assignedTo: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              id="task-submit"
              type="submit"
              className="btn-primary"
              disabled={mutation.isPending}
            >
              {mutation.isPending
                ? <><Loader2 size={16} className="animate-spin" /> Saving...</>
                : <><Save size={16} /> {isEdit ? 'Update Task' : 'Create Task'}</>
              }
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
