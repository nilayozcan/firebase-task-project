"use client";

import { useState } from 'react'; // Added useState
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Sun, Moon, LogOut, Settings, Search, UserCircle2, UserPlus, LogIn } from "lucide-react"; // Changed UserCircle to UserCircle2
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { useAppContext } from "@/contexts/AppContext";
import { useRouter } from "next/navigation"; // Added useRouter
import { NotificationBell } from "@/components/notifications/NotificationBell";

export function Header({ pageTitle }: { pageTitle: string }) {
  const { theme, toggleTheme, currentUser, logoutUser } = useAppContext();
  const router = useRouter(); // Initialized useRouter
  const [headerSearchTerm, setHeaderSearchTerm] = useState(''); // Added state for header search

  const getInitials = (name: string = '') => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };

  const handleHeaderSearch = () => {
    if (headerSearchTerm.trim()) {
      router.push(`/settings?q=${encodeURIComponent(headerSearchTerm.trim())}`);
    }
  };

  const avatarSrc = currentUser?.avatarUrl || (currentUser?.username ? `https://picsum.photos/seed/${currentUser.username}/40/40` : `https://picsum.photos/seed/defaultuser/40/40`);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 shadow-sm sm:px-6">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-xl font-semibold truncate max-w-[150px] xs:max-w-[200px] sm:max-w-xs md:max-w-sm lg:max-w-md">{pageTitle}</h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-3">
        {currentUser && (
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Kullanıcı Ara..."
              value={headerSearchTerm}
              onChange={(e) => setHeaderSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleHeaderSearch();
                }
              }}
              className="pl-10 pr-3 py-2 h-9 w-40 sm:w-48 md:w-56 lg:w-64 rounded-md border bg-background focus:border-primary"
              aria-label="Kullanıcı arama"
            />
          </div>
        )}

        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
        
        {currentUser && <NotificationBell />}

        {currentUser ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={avatarSrc} alt={currentUser.name || "User Avatar"} data-ai-hint="profile avatar"/>
                  <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    @{currentUser.username}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/profile/${currentUser.id}`}>
                  <UserCircle2 className="mr-2 h-4 w-4" />
                  <span>Profilim</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Ayarlar</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Çıkış Yap</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Giriş Yap
              </Link>
            </Button>
            <Button asChild>
              <Link href="/signup">
                <UserPlus className="mr-2 h-4 w-4" />
                Kayıt Ol
              </Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}