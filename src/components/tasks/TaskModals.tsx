"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { TaskForm, type TaskFormValues } from "./TaskForm";
import type { Task } from "@/lib/types";
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from "@/hooks/use-toast";

interface TaskModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  taskToEdit?: Task | null;
  initialDate?: Date;
  listIdForNewTask?: string;
}

export function TaskModal({ isOpen, onOpenChange, taskToEdit, initialDate, listIdForNewTask }: TaskModalProps) {
  const { addTask, updateTask } = useAppContext();
  const { toast } = useToast();

  const handleSubmit = (values: TaskFormValues) => {
    if (taskToEdit) {
      updateTask({ 
        ...taskToEdit, 
        title: values.title,
        dueDate: values.dueDate,
        time: values.time,
        notes: values.notes,
        isCompleted: values.isCompleted !== undefined ? values.isCompleted : taskToEdit.isCompleted,
      });
      toast({ title: "Görev Güncellendi", description: `"${values.title}" başarıyla güncellendi.` });
    } else if (listIdForNewTask) {
      addTask(values, listIdForNewTask);
      toast({ title: "Görev Eklendi", description: `"${values.title}" başarıyla eklendi.` });
    } else {
      toast({ title: "Hata", description: "Yeni görev için liste ID'si belirtilmedi.", variant: "destructive" });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{taskToEdit ? "Görevi Düzenle" : "Yeni Görev Ekle"}</DialogTitle>
          <DialogDescription>
            {taskToEdit ? "Görevin detaylarını düzenleyin." : "Yeni bir görev oluşturun."}
          </DialogDescription>
        </DialogHeader>
        <TaskForm
          task={taskToEdit}
          initialDueDateForNewTask={!taskToEdit ? initialDate : undefined}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

interface DeleteTaskAlertProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  taskToDelete: Task | null;
  onConfirmDelete: () => void;
}

export function DeleteTaskAlert({ isOpen, onOpenChange, taskToDelete, onConfirmDelete }: DeleteTaskAlertProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Görevi Silmek İstediğinizden Emin Misiniz?</AlertDialogTitle>
          <AlertDialogDescription>
            Bu işlem geri alınamaz. "{taskToDelete?.title}" adlı görev kalıcı olarak silinecektir.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>İptal</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirmDelete} className="bg-destructive hover:bg-destructive/90">
            Sil
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}