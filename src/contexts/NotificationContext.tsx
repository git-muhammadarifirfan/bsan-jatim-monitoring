import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
}

interface NotificationContextType {
  showNotification: (type: NotificationType, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (type: NotificationType, message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { id, type, message }]);

    // Auto remove after 4 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 4000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col space-y-3 pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`pointer-events-auto flex items-start space-x-3 w-80 max-w-sm rounded-xl p-4 shadow-2xl border backdrop-blur-md animate-fade-in-up transition-all transform`}
            style={{
              backgroundColor: n.type === 'success' ? 'rgba(47, 179, 68, 0.9)' :
                               n.type === 'error' ? 'rgba(229, 72, 77, 0.9)' :
                               'rgba(43, 50, 178, 0.9)',
              borderColor: n.type === 'success' ? 'rgba(47, 179, 68, 0.4)' :
                           n.type === 'error' ? 'rgba(229, 72, 77, 0.4)' :
                           'rgba(43, 50, 178, 0.4)',
              color: '#ffffff'
            }}
          >
            <div className="flex-shrink-0 mt-0.5">
              {n.type === 'success' && <CheckCircle2 className="h-5 w-5 text-white" />}
              {n.type === 'error' && <XCircle className="h-5 w-5 text-white" />}
              {n.type === 'info' && <AlertCircle className="h-5 w-5 text-white" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{n.message}</p>
            </div>
            <button
              onClick={() => removeNotification(n.id)}
              className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
