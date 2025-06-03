"use client";

import Link from 'next/link';
import type { Notification } from '@/lib/types';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { UserPlus, ListPlus, Gift, CalendarClock, CheckCircle, XCircle, Circle } from 'lucide-react';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void; // This will now trigger deletion
  onCloseDropdown: () => void;
}

const getInitials = (name: string = '') => name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '';

const getNotificationIcon = (type: Notification['type'], status?: Notification['status']) => {
  switch (type) {
    case 'new_follower':
      return <UserPlus className="h-5 w-5 text-primary" />;
    case 'task_list_invitation':
      // Since invitations are deleted on action, pending is the main state shown here
      return <ListPlus className="h-5 w-5 text-blue-500" />;
    case 'birthday_reminder':
      return <Gift className="h-5 w-5 text-pink-500" />;
    case 'upcoming_task':
      return <CalendarClock className="h-5 w-5 text-orange-500" />;
    case 'invitation_response':
      // This notification type will persist until read (deleted)
      return <CheckCircle className="h-5 w-5 text-status-completed" />;
    default:
      return <Circle className="h-5 w-5 text-muted-foreground" />;
  }
};

export function NotificationItem({ notification, onMarkAsRead, onCloseDropdown }: NotificationItemProps) {
  const { allUsers, acceptTaskListInvitation, declineTaskListInvitation, currentUser } = useAppContext();
  const triggerUser = notification.triggerUserId ? allUsers.find(u => u.id === notification.triggerUserId) : null;

  const handleItemClick = () => {
    // For non-actionable notifications, clicking the item marks it as read (deletes it) and navigates.
    // For actionable notifications (invitations), clicking the item should ideally not delete it immediately
    // unless it's explicitly marked as read via the dot.
    // However, the request is "okundu olarak işaretlenen bildirimler silinsin", which means onMarkAsRead deletes.

    if (notification.type !== 'task_list_invitation' || notification.status !== 'pending') {
      onMarkAsRead(notification.id); // This will delete the notification
    }
    if (notification.linkTo) {
      onCloseDropdown(); 
    }
  };

  const handleAccept = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (currentUser && notification.type === 'task_list_invitation' && notification.status === 'pending') {
      acceptTaskListInvitation(notification.id); // This will now also delete the invitation
    }
    // Dropdown might close if the notification is deleted, or we can explicitly close it.
    // onCloseDropdown(); 
  };

  const handleDecline = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (currentUser && notification.type === 'task_list_invitation' && notification.status === 'pending') {
      declineTaskListInvitation(notification.id); // This will now also delete the invitation
    }
    // onCloseDropdown();
  };
  
  const avatarSrc = triggerUser?.avatarUrl || (triggerUser?.email ? `https://picsum.photos/seed/${triggerUser.email}/40/40` : `https://picsum.photos/seed/defaultuser/40/40`);
  
  // isRead is less relevant now as read notifications are deleted. The presence of the notification implies it's "unread" or active.
  // The blue dot styling for "unread" can be removed if all displayed notifications are effectively unread.
  // However, keeping the dot for explicit "mark as read (delete)" action might still be useful.
  const isEffectivelyUnread = !notification.isRead; // This property might be removed if always true for displayed items

  const content = (
    <div
      className={cn(
        "flex items-start space-x-3 p-3 hover:bg-secondary rounded-md transition-colors",
        // Removed: !notification.isRead && "bg-primary/10 hover:bg-primary/20", // Styling for unread state might change
        notification.linkTo && !(notification.type === 'task_list_invitation' && notification.status === 'pending') ? "cursor-pointer" : "cursor-default"
      )}
      onClick={notification.linkTo && !(notification.type === 'task_list_invitation' && notification.status === 'pending') ? handleItemClick : undefined} 
    >
      {triggerUser ? (
        <Avatar className="h-8 w-8 mt-0.5 shrink-0">
          <AvatarImage src={avatarSrc} alt={triggerUser.name} data-ai-hint="user avatar small"/>
          <AvatarFallback>{getInitials(triggerUser.name)}</AvatarFallback>
        </Avatar>
      ) : (
        <div className="h-8 w-8 flex items-center justify-center mt-0.5 shrink-0">
          {getNotificationIcon(notification.type, notification.status)}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm", /* Removed: !notification.isRead && "font-semibold" */)}>
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: tr })}
        </p>
        {notification.type === 'task_list_invitation' && notification.recipientId === currentUser?.id && notification.status === 'pending' && (
          <div className="mt-2 flex space-x-2">
            <Button size="sm" onClick={handleAccept} className="h-7 px-2 py-1 text-xs">
              <CheckCircle className="mr-1 h-3.5 w-3.5" /> Kabul Et
            </Button>
            <Button variant="outline" size="sm" onClick={handleDecline} className="h-7 px-2 py-1 text-xs">
              <XCircle className="mr-1 h-3.5 w-3.5" /> Reddet
            </Button>
          </div>
        )}
         {/* Display for the inviter about the response. This will be for 'invitation_response' type now. */}
         {notification.type === 'invitation_response' && notification.recipientId === currentUser?.id && (
             <p className={cn("text-xs mt-1", notification.message.includes("kabul etti") ? "text-status-completed" : "text-destructive")}>
                {/* Message already contains accepted/declined status */}
             </p>
         )}
      </div>
      {/* This button now effectively means "Delete this notification" */}
      <button 
        onClick={(e) => { e.stopPropagation(); onMarkAsRead(notification.id); }} 
        title="Okundu olarak işaretle ve sil"
        className="shrink-0 ml-2 mt-0.5"
        aria-label="Okundu olarak işaretle ve sil"
      >
        <Circle className="h-2.5 w-2.5 fill-primary text-primary" />
      </button>
    </div>
  );

  if (notification.linkTo && !(notification.type === 'task_list_invitation' && notification.status === 'pending' && notification.recipientId === currentUser?.id)) {
    return <Link href={notification.linkTo} passHref legacyBehavior onClick={handleItemClick}>{content}</Link>;
  }
  return content;
}