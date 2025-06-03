"use client";

import type { TaskList } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label"; // Label might not be needed if not directly editing sharedWith here
import { Eye, EyeOff, Users, UserPlus, Edit } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation"; // To redirect to task list page for detailed sharing

interface TaskListSettingsProps {
  userOwnedTaskLists: TaskList[];
  onUpdateVisibility: (listId: string, newVisibility: 'public' | 'private') => void;
  // onManageSharing: (listId: string) => void; // Callback to open a more detailed sharing modal or navigate
}

export function TaskListSettings({ userOwnedTaskLists, onUpdateVisibility }: TaskListSettingsProps) {
  const router = useRouter();

  const handleManageSharingNavigation = (listId: string) => {
    // Navigate to the tasks page, potentially with a query param to open a specific list or sharing modal
    // For now, we can assume the user goes to the tasks page and finds the list.
    // Or, a more sophisticated approach would be a dedicated modal for managing sharing on this page.
    // Let's make it simple: navigate to /tasks where they can edit the list and invite.
    router.push(`/tasks?openList=${listId}`); // Example: open specific list
  };


  if (!userOwnedTaskLists || userOwnedTaskLists.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Görev Listelerim</CardTitle>
          <CardDescription>Henüz hiç görev listeniz bulunmuyor. Görevler sayfasından yeni bir liste oluşturabilirsiniz.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Görev Listelerim</CardTitle>
        <CardDescription>Görev listelerinizin görünürlüğünü yönetin ve davetleri düzenleyin. Davetler görev listesi sayfasından yönetilir.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {userOwnedTaskLists.map((list) => (
          <div key={list.id} className="flex items-center justify-between p-3 rounded-md border hover:bg-secondary/50 transition-colors">
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{list.name}</p>
              <div className="flex items-center text-xs text-muted-foreground space-x-2">
                <span>{list.visibility === 'public' ? 'Herkese Açık' : 'Özel'}</span>
                <span className="flex items-center">
                  <Users className="h-3 w-3 mr-1" /> {list.sharedWith.length} Paylaşılan
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3 shrink-0">
              {list.visibility === 'public' ? <Eye className="h-5 w-5 text-primary" /> : <EyeOff className="h-5 w-5 text-muted-foreground" />}
              <Switch
                id={`visibility-switch-${list.id}`}
                checked={list.visibility === 'public'}
                onCheckedChange={(checked) => {
                  onUpdateVisibility(list.id, checked ? 'public' : 'private');
                }}
                aria-label={`${list.name} listesi için görünürlük ayarı`}
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleManageSharingNavigation(list.id)}
                className="h-8 px-2"
                title="Paylaşımı ve Davetleri Yönet"
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}