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
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { TaskList } from "@/lib/types";
import { useAppContext } from "@/contexts/AppContext";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react"; 

const AVAILABLE_TASK_LIST_COLORS = [
  { name: 'Mavi', value: 'hsl(207, 70%, 53%)' }, 
  { name: 'Mor', value: 'hsl(260, 65%, 60%)' }, 
  { name: 'Turuncu', value: 'hsl(30, 90%, 60%)' }, 
  { name: 'Camgöbeği', value: 'hsl(180, 60%, 45%)' }, 
  { name: 'Pembe', value: 'hsl(330, 75%, 60%)' }, 
  { name: 'Sarı', value: 'hsl(50, 95%, 55%)' }, 
  { name: 'Koyu Mavi', value: 'hsl(197, 37%, 24%)' }, 
  { name: 'Turkuaz', value: 'hsl(170, 50%, 50%)' },
];


const taskListFormSchema = z.object({
  name: z.string().min(1, { message: "Liste adı gerekli." }).max(50, { message: "Liste adı en fazla 50 karakter olabilir." }),
  usersToInvite: z.array(z.string()).optional(), // Changed from sharedWith to usersToInvite
  visibility: z.enum(['public', 'private']),
  color: z.string().min(1, { message: "Renk seçimi gerekli." }),
});

export type TaskListFormValues = z.infer<typeof taskListFormSchema>;

interface TaskListFormProps {
  taskList?: TaskList | null;
  onSubmit: (values: TaskListFormValues) => void;
  onCancel: () => void;
}

export function TaskListForm({ taskList, onSubmit, onCancel }: TaskListFormProps) {
  const { allUsers, currentUser } = useAppContext();
  
  // Filter out current user and users already part of the list (if editing)
  const availableUsersToInvite = allUsers.filter(user => {
    if (user.id === currentUser.id) return false;
    if (taskList && taskList.sharedWith.includes(user.id)) return false; // Don't show already shared users for re-invitation
    return true;
  });

  const form = useForm<TaskListFormValues>({
    resolver: zodResolver(taskListFormSchema),
    defaultValues: {
      name: taskList?.name || "",
      usersToInvite: [], // Initialize as empty, users will be selected for invitation
      visibility: taskList?.visibility || 'private',
      color: taskList?.color || AVAILABLE_TASK_LIST_COLORS[0].value,
    },
  });

  const handleSubmit = (values: TaskListFormValues) => {
    onSubmit(values);
    if (!taskList) form.reset({ 
        name: "", 
        usersToInvite: [], 
        visibility: 'private', 
        color: AVAILABLE_TASK_LIST_COLORS[0].value 
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Liste Adı</FormLabel>
              <FormControl>
                <Input placeholder="Örn: Haftalık Alışveriş" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Liste Rengi</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-wrap gap-3"
                >
                  {AVAILABLE_TASK_LIST_COLORS.map((colorOpt) => (
                    <FormItem key={colorOpt.value} className="flex items-center space-x-1 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={colorOpt.value} id={`color-${colorOpt.value}`} className="sr-only" />
                      </FormControl>
                      <Label
                        htmlFor={`color-${colorOpt.value}`}
                        className={cn(
                          "h-8 w-8 rounded-full border-2 cursor-pointer flex items-center justify-center",
                          "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                          field.value === colorOpt.value ? "ring-2 ring-ring ring-offset-1 border-foreground/50" : "border-transparent hover:border-muted-foreground/50"
                        )}
                        style={{ backgroundColor: colorOpt.value }}
                        title={colorOpt.name}
                      >
                        {field.value === colorOpt.value && <Check className="h-4 w-4 text-white mix-blend-difference" />}
                      </Label>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="usersToInvite"
          render={({ field }) => (
            <FormItem>
              <div className="mb-2">
                <FormLabel className="text-base">Kullanıcı Davet Et</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Bu listeye hangi kullanıcıları davet etmek istersiniz?
                </p>
              </div>
              <ScrollArea className="h-40 rounded-md border p-2">
                {availableUsersToInvite.length > 0 ? (
                  availableUsersToInvite.map((user) => (
                    <div key={user.id} className="flex flex-row items-center space-x-3 py-2">
                       <Checkbox
                        id={`user-checkbox-${user.id}`}
                        checked={field.value?.includes(user.id)}
                        onCheckedChange={(checked) => {
                          const currentVal = field.value || [];
                          if (checked) {
                            field.onChange([...currentVal, user.id]);
                          } else {
                            field.onChange(currentVal.filter((id) => id !== user.id));
                          }
                        }}
                      />
                      <Label htmlFor={`user-checkbox-${user.id}`} className="font-normal cursor-pointer">
                        {user.name} <span className="text-xs text-muted-foreground">({user.email})</span>
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">Davet edilecek başka uygun kullanıcı bulunmuyor.</p>
                )}
              </ScrollArea>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Herkese Açık Liste</FormLabel>
                <p className="text-xs text-muted-foreground">
                  Aktif ise liste profilinizde herkese görünür olur.
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value === 'public'}
                  onCheckedChange={(checked) => field.onChange(checked ? 'public' : 'private')}
                  aria-label="Liste görünürlüğü"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            İptal
          </Button>
          <Button type="submit">{taskList ? "Listeyi Güncelle" : "Liste Oluştur"}</Button>
        </div>
      </form>
    </Form>
  );
}