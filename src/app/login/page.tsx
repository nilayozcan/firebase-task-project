"use client";

import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { LoginForm, type LoginFormValues } from '@/components/auth/LoginForm';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { loginUser, currentUser } = useAppContext();
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser) {
      router.replace('/dashboard');
    }
  }, [currentUser, router]);

  const handleLogin = async (values: LoginFormValues) => {
    const result = await loginUser(values);
    if (result.success) {
      toast({
        title: "Giriş Başarılı",
        description: result.message,
      });
      router.push('/dashboard'); // Redirect to dashboard or intended page
    } else {
      toast({
        title: "Giriş Başarısız",
        description: result.message,
        variant: "destructive",
      });
    }
    return result;
  };

  if (currentUser) {
    return null; // Or a loading indicator while redirecting
  }

  return (
    <AuthLayout pageTitle="A Kalender - Giriş Yap">
      <LoginForm onSubmit={handleLogin} onSuccess={() => router.push('/dashboard')} />
    </AuthLayout>
  );
}