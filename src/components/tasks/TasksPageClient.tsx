"use client";

import { useState, useMemo } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from '@/components/ui/card';
import { TaskItem } from '@/components/tasks/TaskItem';
import { TaskModal, DeleteTaskAlert } from '@/components/tasks/TaskModals';
import { TaskListModal } from '@/components/tasks/TaskListModal';
import type { Task, TaskList } from '@/lib/types';
import type { TaskListFormValues } from '@/components/tasks/TaskListForm';
import { PlusCircle, Edit, Trash2, ListPlus, FolderPlus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";

export function TasksPageClient() {
  const {
    tasks,
    taskLists,
    currentUser,
    deleteTask: contextDeleteTask,
    toggleTaskCompletion,
    addTaskList,
    updateTaskList, 
    deleteTaskList: contextDeleteTaskList,
    inviteUserToTaskList, // Added for explicit invitation
  } = useAppContext();
  const { toast } = useToast();

  const [isTaskListModalOpen, setIsTaskListModalOpen] = useState(false);
  const [taskListToEdit, setTaskListToEdit] = useState<TaskList | null>(null);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [currentListIdForNewTask, setCurrentListIdForNewTask] = useState<string | null>(null);

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'task' | 'list'; data: Task | TaskList } | null>(null);
  
  const [activeAccordionItem, setActiveAccordionItem] = useState<string | undefined>(undefined);


  const userTaskLists = useMemo(() => {
    if (!currentUser) return [];
    return taskLists.filter(
      (list) => list.ownerId === currentUser.id || list.sharedWith.includes(currentUser.id)
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [taskLists, currentUser]);

  const handleOpenNewTaskListModal = () => {
    setTaskListToEdit(null);
    setIsTaskListModalOpen(true);
  };

  const handleOpenEditTaskListModal = (list: TaskList) => {
    setTaskListToEdit(list);
    setIsTaskListModalOpen(true);
  };

  const handleTaskListFormSubmit = (values: TaskListFormValues) => {
    if (taskListToEdit) {
      // When updating, we pass updates and new users to invite separately
      updateTaskList(taskListToEdit.id, {
        name: values.name,
        visibility: values.visibility,
        color: values.color,
        // sharedWith is not directly updated here; use inviteUserToTaskList for new users
      }, values.usersToInvite);
      toast({ title: "Liste Güncellendi", description: `"${values.name}" başarıyla güncellendi.` });
    } else {
      // When adding, pass usersToInvite to addTaskList
      const newListId = addTaskList({
        name: values.name,
        visibility: values.visibility,
        color: values.color,
        usersToInvite: values.usersToInvite,
      });
      toast({ title: "Liste Oluşturuldu", description: `"${values.name}" başarıyla oluşturuldu.` });
      setActiveAccordionItem(newListId); 
    }
    setIsTaskListModalOpen(false);
  };

  const handleOpenNewTaskModal = (listId: string) => {
    setTaskToEdit(null);
    setCurrentListIdForNewTask(listId);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTaskModal = (task: Task) => {
    setTaskToEdit(task);
    setCurrentListIdForNewTask(task.listId); 
    setIsTaskModalOpen(true);
  };

  const handleDeleteConfirmation = (type: 'task' | 'list', data: Task | TaskList) => {
    setItemToDelete({ type, data });
    setIsDeleteAlertOpen(true);
  };

  const confirmDeleteItem = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'task') {
      contextDeleteTask(itemToDelete.data.id);
      toast({ title: "Görev Silindi", description: `"${(itemToDelete.data as Task).title}" başarıyla silindi.` });
    } else if (itemToDelete.type === 'list') {
      contextDeleteTaskList(itemToDelete.data.id);
      toast({ title: "Liste Silindi", description: `"${(itemToDelete.data as TaskList).name}" ve içindeki tüm görevler silindi.` });
       if (activeAccordionItem === itemToDelete.data.id) {
        setActiveAccordionItem(undefined);
      }
    }
    setIsDeleteAlertOpen(false);
    setItemToDelete(null);
  };
  
  const getTasksForList = (listId: string) => {
    return tasks.filter(task => task.listId === listId).sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  };

  if (!currentUser) {
      return <p>Görevleri görüntülemek için lütfen giriş yapın.</p> // Or a loading/redirect component
  }


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Görev Listelerim</h2>
        <Button onClick={handleOpenNewTaskListModal}>
          <FolderPlus className="mr-2 h-4 w-4" /> Yeni Liste Oluştur
        </Button>
      </div>

      {userTaskLists.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
             <ListPlus className="mx-auto h-12 w-12 mb-4 text-gray-400" />
            <p className="text-lg font-medium">Henüz görev listeniz bulunmuyor.</p>
            <p className="text-sm">Başlamak için "Yeni Liste Oluştur" butonuna tıklayın.</p>
          </CardContent>
        </Card>
      ) : (
        <Accordion 
            type="single" 
            collapsible 
            className="w-full space-y-2"
            value={activeAccordionItem}
            onValueChange={setActiveAccordionItem}
        >
          {userTaskLists.map((list) => {
            const tasksInList = getTasksForList(list.id);
            const isOwner = list.ownerId === currentUser.id;
            return (
            <AccordionItem value={list.id} key={list.id} className="bg-card border rounded-lg shadow-sm overflow-hidden">
              <AccordionTrigger className="hover:no-underline px-4 py-3 data-[state=open]:bg-secondary/50">
                <div className="flex items-center justify-between w-full">
                    <div className='flex-1 text-left min-w-0 flex items-center'>
                        <span 
                            className="h-4 w-4 rounded-full mr-3 shrink-0 border"
                            style={{ backgroundColor: list.color }}
                            aria-label={`${list.name} liste rengi`}
                        ></span>
                        <span className="text-lg font-medium truncate">{list.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">({tasksInList.length} görev)</span>
                    </div>
                    {isOwner && ( // Only show edit/delete for owner
                        <div className="flex items-center space-x-1 shrink-0 ml-2">
                        <div
                            onClick={(e) => { e.stopPropagation(); handleOpenEditTaskListModal(list); }}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); handleOpenEditTaskListModal(list);}}}
                            role="button" tabIndex={0} aria-label="Listeyi düzenle"
                            className="p-1.5 rounded-md hover:bg-accent" // Wrapper for better click area
                        >
                            <Edit className="h-4 w-4" />
                        </div>
                        <div
                            onClick={(e) => { e.stopPropagation(); handleDeleteConfirmation('list', list); }}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); handleDeleteConfirmation('list', list);}}}
                            role="button" tabIndex={0} aria-label="Listeyi sil"
                            className="p-1.5 rounded-md text-destructive hover:bg-destructive/10" // Wrapper
                        >
                            <Trash2 className="h-4 w-4" />
                        </div>
                        </div>
                    )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2 border-t">
                <Button onClick={() => handleOpenNewTaskModal(list.id)} variant="outline" size="sm" className="mb-4 w-full sm:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" /> Yeni Görev Ekle
                </Button>
                {tasksInList.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Bu listede henüz görev yok.</p>
                ) : (
                  <div className="space-y-3">
                    {tasksInList.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggleComplete={toggleTaskCompletion}
                        onEdit={() => handleOpenEditTaskModal(task)}
                        onDelete={() => handleDeleteConfirmation('task', task)}
                      />
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          )})}
        </Accordion>
      )}

      <TaskListModal
        isOpen={isTaskListModalOpen}
        onOpenChange={setIsTaskListModalOpen}
        taskListToEdit={taskListToEdit}
        onSubmit={handleTaskListFormSubmit}
      />
      <TaskModal
        isOpen={isTaskModalOpen}
        onOpenChange={setIsTaskModalOpen}
        taskToEdit={taskToEdit}
        listIdForNewTask={currentListIdForNewTask!} 
        initialDate={taskToEdit ? undefined : new Date()} 
      />
      {itemToDelete && itemToDelete.type === 'task' && (
        <DeleteTaskAlert
          isOpen={isDeleteAlertOpen && itemToDelete?.type === 'task'}
          onOpenChange={(open) => { if (!open) { setIsDeleteAlertOpen(false); setItemToDelete(null);}}}
          taskToDelete={itemToDelete.data as Task}
          onConfirmDelete={confirmDeleteItem}
        />
      )}
       {itemToDelete && itemToDelete.type === 'list' && (
         <AlertDialog
            open={isDeleteAlertOpen && itemToDelete?.type === 'list'}
            onOpenChange={(open) => { if (!open) { setIsDeleteAlertOpen(false); setItemToDelete(null);}}}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Listeyi Silmek İstediğinizden Emin Misiniz?</AlertDialogTitle>
                <AlertDialogDescription>
                    Bu işlem geri alınamaz. "{(itemToDelete.data as TaskList).name}" adlı liste ve içindeki tüm görevler kalıcı olarak silinecektir.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel onClick={() => { setIsDeleteAlertOpen(false); setItemToDelete(null); }}>İptal</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDeleteItem} className="bg-destructive hover:bg-destructive/90">
                    Sil
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
       )}
    </div>
  );
}