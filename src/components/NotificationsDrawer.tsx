import React from 'react';
import type { NotificationItem } from '../types';
import { X, Bell, CheckCheck, Sparkles, Zap, ShieldAlert } from 'lucide-react';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onClearNotifications: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onClearNotifications,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm sm:max-w-md h-full liquid-glass-hero p-5 border-l border-white/20 flex flex-col justify-between shadow-2xl animate-slide-left">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Bell className="w-5 h-5 text-blue-400" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
              </div>
              <h2 className="text-base font-bold text-white font-['SF_Pro_Display']">
                Operational Alerts
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600/30 text-blue-300 font-bold border border-blue-500/30">
                OP
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between text-xs mb-4">
            <button
              onClick={onMarkAllRead}
              className="flex items-center gap-1 text-slate-400 hover:text-blue-300 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>

            <button
              onClick={onClearNotifications}
              className="text-slate-500 hover:text-rose-400 transition-colors"
            >
              Clear list
            </button>
          </div>

          {/* Notifications List */}
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  n.read
                    ? 'bg-white/5 border-white/5 opacity-70'
                    : 'liquid-glass-card border-blue-500/30 bg-blue-950/20'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-white font-['SF_Pro_Display'] flex items-center gap-1.5">
                    {n.category === 'Update' && <Zap className="w-3.5 h-3.5 text-amber-400" />}
                    {n.category === 'New Tool' && <Sparkles className="w-3.5 h-3.5 text-blue-400" />}
                    {n.category === 'System' && <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />}
                    {n.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">{n.time}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-['SF_Pro_Text']">
                  {n.message}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 text-center">
          <p className="text-[11px] text-slate-400 font-['SF_Pro_Text']">
            Subscribed to SpectraGuard Operational Integrity Alerts & Forensic Audit Logs
          </p>
        </div>

      </div>
    </div>
  );
};
