"use client";

import { useState, useMemo, useEffect } from 'react'; // Added useEffect
import { useSearchParams } from 'next/navigation'; // Added useSearchParams
import { ProfileForm, type ProfileFormValues } from '@/components/settings/ProfileForm';
import { ThemeSettings } from '@/components/settings/ThemeSettings';
import { TaskListSettings } from '@/components/settings/TaskListSettings';
import { UserListItem } from '@/components/users/UserListItem';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Search, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function SettingsPageClient() {
  const { 
    currentUser, 
    allUsers, 
    updateUserProfile, 
    followUser, 
    unfollowUser,
    taskLists,
    updateTaskListVisibility,
    isLoading: isAppContextLoading,
  } = useAppContext();
  const { toast } = useToast();
  const searchParams = useSearchParams(); // Initialized useSearchParams
  
  // Initialize searchTerm from URL query parameter 'q' or fallback to empty string
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('q') || "");

  // Effect to update searchTerm if the 'q' query parameter changes after initial load
  useEffect(() => {
    const query = searchParams.get('q');
    // Sync searchTerm with the query parameter. If query is null, searchTerm becomes empty.
    setSearchTerm(query || ""); 
  }, [searchParams]);


  const handleProfileUpdate = (values: ProfileFormValues) => {
    if (!currentUser) return;
    updateUserProfile(values); 
    toast({
      title: "Profil Güncellendi",
      description: "Profil bilgileriniz başarıyla kaydedildi.",
    });
  };

  const handleTaskListVisibilityUpdate = (listId: string, newVisibility: 'public' | 'private') => {
    updateTaskListVisibility(listId, newVisibility);
    toast({
      title: "Liste Görünürlüğü Güncellendi",
      description: `Liste şimdi ${newVisibility === 'public' ? 'herkese açık' : 'özel'}.`,
    });
  };

  const otherUsers = useMemo(() => {
    if (!currentUser) return [];
    return allUsers.filter(user => {
      if (user.id === currentUser.id) return false;
      if (!searchTerm) return true; // If searchTerm is empty, show all other users
      const term = searchTerm.toLowerCase();
      return user.name.toLowerCase().includes(term) || 
             (user.username && user.username.toLowerCase().includes(term)) || // Check username if exists
             user.email.toLowerCase().includes(term);
    });
  }, [allUsers, currentUser, searchTerm]);

  const currentUserOwnedTaskLists = useMemo(() => {
    if (!currentUser) return [];
    return taskLists.filter(list => list.ownerId === currentUser.id);
  }, [taskLists, currentUser]);

  if (isAppContextLoading) {
    return <div className="max-w-2xl mx-auto space-y-8"><p>Ayarlar yükleniyor...</p></div>; // Or a skeleton loader
  }

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erişim Reddedildi</AlertTitle>
          <AlertDescription>
            Ayarlar sayfasını görüntülemek için lütfen giriş yapın.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <ProfileForm profile={currentUser} onSubmit={handleProfileUpdate} />
      
      <TaskListSettings 
        userOwnedTaskLists={currentUserOwnedTaskLists}
        onUpdateVisibility={handleTaskListVisibilityUpdate}
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Sosyal</CardTitle>
          <CardDescription>Diğer kullanıcıları bulun, takipçi ve takip edilenleri yönetin.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-around text-sm">
            <div><span className="font-semibold">{currentUser.followers.length}</span> Takipçi</div>
            <div><span className="font-semibold">{currentUser.following.length}</span> Takip Edilen</div>
          </div>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-2">Diğer Kullanıcıları Bul</h3>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="İsim, kullanıcı adı veya e-posta ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
                aria-label="Kullanıcı arama"
              />
            </div>
            {otherUsers.length > 0 ? (
              <ul className="space-y-3 max-h-96 overflow-y-auto">
                {otherUsers.map(user => (
                  <UserListItem
                    key={user.id}
                    user={user}
                    currentUser={currentUser}
                    onFollow={followUser}
                    onUnfollow={unfollowUser}
                  />
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-4">
                {searchTerm ? "Aramanızla eşleşen kullanıcı bulunamadı." : "Takip edilecek başka kullanıcı bulunamadı."}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      
      <ThemeSettings />
    </div>
  );
}