"use client";

import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { SignupForm, type SignupFormValues } from '@/components/auth/SignupForm';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

export default function SignupPage() {
  const router = useRouter();
  const { registerUser, loginUser } = useAppContext(); // Added loginUser
  const { toast } = useToast();

  const handleSignup = async (values: SignupFormValues) => {
    const result = await registerUser(values);
    if (result.success && result.userId) {
      // Attempt to log in the user automatically
      const loginResult = await loginUser({ identifier: values.username, password: values.password });
      if (loginResult.success) {
        toast({
          title: "Kayıt ve Giriş Başarılı",
          description: "Hoş geldiniz! Kontrol paneline yönlendiriliyorsunuz.",
        });
        router.push('/dashboard');
      } else {
        // This case should be rare if registration worked and verification is skipped.
        toast({
          title: "Kayıt Başarılı, Giriş Hatası",
          description: "Hesabınız oluşturuldu ancak otomatik giriş yapılamadı. Lütfen giriş sayfasından manuel olarak deneyin.",
          variant: "destructive", // Use destructive or a warning variant
        });
        router.push('/login'); // Redirect to login page so they can try manually
      }
    } else if (result.success && !result.userId) {
        // This case should ideally not happen if registration means a user is created
        toast({
          title: "Kayıt Başarılı, Kullanıcı ID Eksik",
          description: "Hesabınız oluşturuldu ancak bir sorun oluştu. Lütfen giriş yapmayı deneyin.",
          variant: "destructive",
        });
        router.push('/login');
    } else {
      // Registration failed (e.g., email/username exists)
      toast({
        title: "Kayıt Başarısız",
        description: result.message,
        variant: "destructive",
      });
    }
    return result; 
  };

  return (
    <AuthLayout pageTitle="A Kalender - Kayıt Ol">
      <SignupForm onSubmit={handleSignup} />
    </AuthLayout>
  );
}