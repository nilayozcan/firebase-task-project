"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { tr } from 'date-fns/locale';
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const taskFormSchema = z.object({
  title: z.string().min(1, { message: "Başlık gerekli." }).max(100, { message: "Başlık en fazla 100 karakter olabilir."}),
  dueDate: z.date({ required_error: "Bitiş tarihi gerekli." }),
  time: z.string().optional().refine(value => !value || timeRegex.test(value), {
    message: "Geçerli bir saat girin (HH:SS)."
  }),
  notes: z.string().optional(),
  isCompleted: z.boolean().optional(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (values: TaskFormValues) => void;
  onCancel?: () => void;
  initialDueDateForNewTask?: Date;
}

export function TaskForm({ task, onSubmit, onCancel, initialDueDateForNewTask }: TaskFormProps) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task?.title || "",
      dueDate: task?.dueDate || initialDueDateForNewTask || new Date(),
      time: task?.time || "",
      notes: task?.notes || "",
      isCompleted: task?.isCompleted || false,
    },
  });

  const handleSubmit = (values: TaskFormValues) => {
    onSubmit(values);
    if (!task) form.reset({ 
        title: "",
        dueDate: initialDueDateForNewTask || new Date(),
        time: "",
        notes: "",
        isCompleted: false
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Başlık</FormLabel>
              <FormControl>
                <Input placeholder="Örn: Proje sunumunu hazırla" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Bitiş Tarihi</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: tr })
                        ) : (
                          <span>Bir tarih seçin</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) }
                      initialFocus
                      locale={tr}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Saat (İsteğe Bağlı)</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input type="time" placeholder="HH:SS" {...field} className="pr-8"/>
                  </FormControl>
                  <Clock className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notlar (İsteğe Bağlı)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Görevle ilgili ek detaylar..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              İptal
            </Button>
          )}
          <Button type="submit">{task ? "Görevi Güncelle" : "Görev Ekle"}</Button>
        </div>
      </form>
    </Form>
  );
}