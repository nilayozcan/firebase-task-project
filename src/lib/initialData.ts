import type { Task, UserProfile, TaskList, Comment, Notification } from '@/lib/types';

const today = new Date();
const getFutureDate = (days: number) => {
  const date = new Date();
  date.setDate(today.getDate() + days);
  return date;
};
const getPastDate = (days: number) => {
  const date = new Date();
  date.setDate(today.getDate() - days);
  return date;
}

export const initialUserProfilesData: UserProfile[] = [];

export const initialTaskListsData: TaskList[] = [];

export const initialTasksData: Task[] = [];

export const initialNotificationsData: Notification[] = [];