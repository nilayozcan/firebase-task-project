"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/contexts/AppContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ListChecks, Users, UserPlus, UserMinus, Settings as SettingsIcon, UsersRound } from 'lucide-react'; // Renamed Settings to SettingsIcon

interface UserProfilePageClientProps {
  userId: string;
}

const getInitials = (name: string = '') => {
  return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '';
};

export function UserProfilePageClient({ userId }: UserProfilePageClientProps) {
  const { allUsers, currentUser, taskLists, followUser, unfollowUser, isLoading: isAppContextLoading } = useAppContext();
  const [isLoadingPageData, setIsLoadingPageData] = useState(true);

  const viewedUser = useMemo(() => {
    return allUsers.find(user => user.id === userId);
  }, [allUsers, userId]);

  const publicTaskLists = useMemo(() => {
    if (!viewedUser) return [];
    return taskLists.filter(list => list.ownerId === viewedUser.id && list.visibility === 'public');
  }, [taskLists, viewedUser]);

  useEffect(() => {
    if (!isAppContextLoading) {
      if (viewedUser || allUsers.length > 0) { // If viewedUser exists OR allUsers are loaded (even if viewedUser not found)
        setIsLoadingPageData(false);
      }
    }
  }, [viewedUser, allUsers, isAppContextLoading]);

  if (isAppContextLoading || isLoadingPageData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-8 w-24 mt-2" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-around text-center mb-4">
              <div>
                <Skeleton className="h-5 w-10 mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div>
                <Skeleton className="h-5 w-10 mb-1" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
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
      </Alert>
    );
  }
  
  const avatarSrc = viewedUser.avatarUrl || (viewedUser.username ? `https://picsum.photos/seed/${viewedUser.username}/128/128` : `https://picsum.photos/seed/defaultuser/128/128`);
  const isCurrentUserProfile = currentUser?.id === viewedUser.id;
  const isFollowing = currentUser ? currentUser.following.includes(viewedUser.id) : false;

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-4 md:p-0">
      <Card className="shadow-lg overflow-hidden">
        <CardHeader className="bg-card p-6 border-b">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Avatar className="h-24 w-24 text-3xl border-2 border-primary shadow-md">
              <AvatarImage src={avatarSrc} alt={viewedUser.name} data-ai-hint="large profile avatar" />
              <AvatarFallback>{getInitials(viewedUser.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <CardTitle className="text-3xl">{viewedUser.name}</CardTitle>
              <CardDescription className="text-md">@{viewedUser.username}</CardDescription>
              {currentUser && !isCurrentUserProfile && (
                <Button
                  onClick={() => isFollowing ? unfollowUser(viewedUser.id) : followUser(viewedUser.id)}
                  variant={isFollowing ? "outline" : "default"}
                  className="mt-3 w-full sm:w-auto"
                >
                  {isFollowing ? <UserMinus className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                  {isFollowing ? 'Takipten Çıkar' : 'Takip Et'}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4 text-center text-sm text-muted-foreground mb-6">
            <Link href={`/profile/${viewedUser.id}/followers`} passHref>
              <div className="p-3 rounded-md border hover:bg-secondary transition-colors cursor-pointer">
                <p className="text-2xl font-semibold text-foreground">{viewedUser.followers.length}</p>
                <p>Takipçi</p>
              </div>
            </Link>
            <Link href={`/profile/${viewedUser.id}/following`} passHref>
              <div className="p-3 rounded-md border hover:bg-secondary transition-colors cursor-pointer">
                <p className="text-2xl font-semibold text-foreground">{viewedUser.following.length}</p>
                <p>Takip Edilen</p>
              </div>
            </Link>
          </div>
          
          {isCurrentUserProfile && (
             <Link href="/settings" passHref>
                <Button variant="outline" className="w-full mb-6">
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Profili ve Ayarları Düzenle
                </Button>
            </Link>
          )}

          <Separator className="my-6" />

          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <ListChecks className="mr-2 h-5 w-5 text-primary" />
              Herkese Açık Görev Listeleri
            </h3>
            {publicTaskLists.length > 0 ? (
              <div className="space-y-3">
                {publicTaskLists.map(list => (
                  <Card key={list.id} className="hover:shadow-md transition-shadow">
                     <CardContent className="p-4 flex items-center space-x-3">
                        <span 
                            className="h-5 w-5 rounded-full shrink-0 border"
                            style={{ backgroundColor: list.color }}
                            aria-label={`${list.name} liste rengi`}
                        ></span>
                        <p className="font-medium">{list.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                {viewedUser.name} kullanıcısının herkese açık görev listesi bulunmuyor.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}