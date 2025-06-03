"use client";

import { useMemo } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/contexts/AppContext';
import type { UserProfile } from '@/lib/types';
import { UserListItem } from '@/components/users/UserListItem';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, UserCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

interface UserListPageClientProps {
  userId: string;
  listType: 'followers' | 'following';
}

export function UserListPageClient({ userId, listType }: UserListPageClientProps) {
  const { allUsers, currentUser, followUser, unfollowUser, isLoading: isAppContextLoading } = useAppContext();

  const viewedUser = useMemo(() => {
    return allUsers.find(user => user.id === userId);
  }, [allUsers, userId]);

  const usersToList = useMemo(() => {
    if (!viewedUser) return [];
    const idsToList = listType === 'followers' ? viewedUser.followers : viewedUser.following;
    return idsToList.map(id => allUsers.find(user => user.id === id)).filter(Boolean) as UserProfile[];
  }, [viewedUser, listType, allUsers]);

  if (isAppContextLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-6 w-64 mb-6" />
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="p-4 flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-8 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!viewedUser) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Kullanıcı Bulunamadı</AlertTitle>
        <AlertDescription>
          Bu ID ile bir kullanıcı bulunamadı veya yüklenirken bir sorun oluştu.
        </AlertDescription>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/dashboard">Ana Sayfaya Dön</Link>
        </Button>
      </Alert>
    );
  }

  const title = listType === 'followers' 
    ? `${viewedUser.name} (@${viewedUser.username}) Kullanıcısının Takipçileri` 
    : `${viewedUser.name} (@${viewedUser.username}) Kullanıcısının Takip Ettikleri`;
  
  const Icon = listType === 'followers' ? Users : UserCheck;

  return (
    <div className="max-w-2xl mx-auto">
      <Button asChild variant="outline" size="sm" className="mb-6">
        <Link href={`/profile/${userId}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {viewedUser.name} Profiline Geri Dön
        </Link>
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3 mb-1">
            <Icon className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">{listType === 'followers' ? "Takipçiler" : "Takip Edilenler"}</CardTitle>
          </div>
          <CardDescription>{title}</CardDescription>
        </CardHeader>
        <CardContent>
          {usersToList.length > 0 ? (
            <ul className="space-y-3">
              {usersToList.map(user => (
                <UserListItem
                  key={user.id}
                  user={user}
                  currentUser={currentUser!} // currentUser should exist if we are here
                  onFollow={followUser}
                  onUnfollow={unfollowUser}
                />
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-center py-6">
              {listType === 'followers' 
                ? `${viewedUser.name} kullanıcısının henüz hiç takipçisi yok.`
                : `${viewedUser.name} henüz kimseyi takip etmiyor.`}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}