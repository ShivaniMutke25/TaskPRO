import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { notificationApi } from '../api/notifications';
import { Bell, CheckCircle2, UserPlus, ListTodo, Loader2 } from 'lucide-react';
import type { Notification } from '../types';

function getIcon(type: string) {
  if (type === 'TASK_COMPLETED') return <CheckCircle2 size={16} className="text-emerald-400" />;
  if (type === 'TASK_ASSIGNED') return <UserPlus size={16} className="text-indigo-400" />;
  return <ListTodo size={16} className="text-amber-400" />;
}

function getTypeColor(type: string) {
  if (type === 'TASK_COMPLETED') return 'bg-emerald-500/10 border-emerald-500/20';
  if (type === 'TASK_ASSIGNED') return 'bg-indigo-500/10 border-indigo-500/20';
  return 'bg-amber-500/10 border-amber-500/20';
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  }).format(new Date(iso));
}

export default function NotificationsPage() {
  const { user } = useAuth();

  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ['notifications', user?.email],
    queryFn: () => notificationApi.getForUser(user!.email),
    enabled: !!user,
  });

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
          <Bell size={20} className="text-indigo-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Notifications</h2>
          <p className="text-slate-400 text-sm mt-0.5">{notifications.length} notification{notifications.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-slate-500 py-12 justify-center">
          <Loader2 size={20} className="animate-spin" /> Loading notifications...
        </div>
      ) : notifications.length === 0 ? (
        <div className="card text-center py-16">
          <Bell size={48} className="mx-auto text-slate-700 mb-4" />
          <p className="text-slate-400 font-medium">No notifications yet</p>
          <p className="text-slate-600 text-sm mt-1">Notifications from task events will appear here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {notifications.map((n: Notification) => (
            <div
              key={n.id}
              className={`card border p-4 flex items-start gap-4 ${getTypeColor(n.type)}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeColor(n.type)}`}>
                {getIcon(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium">{n.message}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-slate-500">{n.type.replace('_', ' ')}</span>
                  <span className="text-xs text-slate-600">•</span>
                  <span className="text-xs text-slate-500">{n.createdAt ? formatDate(n.createdAt) : '—'}</span>
                </div>
              </div>
              <span className="text-xs text-slate-600 flex-shrink-0">Task #{n.taskId}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
