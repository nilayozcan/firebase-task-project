"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyUser, allUsers } = useAppContext();
  const { toast } = useToast();
  
  const [userId, setUserId] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'verified' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const id = searchParams.get('userId');
    setUserId(id);
    if (!id) {
        setVerificationStatus('error');
        setMessage('Doğrulama için kullanıcı ID bulunamadı.');
    }
  }, [searchParams]);

  const handleVerify = () => {
    if (!userId) {
      toast({ title: "Hata", description: "Kullanıcı ID'si eksik.", variant: "destructive" });
      setVerificationStatus('error');
      setMessage('Kullanıcı ID eksik olduğu için doğrulama yapılamadı.');
      return;
    }

    const userExists = allUsers.some(u => u.id === userId);
    if (!userExists) {
        toast({ title: "Hata", description: "Böyle bir kullanıcı bulunamadı.", variant: "destructive" });
        setVerificationStatus('error');
        setMessage('Belirtilen ID ile bir kullanıcı bulunamadı.');
        return;
    }
    
    setVerificationStatus('verifying');
    // Simulate verification
    setTimeout(() => {
      try {
        verifyUser(userId);
        toast({ title: "Hesap Doğrulandı", description: "Hesabınız başarıyla doğrulandı. Şimdi giriş yapabilirsiniz." });
        setVerificationStatus('verified');
        setMessage('Hesabınız başarıyla doğrulandı! Artık giriş yapabilirsiniz.');
      } catch (error) {
        toast({ title: "Doğrulama Hatası", description: "Hesap doğrulanırken bir sorun oluştu.", variant: "destructive" });
        setVerificationStatus('error');
        setMessage('Hesap doğrulanırken bir sorun oluştu. Lütfen tekrar deneyin veya destek ile iletişime geçin.');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary/50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">E-posta Doğrulama</CardTitle>
          <CardDescription>
            {verificationStatus === 'idle' && userId && 'Hesabınızı doğrulamak için aşağıdaki butona tıklayın.'}
            {verificationStatus === 'verified' && 'Harika!'}
            {verificationStatus === 'error' && 'Bir sorun oluştu.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {verificationStatus === 'verified' && (
            <>
              <CheckCircle className="mx-auto h-16 w-16 text-status-completed mb-4" />
              <p className="text-lg font-medium">{message}</p>
              <Button asChild className="w-full">
                <Link href="/login">Giriş Yap</Link>
              </Button>
            </>
          )}
          {(verificationStatus === 'idle' && userId) && (
            <Button onClick={handleVerify} className="w-full">
              E-postamı Doğrula
            </Button>
          )}
           {verificationStatus === 'verifying' && (
             <p>Doğrulanıyor...</p>
           )}
          {verificationStatus === 'error' && (
            <>
              <AlertCircle className="mx-auto h-16 w-16 text-destructive mb-4" />
              <p className="text-lg font-medium text-destructive">{message}</p>
              <Button asChild className="w-full" variant="outline">
                <Link href="/signup">Tekrar Kayıt Ol</Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}