"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/contexts/AppContext';

export default function HomePage() {
  const router = useRouter();
  const { currentUser, isLoading } = useAppContext(); // Assuming isLoading state from context

  useEffect(() => {
    if (isLoading) {
      // Optionally show a loading spinner or skeleton here
      return;
    }

    if (currentUser) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [currentUser, isLoading, router]);

  // Render nothing or a loading indicator while redirecting
  return (
     <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-primary animate-spin">
                <line x1="12" y1="2" x2="12" y2="6"></line>
                <line x1="12" y1="18" x2="12" y2="22"></line>
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                <line x1="2" y1="12" x2="6" y2="12"></line>
                <line x1="18" y1="12" x2="22" y2="12"></line>
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
            </svg>
            <p className="text-lg text-muted-foreground">Yönlendiriliyor...</p>
        </div>
      </div>
  );
}