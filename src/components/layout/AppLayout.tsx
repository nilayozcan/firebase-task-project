"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Task, UserProfile, TaskList, Comment, Notification, NotificationType, NotificationStatus } from '@/lib/types';
import { initialTasksData, initialUserProfilesData, initialTaskListsData } from '@/lib/initialData';
import type { TaskFormValues } from '@/components/tasks/TaskForm';
import type { ProfileFormValues as UserProfileFormValues } from '@/components/settings/ProfileForm';
import type { SignupFormValues } from '@/components/auth/SignupForm';
import type { LoginFormValues } from '@/components/auth/LoginForm';
import { sendVerificationEmail } from '@/actions/emailActions';
import { format, isToday, isWithinInterval, addDays, startOfDay, endOfDay } from 'date-fns';
import { tr } from 'date-fns/locale';

interface AppContextType {
  tasks: Task[];
  addTask: (taskDetails: TaskFormValues, listId: string) => void;
  updateTask: (updatedTask: Task) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskCompletion: (taskId: string) => void;

  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  allUsers: UserProfile[];
  registerUser: (values: SignupFormValues) => Promise<{ success: boolean; message: string; userId?: string }>;
  loginUser: (values: LoginFormValues) => Promise<{ success: boolean; message: string }>;
  logoutUser: () => void;
  verifyUser: (userId: string) => void;
  updateUserProfile: (profile: UserProfileFormValues) => void;
  followUser: (targetUserId: string) => void;
  unfollowUser: (targetUserId: string) => void;

  taskLists: TaskList[];
  addTaskList: (listData: { name: string; visibility: 'public' | 'private'; color: string; usersToInvite?: string[] }) => string;
  updateTaskList: (listId: string, updates: Partial<Omit<TaskList, 'id' | 'ownerId' | 'createdAt'>>, usersToInvite?: string[]) => void;
  inviteUserToTaskList: (listId: string, inviteeUserId: string) => void;
  deleteTaskList: (listId: string) => void;
  updateTaskListVisibility: (listId: string, visibility: 'public' | 'private') => void;
  acceptTaskListInvitation: (notificationId: string) => void;
  declineTaskListInvitation: (notificationId: string) => void;

  addComment: (taskId: string, text: string) => void;

  notifications: Notification[];
  addNotification: (notificationPayload: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: (recipientId: string) => void;
  deleteNotification: (notificationId: string) => void;

  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>(initialUserProfilesData);
  const [currentUser, setCurrentUserInternal] = useState<UserProfile | null>(null);
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const setCurrentUser = useCallback((user: UserProfile | null) => {
    setCurrentUserInternal(user);
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('currentUserId', user.id);
      } else {
        localStorage.removeItem('currentUserId');
      }
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (typeof window !== 'undefined') {
      try {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks).map((task: Task) => ({ ...task, dueDate: new Date(task.dueDate), createdAt: new Date(task.createdAt), comments: (task.comments || []).map(c => ({...c, createdAt: new Date(c.createdAt)}))})) );
        } else {
          setTasks(initialTasksData);
        }

        const storedUsers = localStorage.getItem('allUsers');
        let usersToLoad: UserProfile[];
        if (storedUsers) {
          usersToLoad = JSON.parse(storedUsers);
        } else {
          usersToLoad = initialUserProfilesData;
        }
        usersToLoad = usersToLoad.filter(user => user.username && user.username.trim() !== '');
        setAllUsers(usersToLoad.map((user: UserProfile) => ({ ...user, dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : undefined })));

        const currentUserId = localStorage.getItem('currentUserId');
        if (currentUserId) {
          const foundUser = usersToLoad.find((u: UserProfile) => u.id === currentUserId);
          if (foundUser) setCurrentUserInternal({ ...foundUser, dateOfBirth: foundUser.dateOfBirth ? new Date(foundUser.dateOfBirth) : undefined });
        }

        const storedTaskLists = localStorage.getItem('taskLists');
        if (storedTaskLists) {
          setTaskLists(JSON.parse(storedTaskLists).map((list: TaskList) => ({ ...list, createdAt: new Date(list.createdAt), color: list.color || 'hsl(207, 70%, 53%)' })));
        } else {
          setTaskLists(initialTaskListsData);
        }

        const storedNotifications = localStorage.getItem('notifications');
        if (storedNotifications) {
          setNotifications(JSON.parse(storedNotifications).map((n: Notification) => ({ ...n, createdAt: new Date(n.createdAt) })));
        } else {
          setNotifications([]);
        }

        const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (storedTheme) {
          setTheme(storedTheme);
          document.documentElement.classList.toggle('dark', storedTheme === 'dark');
        }
      } catch (error) {
        console.error("Error loading data from localStorage:", error);
        setTasks(initialTasksData);
        setAllUsers(initialUserProfilesData.filter(user => user.username && user.username.trim() !== ''));
        setTaskLists(initialTaskListsData);
        setNotifications([]);
      } finally {
        setIsMounted(true);
        setIsLoading(false);
      }
    } else {
      setTasks(initialTasksData);
      setAllUsers(initialUserProfilesData.filter(user => user.username && user.username.trim() !== ''));
      setTaskLists(initialTaskListsData);
      setNotifications([]);
      setIsMounted(true);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { if (isMounted && typeof window !== 'undefined') localStorage.setItem('tasks', JSON.stringify(tasks)); }, [tasks, isMounted]);
  useEffect(() => { if (isMounted && typeof window !== 'undefined') localStorage.setItem('allUsers', JSON.stringify(allUsers)); }, [allUsers, isMounted]);
  useEffect(() => { if (isMounted && typeof window !== 'undefined') localStorage.setItem('taskLists', JSON.stringify(taskLists)); }, [taskLists, isMounted]);
  useEffect(() => { if (isMounted && typeof window !== 'undefined') localStorage.setItem('notifications', JSON.stringify(notifications)); }, [notifications, isMounted]);

  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme, isMounted]);

   useEffect(() => {
    if (isMounted && currentUser) {
        const updatedCurrentUser = allUsers.find(u => u.id === currentUser.id);
        if (updatedCurrentUser && JSON.stringify(updatedCurrentUser) !== JSON.stringify(currentUser)) {
             setCurrentUserInternal({ ...updatedCurrentUser, dateOfBirth: updatedCurrentUser.dateOfBirth ? new Date(updatedCurrentUser.dateOfBirth) : undefined });
        } else if (!updatedCurrentUser) {
            setCurrentUserInternal(null);
        }
    }
  }, [allUsers, currentUser, isMounted]);

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  const addNotification = useCallback((notificationPayload: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    const now = new Date();
    if (notificationPayload.type === 'birthday_reminder' || notificationPayload.type === 'upcoming_task') {
      const existingNotification = notifications.find(n =>
        n.recipientId === notificationPayload.recipientId &&
        n.type === notificationPayload.type &&
        n.relatedItemId === notificationPayload.relatedItemId &&
        isToday(new Date(n.createdAt))
      );
      if (existingNotification) {
        return;
      }
    } else if (notificationPayload.type === 'task_list_invitation' && notificationPayload.status === 'pending') {
        const existingInvitation = notifications.find(n =>
            n.type === 'task_list_invitation' &&
            n.recipientId === notificationPayload.recipientId &&
            n.relatedItemId === notificationPayload.relatedItemId &&
            n.status === 'pending'
        );
        if (existingInvitation) {
            return;
        }
    }

    const newNotification: Notification = {
      id: crypto.randomUUID(),
      ...notificationPayload,
      createdAt: now,
      isRead: false,
    };
    setNotifications(prev => [newNotification, ...prev].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, [notifications]);

  const markNotificationAsRead = useCallback((notificationId: string) => {
    deleteNotification(notificationId);
  }, [deleteNotification]);

  const markAllNotificationsAsRead = useCallback((recipientId: string) => {
    setNotifications(prev => prev.filter(n => n.recipientId !== recipientId || (n.type === 'task_list_invitation' && n.status === 'pending')));
  }, []);

  const registerUser = useCallback(async (values: SignupFormValues): Promise<{ success: boolean; message: string; userId?: string}> => {
    return new Promise(async resolve => {
        if (allUsers.some(user => user.email === values.email)) {
            resolve({ success: false, message: "Bu e-posta adresi zaten kullanılıyor." }); return;
        }
        if (allUsers.some(user => user.username === values.username)) {
            resolve({ success: false, message: "Bu kullanıcı adı zaten kullanılıyor." }); return;
        }
        const newUserId = crypto.randomUUID();
        const newUser: UserProfile = {
            id: newUserId, name: values.name, email: values.email, username: values.username,
            password: values.password, dateOfBirth: values.dateOfBirth,
            avatarUrl: `https://picsum.photos/seed/${values.email}/128/128`,
            following: [], followers: [],
            isVerified: true,
        };
        setAllUsers(prev => [...prev, newUser]);
        resolve({ success: true, message: "Kayıt başarılı! Hesabınız oluşturuldu.", userId: newUser.id });
    });
  }, [allUsers]);

  const loginUser = useCallback(async (values: LoginFormValues): Promise<{ success: boolean; message: string }> => {
    return new Promise(resolve => {
        const user = allUsers.find(u => (u.username === values.identifier || u.email === values.identifier));
        if (!user) { resolve({ success: false, message: "Kullanıcı bulunamadı." }); return; }
        if (user.password !== values.password) { resolve({ success: false, message: "Yanlış şifre." }); return; }
        setCurrentUser(user);
        resolve({ success: true, message: "Giriş başarılı!" });
    });
  }, [allUsers, setCurrentUser]);

  const logoutUser = useCallback(() => { setCurrentUser(null); }, [setCurrentUser]);

  const verifyUser = useCallback((userId: string) => {
    setAllUsers(prev => prev.map(user => user.id === userId ? { ...user, isVerified: true } : user));
    if (currentUser && currentUser.id === userId && !currentUser.isVerified) {
        setCurrentUser({ ...currentUser, isVerified: true });
    }
  }, [currentUser, setCurrentUser]);

  const addTask = useCallback((taskDetails: TaskFormValues, listId: string) => {
    if (!currentUser) return;
    const newTask: Task = {
      id: crypto.randomUUID(), title: taskDetails.title, dueDate: taskDetails.dueDate,
      time: taskDetails.time, notes: taskDetails.notes,
      isCompleted: taskDetails.isCompleted || false, createdAt: new Date(), listId, comments: [],
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  }, [currentUser]);

  const updateTask = useCallback((updatedTask: Task) => {
    if (!currentUser) return;
    setTasks(prevTasks => prevTasks.map(task => task.id === updatedTask.id ? { ...task, ...updatedTask } : task));
  }, [currentUser]);

  const deleteTask = useCallback((taskId: string) => {
    if (!currentUser) return;
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  }, [currentUser]);

  const toggleTaskCompletion = useCallback((taskId: string) => {
    if (!currentUser) return;
    setTasks(prevTasks => prevTasks.map(task => task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task));
  }, [currentUser]);

  const updateUserProfile = useCallback((profileUpdate: UserProfileFormValues) => {
    if (!currentUser) return;
    setAllUsers(prevAllUsers => prevAllUsers.map(user =>
      user.id === currentUser.id ? { ...user, ...profileUpdate, dateOfBirth: user.dateOfBirth, avatarUrl: profileUpdate.avatarUrl || user.avatarUrl } : user
    ));
  }, [currentUser]);

  const followUser = useCallback((targetUserId: string) => {
    if (!currentUser) return;
    const targetUser = allUsers.find(u => u.id === targetUserId);
    if (!targetUser) return;

    setAllUsers(prevAllUsers => prevAllUsers.map(user => {
        if (user.id === currentUser.id) return { ...user, following: [...new Set([...user.following, targetUserId])] };
        if (user.id === targetUserId) return { ...user, followers: [...new Set([...user.followers, currentUser.id])] };
        return user;
      }));
    addNotification({
      recipientId: targetUserId,
      triggerUserId: currentUser.id,
      type: 'new_follower',
      message: `${currentUser.name} sizi takip etmeye başladı.`,
      linkTo: `/profile/${currentUser.id}`
    });
  }, [currentUser, allUsers, addNotification]);

  const unfollowUser = useCallback((targetUserId: string) => {
    if (!currentUser) return;
    setAllUsers(prevAllUsers => prevAllUsers.map(user => {
        if (user.id === currentUser.id) return { ...user, following: user.following.filter(id => id !== targetUserId) };
        if (user.id === targetUserId) return { ...user, followers: user.followers.filter(id => id !== currentUser.id) };
        return user;
      }));
  }, [currentUser]);

  const inviteUserToTaskList = useCallback((listId: string, inviteeUserId: string) => {
    if (!currentUser) return;
    const list = taskLists.find(l => l.id === listId);
    const invitee = allUsers.find(u => u.id === inviteeUserId);
    if (!list || !invitee) return;

    const existingInvitation = notifications.find(n =>
        n.type === 'task_list_invitation' &&
        n.recipientId === inviteeUserId &&
        n.relatedItemId === listId &&
        n.status === 'pending'
    );
    if (list.sharedWith.includes(inviteeUserId) || existingInvitation) {
        return;
    }

    addNotification({
      recipientId: inviteeUserId,
      triggerUserId: currentUser.id,
      type: 'task_list_invitation',
      message: `${currentUser.name}, sizi "${list.name}" adlı listeye davet etti.`,
      relatedItemId: listId,
      status: 'pending',
      linkTo: `/tasks?list=${listId}`
    });
  }, [currentUser, taskLists, allUsers, addNotification, notifications]);

  const addTaskList = useCallback((listData: { name: string; visibility: 'public' | 'private'; color: string; usersToInvite?: string[] }): string => {
    if (!currentUser) return "";
    const newListId = crypto.randomUUID();
    const newList: TaskList = {
      id: newListId, name: listData.name, ownerId: currentUser.id, sharedWith: [],
      createdAt: new Date(), visibility: listData.visibility, color: listData.color,
    };
    setTaskLists(prev => [...prev, newList]);
    if (listData.usersToInvite) {
      listData.usersToInvite.forEach(userId => inviteUserToTaskList(newListId, userId));
    }
    return newListId;
  }, [currentUser, inviteUserToTaskList]);

  const updateTaskList = useCallback((listId: string, updates: Partial<Omit<TaskList, 'id' | 'ownerId' | 'createdAt'>>, usersToInvite?: string[]) => {
    if (!currentUser) return;
    setTaskLists(prev => prev.map(list =>
      list.id === listId && list.ownerId === currentUser.id ? { ...list, ...updates } : list
    ));
    if (usersToInvite) {
        usersToInvite.forEach(userId => inviteUserToTaskList(listId, userId));
    }
  }, [currentUser, inviteUserToTaskList]);

  const deleteTaskList = useCallback((listId: string) => {
    if (!currentUser) return;
    setTaskLists(prev => prev.filter(list => list.id !== listId || list.ownerId !== currentUser.id));
    setTasks(prevTasks => prevTasks.filter(task => task.listId !== listId));
  }, [currentUser]);

  const updateTaskListVisibility = useCallback((listId: string, visibility: 'public' | 'private') => {
    if (!currentUser) return;
    setTaskLists(prev => prev.map(list =>
      list.id === listId && list.ownerId === currentUser.id ? { ...list, visibility } : list
    ));
  }, [currentUser]);

  const acceptTaskListInvitation = useCallback((notificationId: string) => {
    if (!currentUser) return;
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification || notification.type !== 'task_list_invitation' || !notification.relatedItemId || !notification.triggerUserId) {
        deleteNotification(notificationId);
        return;
    }

    setTaskLists(prev => prev.map(list =>
      list.id === notification.relatedItemId
        ? { ...list, sharedWith: [...new Set([...list.sharedWith, currentUser.id])] }
        : list
    ));

    const list = taskLists.find(l => l.id === notification.relatedItemId);
    const inviter = allUsers.find(u => u.id === notification.triggerUserId);

    if (list && inviter) {
        addNotification({
            recipientId: inviter.id,
            triggerUserId: currentUser.id,
            type: 'invitation_response',
            message: `${currentUser.name}, "${list.name}" listesine katılma davetinizi kabul etti.`,
            relatedItemId: list.id,
            linkTo: `/tasks?list=${list.id}`
        });
    }
    deleteNotification(notificationId);
  }, [currentUser, notifications, taskLists, allUsers, addNotification, deleteNotification]);

  const declineTaskListInvitation = useCallback((notificationId: string) => {
     if (!currentUser) return;
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification || notification.type !== 'task_list_invitation' || !notification.relatedItemId || !notification.triggerUserId) {
        deleteNotification(notificationId);
        return;
    }

    const list = taskLists.find(l => l.id === notification.relatedItemId);
    const inviter = allUsers.find(u => u.id === notification.triggerUserId);

    if (list && inviter) {
        addNotification({
            recipientId: inviter.id,
            triggerUserId: currentUser.id,
            type: 'invitation_response',
            message: `${currentUser.name}, "${list.name}" listesine katılma davetinizi reddetti.`,
            relatedItemId: list.id
        });
    }
    deleteNotification(notificationId);
  }, [currentUser, notifications, taskLists, addNotification, allUsers, deleteNotification]);

  const addComment = useCallback((taskId: string, text: string) => {
    if (!currentUser) return;
    const newComment: Comment = {
      id: crypto.randomUUID(), taskId, userId: currentUser.id, text, createdAt: new Date(),
    };
    setTasks(prevTasks => prevTasks.map(task =>
      task.id === taskId ? { ...task, comments: [...(task.comments || []), newComment] } : task
    ));
  }, [currentUser]);

  const toggleTheme = useCallback(() => { setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light')); }, []);

  useEffect(() => {
    if (!currentUser || !isMounted || isLoading) return;
    const todayDate = new Date();

    currentUser.following.forEach(followedUserId => {
      const followedUser = allUsers.find(u => u.id === followedUserId);
      if (followedUser && followedUser.dateOfBirth) {
        const birthDate = new Date(followedUser.dateOfBirth);
        if (birthDate.getMonth() === todayDate.getMonth() && birthDate.getDate() === todayDate.getDate()) {
          addNotification({
            recipientId: currentUser.id,
            triggerUserId: followedUser.id,
            type: 'birthday_reminder',
            message: `Bugün ${followedUser.name}'in doğum günü! Bir mesaj göndermeyi unutma.`,
            linkTo: `/profile/${followedUser.id}`
          });
        }
      }
    });

    const tomorrow = addDays(todayDate, 1);
    tasks.filter(task =>
      task.listId && taskLists.some(list => list.id === task.listId && (list.ownerId === currentUser.id || list.sharedWith.includes(currentUser.id))) &&
      !task.isCompleted &&
      isWithinInterval(new Date(task.dueDate), { start: startOfDay(todayDate), end: endOfDay(tomorrow) })
    ).forEach(task => {
      addNotification({
        recipientId: currentUser.id,
        type: 'upcoming_task',
        message: `Yaklaşan görev: "${task.title}" ${format(new Date(task.dueDate), "PPP", {locale: tr})} tarihinde teslim edilecek.`,
        relatedItemId: task.id,
        linkTo: `/tasks?list=${task.listId}&task=${task.id}`
      });
    });

  }, [currentUser, allUsers, tasks, taskLists, isMounted, addNotification, isLoading]);

  if (!isMounted && typeof window === 'undefined') {
    return null;
  }

  return (
    <AppContext.Provider value={{
      tasks, addTask, updateTask, deleteTask, toggleTaskCompletion,
      currentUser, setCurrentUser, allUsers, registerUser, loginUser, logoutUser, verifyUser,
      updateUserProfile, followUser, unfollowUser,
      taskLists, addTaskList, updateTaskList, inviteUserToTaskList, deleteTaskList, updateTaskListVisibility,
      acceptTaskListInvitation, declineTaskListInvitation,
      addComment,
      notifications, addNotification, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification,
      theme, toggleTheme,
      isLoading
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}