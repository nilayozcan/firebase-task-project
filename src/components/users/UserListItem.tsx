"use client";

import Link from 'next/link';
import type { UserProfile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface UserListItemProps {
  user: UserProfile;
  currentUser: UserProfile;
  onFollow: (targetUserId: string) => void;
  onUnfollow: (targetUserId: string) => void;
}

export function UserListItem({ user, currentUser, onFollow, onUnfollow }: UserListItemProps) {
  const isFollowing = currentUser.following.includes(user.id);

  const getInitials = (name: string = '') => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  const avatarSrc = user.avatarUrl || `https://picsum.photos/seed/${user.email}/40/40`;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex items-center justify-between space-x-4">
        <Link href={`/profile/${user.id}`} className="flex items-center space-x-3 group flex-1 min-w-0">
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatarSrc} alt={user.name} data-ai-hint="user avatar" />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            