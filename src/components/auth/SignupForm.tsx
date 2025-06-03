"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import Link from "next/link";

const signupFormSchema = z.object({
  name: z.string().min(2, { message: "İsim en az 2 karakter olmalı." }).max(50, { message: "İsim en fazla 50 karakter olabilir." }),
  email: z.string().email({ message: "Geçerli bir e-posta adresi girin." }),
  username: z.string().min(3, { message: "Kullanıcı adı en az 3 karakter olmalı." }).max(30, { message: "Kullanıcı adı en fazla 30 karakter olabilir." }).regex(/^[a-zA-Z0-9_]+$/, { message: "Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir."}),
  dateOfBirth: z.date({ required_error: "Doğum tarihi gerekli."}),
  password: z.string().min(6, { message: "Şifre en az 6 karakter olmalı." }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor.",
  path: ["confirmPassword"],
});

export type SignupFormValues = z.infer<typeof signupFormSchema>;

interface SignupFormProps {
  onSubmit: (values: SignupFormValues) => Promise<{ success: boolean; message: string; userId?: string }>;
  onSuccess?: (userId?: string) => void;
}

export function SignupForm({ onSubmit, onSuccess }: SignupFormProps) {
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleFormSubmit = async (values: SignupFormValues) => {
    const result = await onSubmit(values);
    if (result.success) {
      form.reset();
      if (onSuccess) onSuccess(result.userId);
    } else {
      form.setError("root", { type: "manual", message: result.message });
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Hesap Oluştur</CardTitle>
        <CardDescription>Yeni bir hesap oluşturmak için bilgilerinizi girin.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            {form.formState.errors.root && (
                <FormMessage>{form.formState.errors.root.message}</FormMessage>
            )}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>İsim Soyisim</FormLabel>
                  <FormControl>
                    <Input placeholder="Adınız Soyadınız" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-posta</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="eposta@adresiniz.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kullanıcı Adı</FormLabel>
                  <FormControl>
                    <Input placeholder="kullanici_adiniz" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Doğum Tarihi</FormLabel>
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
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        captionLayout="dropdown-buttons"
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Şifre</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Şifre Tekrar</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Kaydediliyor..." : "Kayıt Ol"}
            </Button>
          </form>
        </Form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Zaten bir hesabınız var mı?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Giriş Yapın
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}