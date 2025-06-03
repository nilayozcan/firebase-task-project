"use client";

import type { Task } from "@/lib/types";
import { format } from "date-fns";
import { tr } from 'date-fns/locale';
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Edit3, Trash2, CalendarDays, Clock, StickyNote } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskItem({ task, onToggleComplete, onEdit, onDelete }: TaskItemProps) {
  const dueDateFormatted = format(task.dueDate, "dd MMMM yyyy", { locale: tr });
  const isOverdue = !task.isCompleted && task.dueDate < new Date(new Date().setHours(0,0,0,0));

  return (
    <TooltipProvider delayDuration={300}>
      <Card className={cn("transition-all duration-300 hover:shadow-md", task.isCompleted ? "bg-secondary/70" : "bg-card")}>
        <CardContent className="p-4 flex items-start space-x-4">
          <Checkbox
            id={`task-${task.id}`}
            checked={task.isCompleted}
            onCheckedChange={() => onToggleComplete(task.id)}
            aria-label={task.isCompleted ? "Görevi bekliyor olarak işaretle" : "Görevi tamamlandı olarak işaretle"}
            className="mt-1" // Align checkbox with first line of text
          />
          <div className="flex-1 min-w-0">
            <label
              htmlFor={`task-${task.id}`}
              className={cn(
                "block font-medium cursor-pointer",
                task.isCompleted && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </label>
            <div className={cn(
              "flex items-center text-xs mt-1",
              task.isCompleted ? "text-muted-foreground" : "text-foreground/80",
              isOverdue && !task.isCompleted && "text-destructive font-medium"
            )}>
              <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
              <span>{dueDateFormatted}</span>
              {task.time && (
                <>
                  <Clock className="ml-2 mr-1 h-3.5 w-3.5" />
                  <span>{task.time}</span>
                </>
              )}
              {isOverdue && !task.isCompleted && <span className="ml-2">(Gecikmiş)</span>}
            </div>
            {task.notes && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={cn(
                    "mt-1.5 text-xs flex items-start",
                     task.isCompleted ? "text-muted-foreground/80" : "text-foreground/70"
                  )}>
                    <StickyNote className="mr-1.5 h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <p className="line-clamp-2 break-words">
                      {task.notes}
                    </p>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="start" className="max-w-xs w-auto">
                  <p className="text-sm whitespace-pre-wrap">{task.notes}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 shrink-0">
            <Button variant="ghost" size="icon" onClick={() => onEdit(task)} aria-label="Görevi düzenle" className="h-8 w-8">
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(task)} className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 h-8 w-8" aria-label="Görevi sil">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}