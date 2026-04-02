import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../api/tasks';
import type { Task } from '../types';
import { Shield, Loader2, UserPlus } from 'lucide-react';

export default function AdminAssignPage() {
  const queryClient = useQueryClient();
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [assignEmail, setAssignEmail] = useState('');
  const [message, setMessage] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['tasks-admin'],
    queryFn: () => taskApi.getAll(0, 50),
  });

  const assignMutation = useMutation({
    mutationFn: () => taskApi.assign(selectedTaskId!, assignEmail),
    onSuccess: () => {
      setMessage('Task assigned successfully!');
      setAssignEmail('');
      setSelectedTaskId(null);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: () => setMessage('Failed to assign task.'),
  });

  const tasks = data?.content ?? [];

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
          <Shield size={20} className="text-purple-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Assign Tasks</h2>
          <p className="text-slate-400 text-sm mt-0.5">Admin — assign tasks to any user</p>
        </div>
      </div>

      <div className="card flex flex-col gap-5">
        {message && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm px-4 py-3 rounded-lg">
            {message}
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-slate-300 mb-1.5 block">Select Task</label>
          {isLoading ? (
            <div className="flex items-center gap-2 text-slate-500 py-4">
              <Loader2 size={16} className="animate-spin" /> Loading tasks...
            </div>
          ) : (
            <select
              className="input-field"
              value={selectedTaskId ?? ''}
              onChange={e => setSelectedTaskId(Number(e.target.value))}
            >
              <option value="">-- Choose a task --</option>
              {tasks.map((t: Task) => (
                <option key={t.id} value={t.id}>{t.title} ({t.status})</option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300 mb-1.5 block">Assign To (email)</label>
          <input
            type="email"
            className="input-field"
            placeholder="user@example.com"
            value={assignEmail}
            onChange={e => setAssignEmail(e.target.value)}
          />
        </div>

        <button
          onClick={() => assignMutation.mutate()}
          disabled={!selectedTaskId || !assignEmail || assignMutation.isPending}
          className="btn-primary self-start"
        >
          {assignMutation.isPending
            ? <><Loader2 size={16} className="animate-spin" /> Assigning...</>
            : <><UserPlus size={16} /> Assign Task</>
          }
        </button>
      </div>
    </div>
  );
}
