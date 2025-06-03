"use client";

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAppContext } from '@/contexts/AppContext';
import { NotificationDropdown } from './NotificationDropdown';

export function NotificationBell() {
  const { notifications, currentUser } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  if (!currentUser) return null;

  const unreadCount = notifications.filter(n => n.recipientId === currentUser.id && !n.isRead).length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Bildirimler">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 md:w-96" align="end">
        <NotificationDropdown onClose={() => setIsOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}