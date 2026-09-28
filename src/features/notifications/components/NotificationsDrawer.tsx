import React from 'react';
import {
  Bell,
  X,
  Coffee,
  Sparkles,
  Gamepad2,
  Receipt,
  CheckCheck,
  Trash2,
} from 'lucide-react';
import { useCafe } from '../../../context/CafeContext';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToOrder?: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateToOrder,
}) => {
  const {
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    unreadNotificationsCount,
  } = useCafe();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Coffee className="w-4 h-4 text-amber-500" />;
      case 'lucky_draw':
        return <Sparkles className="w-4 h-4 text-yellow-500" />;
      case 'game':
        return <Gamepad2 className="w-4 h-4 text-purple-500" />;
      case 'payment':
        return <Receipt className="w-4 h-4 text-emerald-500" />;
      default:
        return <Bell className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-900 border-l border-stone-800 text-stone-100 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-stone-100">Notifications</h2>
                <p className="text-xs text-stone-400">
                  {unreadNotificationsCount} unread realtime alerts
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition"
                  title="Clear all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-stone-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-stone-500">
                <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">No notifications yet</p>
                <p className="text-xs text-stone-600 mt-1">
                  Alerts regarding order prep, table queue allocation, and lucky draw will appear here.
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    markNotificationAsRead(n.id);
                    if (n.orderId && onNavigateToOrder) {
                      onNavigateToOrder();
                      onClose();
                    }
                  }}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    n.read
                      ? 'bg-stone-800/40 border-stone-800/80 text-stone-400'
                      : 'bg-stone-800/90 border-amber-500/40 text-stone-100 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-stone-900 border border-stone-700/60 mt-0.5">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-semibold text-sm truncate text-stone-200">
                          {n.title}
                        </h4>
                        <span className="text-[10px] text-stone-500 whitespace-nowrap">
                          {n.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
