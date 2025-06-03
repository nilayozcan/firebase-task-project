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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const loginFormSchema = z.object({
  identifier: z.string().min(1, { message: "Kullanıcı adı veya e-posta gerekli." }),
  password: z.string().min(1, { message: "Şifre gerekli." }),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<{ success: boolean; message: string }>;
  onSuccess?: () => void;
}

export function LoginForm({ onSubmit, onSuccess }: LoginFormProps) {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const handleFormSubmit = async (values: LoginFormValues) => {
    const result = await onSubmit(values);
    if (result.success) {
      form.reset();
      if (onSuccess) onSuccess();
    } else {
      form.setError("root", { type: "manual", message: result.message });
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Giriş Yap</CardTitle>
        <CardDescription>Hesabınıza erişmek için bilgilerinizi girin.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            {form.formState.errors.root && (
                <FormMessage>{form.formState.errors.root.message}</FormMessage>
            )}
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kullanıcı Adı veya E-posta</FormLabel>
                  <FormControl>
                    <Input placeholder="kullanici_adiniz veya eposta@adresiniz.com" {...field} />
                  </FormControl>
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
            <div className="text-right text-sm">
              <Link href="/forgot-password" passHref>
                <span className="font-medium text-primary hover:underline cursor-pointer">
                  Şifremi Unuttum?
                </span>
              </Link>
            </div>
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>
        </Form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Hesabınız yok mu?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Kayıt Olun
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}