"use client";

import { AppLayout } from '@/components/layout/AppLayout';
import { TasksPageClient } from '@/components/tasks/TasksPageClient';

export default function TasksPage() {
  return (
    <AppLayout pageTitle="Görev Listesi">
      <TasksPageClient />
    </AppLayout>
  );
}