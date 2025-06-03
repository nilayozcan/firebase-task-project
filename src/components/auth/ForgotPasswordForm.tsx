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
import { Mail } from "lucide-react";

const forgotPasswordFormSchema = z.object({
  email: z.string().email({ message: "Geçerli bir e-posta adresi girin." }),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;

interface ForgotPasswordFormProps {
  onSubmit: (values: ForgotPasswordFormValues) => Promise<{ success: boolean; message: string }>;
}

export function ForgotPasswordForm({ onSubmit }: ForgotPasswordFormProps) {
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleFormSubmit = async (values: ForgotPasswordFormValues) => {
    const result = await onSubmit(values);
    if (result.success) {
      // Form can be reset or fields disabled upon successful submission
      // form.reset(); 
    } else {
      form.setError("root", { type: "manual", message: result.message });
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <Mail className="mx-auto h-12 w-12 text-primary mb-2" />
        <CardTitle className="text-2xl">Şifreni Sıfırla</CardTitle>
        <CardDescription>
          Şifreni sıfırlamak için kayıtlı e-posta adresini gir. Sana bir sıfırlama bağlantısı göndereceğiz.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            {form.formState.errors.root && (
                <FormMessage>{form.formState.errors.root.message}</FormMessage>
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-posta Adresi</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="eposta@adresiniz.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
            </Button>
          </form>
        </Form>
        <p className="mt-6 text-center text-sm">
          <Link href="/login" className="font-medium text-primary hover:underline">
            Giriş ekranına geri dön
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}