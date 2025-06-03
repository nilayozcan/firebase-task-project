export type Task = {
  id: string;
  title: string;
  dueDate: Date;
  time?: string; // Optional: HH:MM format
  notes?: string; // Optional: For additional details
  isCompleted: boolean;
  createdAt: Date;
  listId: string; // Added: ID of the task list this task belongs to
  comments: Comment[]; // Added: Array of comments on this task
};

export type UserProfile = {
  id: string;
  name: string; // Full name
  email: string;
  username: string; // Added for login
  password?: string; // Added for login, store hashed in real app
  dateOfBirth?: Date; // Added for registration
  avatarUrl?: string;
  following: string[];
  followers: string[];
  isVerified: boolean; // Added for email verification
};

export type TaskList = {
  id: string;
  name: string;
  ownerId: string; // User ID of the creator
  sharedWith: string[]; // Array of user IDs this list is shared with (accepted invitations)
  createdAt: Date;
  visibility: 'public' | 'private';
  color: string;
};

export type Comment = {
  id: string;
  taskId: string;
  userId: string; // User ID of the commenter
  text: string;
  createdAt: Date;
};

// Notification System Types
export type NotificationStatus = 'pending' | 'accepted' | 'declined' | 'viewed';

export type NotificationType =
  | 'new_follower'
  | 'task_list_invitation'
  | 'birthday_reminder'
  | 'upcoming_task'
  | 'invitation_response';

export type Notification = {
  id: string;
  recipientId: string;
  triggerUserId?: string;
  type: NotificationType;
  message: string;
  relatedItemId?: string; // e.g., listId for invitation, taskId for upcoming task
  createdAt: Date;
  isRead: boolean;
  status?: NotificationStatus;
  linkTo?: string;
};