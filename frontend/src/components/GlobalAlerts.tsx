import React from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { removeNotification } from '../features/notifications/notificationsSlice';
import { X } from 'lucide-react';

export const GlobalAlerts: React.FC = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notifications.items);

  if (!notifications.length) return null;

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 w-[420px] max-w-[92vw] bg-white">
      {notifications.map((n) => {
        const variant = n.type === 'error' ? 'destructive' : 'default';
        return (
          <Alert key={n.id} variant={variant as any}>
            <div className="flex items-start gap-3">
              <div className="flex-1">
                {n.title && <AlertTitle>{n.title}</AlertTitle>}
                <AlertDescription>{n.message}</AlertDescription>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => dispatch(removeNotification(n.id))}
                aria-label="Dismiss"
                title="Dismiss"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Alert>
        );
      })}
    </div>
  );
};
