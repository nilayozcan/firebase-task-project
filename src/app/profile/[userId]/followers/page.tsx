"use client";

import { AppLayout } from '@/components/layout/AppLayout';
import { UserListPageClient } from '@/components/profile/UserListPageClient';
import { useAppContext } from '@/contexts/AppContext';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, use, useState } from 'react'; 

export default function FollowersPage({ params: paramsInput }: { params: { userId: string } }) {
  const { currentUser, isLoading: isAppLoading, allUsers } = useAppContext();
  const router = useRouter();
  const [pageSpecificLoading, setPageSpecificLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const resolvedParams = use(paramsInput as any); 

  useEffect(() => {
    const idFromParams = resolvedParams?.userId;
    if (idFromParams) {
      setCurrentUserId(idFromParams);
    } else if (!isAppLoading && resolvedParams && !resolvedParams.userId) {
      // userId is confirmed missing from resolved params and app is not loading
    }
  }, [resolvedParams, isAppLoading]); 

  const viewedUser = useMemo(() => {
    if (!currentUserId) return null;
    return allUsers.find(user => user.id === currentUserId);
  }, [allUsers, currentUserId]);

  useEffect(() => {
    if (isAppLoading) {
      setPageSpecificLoading(true);
      return;
    }
  
    if (!currentUser) {
      router.replace('/login');
      return;
    }
  
    // currentUser exists and app is not loading
    if (currentUserId) { 
      setPageSpecificLoading(false);
    } else if (resolvedParams && !resolvedParams.userId) { 
      setPageSpecificLoading(false); 
    }
  }, [currentUser, isAppLoading, router, currentUserId, resolvedParams]);

  if (isAppLoading || pageSpecificLoading || !currentUser) {
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
            <p className="text-lg text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }
  
  if (!currentUserId) {
    return (
        <AppLayout pageTitle="Hata">
            <div className="text-center text-destructive">Kullanıcı ID bulunamadı. Lütfen tekrar deneyin.</div>
        </AppLayout>
    );
  }

  const pageTitle = viewedUser ? `${viewedUser.name} Kullanıcısının Takipçileri` : "Takipçiler";

  return (
    <AppLayout pageTitle={pageTitle}>
      <UserListPageClient userId={currentUserId} listType="followers" />
    </AppLayout>
  );
}