"use client";

import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { NotificationItem } from './NotificationItem';
import { BellRing, CheckCheck } from 'lucide-react';

interface NotificationDropdownProps {
  onClose: () => void;
}

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const { notifications, currentUser, markAllNotificationsAsRead, markNotificationAsRead } = useAppContext();

  if (!currentUser) return null;

  const userNotifications = notifications
    .filter(n => n.recipientId === currentUser.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead(currentUser.id);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="font-semibold text-lg">Bildirimler</h3>
        {userNotifications.some(n => !n.isRead) && (
          <Button variant="ghost" size="sm" onClick={handleMarkAllRead} className="text-xs">
            <CheckCheck className="mr-1.5 h-3.5 w-3.5" />
            Tümünü Okundu İşaretle
          </Button>
        )}
      </div>
      {userNotifications.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground">
          <BellRing className="mx-auto h-12 w-12 mb-3" />
          <p>Henüz bildiriminiz yok.</p>
        </div>
      ) : (
        <ScrollArea className="max-h-96">
          <div className="p-1 space-y-1">
            {userNotifications.map((notification, index) => (
              <div key={notification.id}>
                <NotificationItem 
                  notification={notification} 
                  onMarkAsRead={() => markNotificationAsRead(notification.id)}
                  onCloseDropdown={onClose}
                />
                {index < userNotifications.length - 1 && <Separator className="my-1" />}
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}