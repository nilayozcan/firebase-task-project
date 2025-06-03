"use client";

import { useState, useMemo, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Task } from '@/lib/types';
import { format, isSameDay, isSameMonth } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, PlusCircle, Clock } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import type { DayProps } from 'react-day-picker';
import { cn } from '@/lib/utils';

interface MonthlyCalendarProps {
  onDateSelect?: (date: Date) => void;
  onAddTask?: (date: Date) => void;
}

const DEFAULT_LIST_COLOR_STYLE: React.CSSProperties = { backgroundColor: 'hsl(var(--muted))' };

export function MonthlyCalendar({ onDateSelect, onAddTask }: MonthlyCalendarProps) {
  const { tasks, taskLists, toggleTaskCompletion, currentUser } = useAppContext();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDayTasks, setSelectedDayTasks] = useState<Task[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [popoverTriggerElement, setPopoverTriggerElement] = useState<HTMLElement | null>(null);

  const isTaskVisibleToCurrentUser = (task: Task): boolean => {
    if (!currentUser) return false;
    const list = taskLists.find(tl => tl.id === task.listId);
    if (!list) return false; // Task belongs to a non-existent list
    return list.ownerId === currentUser.id || list.sharedWith.includes(currentUser.id);
  };

  const tasksInCurrentMonth = useMemo(() => {
    if (!currentUser) return [];
    return tasks.filter(task => 
      task.dueDate && 
      isSameMonth(task.dueDate, currentMonth) &&
      isTaskVisibleToCurrentUser(task)
    );
  }, [tasks, taskLists, currentMonth, currentUser]);

  const getListColorStyle = (listId: string | undefined): React.CSSProperties => {
    if (!listId) return DEFAULT_LIST_COLOR_STYLE;
    const taskList = taskLists.find(tl => tl.id === listId);
    return taskList && taskList.color 
      ? { backgroundColor: taskList.color } 
      : DEFAULT_LIST_COLOR_STYLE;
  };

  const handleDayClick = (day: Date, modifiers: any, e: React.MouseEvent<HTMLButtonElement>) => {
    if (!currentUser) return;
    const tasksForDay = tasks.filter(task => 
      task.dueDate && 
      isSameDay(task.dueDate, day) &&
      isTaskVisibleToCurrentUser(task)
    ).sort((a,b) => { 
        if (a.time && b.time) return a.time.localeCompare(b.time);
        if (a.time) return -1; 
        if (b.time) return 1;
        return 0;
    });
    setSelectedDayTasks(tasksForDay);
    if (onDateSelect) {
      onDateSelect(day);
    }
    if (tasksForDay.length > 0) {
      setPopoverTriggerElement(e.currentTarget);
      setIsPopoverOpen(true);
    } else {
      setIsPopoverOpen(false);
      if (onAddTask) {
        onAddTask(day);
      }
    }
  };
  
  const DayContent = (props: DayProps) => {
    const { date, displayMonth } = props;
    if (!currentUser) return <span>{format(date, 'd')}</span>;

    const tasksOnThisDay = tasks.filter(task => 
        task.dueDate && 
        isSameDay(task.dueDate, date) && 
        isSameMonth(task.dueDate, displayMonth) &&
        isTaskVisibleToCurrentUser(task)
    );
    const formattedDate = format(date, 'd');

    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <span>{formattedDate}</span>
        {tasksOnThisDay.length > 0 && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex space-x-1">
            {tasksOnThisDay.slice(0, 3).map(task => {
              const taskList = taskLists.find(tl => tl.id === task.listId);
              const listName = taskList ? taskList.name : "Bilinmeyen Liste"; 
              const colorStyle = taskList?.color 
                ? { backgroundColor: taskList.color } 
                : DEFAULT_LIST_COLOR_STYLE;
              return (
                <span
                  key={task.id}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    task.isCompleted && "opacity-50"
                  )}
                  style={colorStyle}
                  aria-label={`"${listName}" listesinden görev ${task.isCompleted ? "(tamamlandı)" : ""}`}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  };


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Takvim</CardTitle>
        <CardDescription>{format(currentMonth, 'MMMM yyyy', { locale: tr })}</CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          onDayClick={handleDayClick}
          locale={tr}
          className="rounded-md border p-0"
          classNames={{
            day_today: "bg-accent/50 text-accent-foreground",
            day: "h-14 w-14 text-base",
            head_cell: "text-muted-foreground rounded-md w-14 font-normal text-sm",
            cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          }}
          components={{
            DayContent: DayContent,
          }}
        />
        {popoverTriggerElement && (
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <button ref={setPopoverTriggerElement} style={{ display: 'none' }} />
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" side="bottom" align="start">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">
                  {selectedDayTasks.length > 0 && selectedDayTasks[0].dueDate ? format(selectedDayTasks[0].dueDate, 'dd MMMM yyyy', { locale: tr }) : ''} Görevleri
                </h4>
                <ul className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedDayTasks.map(task => {
                    const taskList = taskLists.find(tl => tl.id === task.listId);
                    const listName = taskList ? taskList.name : "Bilinmeyen Liste";
                    const listColorStyle = taskList?.color 
                      ? { backgroundColor: taskList.color } 
                      : DEFAULT_LIST_COLOR_STYLE;
                    return(
                    <li key={task.id} className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-secondary">
                      <div className="flex items-start space-x-2 flex-1 min-w-0">
                        <span
                          className="h-3 w-3 rounded-full shrink-0 mt-1" 
                          style={listColorStyle}
                          aria-hidden="true"
                        />
                        <div className="flex-1 min-w-0">
                          <span className={cn("block truncate", task.isCompleted ? "line-through text-muted-foreground" : "")}>
                            {task.title}
                          </span>
                          <div className="flex items-center text-xs text-muted-foreground">
                             <span className="truncate block">{listName}</span>
                             {task.time && (
                                <>
                                  <Clock className="ml-1.5 mr-0.5 h-3 w-3" />
                                  <span>{task.time}</span>
                                </>
                             )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleTaskCompletion(task.id)}
                        aria-label={task.isCompleted ? "Görevi bekliyor olarak işaretle" : "Görevi tamamlandı olarak işaretle"}
                        className="self-center" 
                      >
                        {task.isCompleted ? <CheckCircle2 className="h-4 w-4 text-status-completed" /> : <Circle className="h-4 w-4 text-status-pending" />}
                      </Button>
                    </li>
                  )})}
                </ul>
                {onAddTask && selectedDayTasks.length > 0 && selectedDayTasks[0].dueDate && (
                   <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => onAddTask(selectedDayTasks[0].dueDate as Date)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Yeni Görev Ekle
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </CardContent>
    </Card>
  );
}