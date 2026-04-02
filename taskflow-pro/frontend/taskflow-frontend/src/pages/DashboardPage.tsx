import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { taskApi } from '../api/tasks';
import { CheckCircle2, ListTodo, AlertTriangle, TrendingUp, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Task } from '../types';

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) {
  return (
    <div className="stat-card">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="text-sm text-slate-400 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function RecentTaskRow({ task }: { task: Task }) {
  const statusClass = task.status === 'DONE' ? 'badge-done' : task.status === 'IN_PROGRESS' ? 'badge-in-progress' : 'badge-todo';
  const priorityClass = `badge-${task.priority.toLowerCase()}`;

  return (
    <Link to={`/tasks/${task.id}`} className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/8">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-white text-sm truncate">{task.title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{task.dueDate ? `Due ${task.dueDate}` : 'No due date'}</p>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <span className={priorityClass}>{task.priority}</span>
        <span className={statusClass}>{task.status.replace('_', ' ')}</span>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: allTasks, isLoading } = useQuery({
    queryKey: ['tasks-all'],
    queryFn: () => taskApi.getAll(0, 100),
  });

  const tasks = allTasks?.content ?? [];
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'DONE').length;
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'DONE').length;
  const recent = tasks.slice(0, 5);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋</h2>
        <p className="text-slate-400 mt-1">Here's what's happening with your tasks today.</p>
      </div>

      {/* Stats */}
      {isLoading ? (
        <div className="flex items-center gap-2 text-slate-400 mb-8"><Loader2 size={18} className="animate-spin" /> Loading stats...</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Tasks" value={total} icon={ListTodo} color="bg-indigo-500/20 text-indigo-400" />
          <StatCard label="Completed" value={done} icon={CheckCircle2} color="bg-emerald-500/20 text-emerald-400" />
          <StatCard label="In Progress" value={inProgress} icon={TrendingUp} color="bg-amber-500/20 text-amber-400" />
          <StatCard label="Overdue" value={overdue} icon={AlertTriangle} color="bg-red-500/20 text-red-400" />
        </div>
      )}

      {/* Recent Tasks */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-white text-base">Recent Tasks</h3>
          <Link to="/tasks" className="text-sm text-indigo-400 hover:text-indigo-300">View all →</Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-slate-500">
            <Loader2 size={20} className="animate-spin mr-2" /> Loading tasks...
          </div>
        ) : recent.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <ListTodo size={40} className="mx-auto mb-3 opacity-30" />
            <p>No tasks yet. <Link to="/tasks/new" className="text-indigo-400 hover:underline">Create your first task</Link></p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {recent.map(task => <RecentTaskRow key={task.id} task={task} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
