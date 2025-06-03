"use client";

import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { MonthlyCalendar } from '@/components/calendar/MonthlyCalendar';
import { TaskModal } from '@/components/tasks/TaskModals';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function DashboardPage() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedDateForNewTask, setSelectedDateForNewTask] = useState<Date | undefined>(undefined);

  const handleOpenTaskModalForDate = (date: Date) => {
    setSelectedDateForNewTask(date);
    setIsTaskModalOpen(true);
  };
  
  const handleOpenTaskModal = () => {
    setSelectedDateForNewTask(new Date()); // Default to today if opened from general button
    setIsTaskModalOpen(true);
  };

  return (
    <AppLayout pageTitle="Takvim">
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button onClick={handleOpenTaskModal}>
            <PlusCircle className="mr-2 h-4 w-4" /> Yeni Görev Ekle
          </Button>
        </div>
        <MonthlyCalendar onAddTask={handleOpenTaskModalForDate} />
      </div>
      <TaskModal
        isOpen={isTaskModalOpen}
        onOpenChange={setIsTaskModalOpen}
        initialDate={selectedDateForNewTask}
      />
    </AppLayout>
  );
}