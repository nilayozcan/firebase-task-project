"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TaskListForm, type TaskListFormValues } from "./TaskListForm";
import type { TaskList } from "@/lib/types";

interface TaskListModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  taskListToEdit?: TaskList | null;
  onSubmit: (values: TaskListFormValues) => void;
}

export function TaskListModal({ isOpen, onOpenChange, taskListToEdit, onSubmit }: TaskListModalProps) {
  const handleSubmit = (values: TaskListFormValues) => {
    onSubmit(values);
    onOpenChange(false); // Close modal on submit
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{taskListToEdit ? "Görev Listesini Düzenle" : "Yeni Görev Listesi Oluştur"}</DialogTitle>
          <DialogDescription>
            {taskListToEdit ? "Liste detaylarını güncelleyin." : "Listeniz için gerekli bilgileri girin."}
          </DialogDescription>
        </DialogHeader>
        <TaskListForm
          taskList={taskListToEdit}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}