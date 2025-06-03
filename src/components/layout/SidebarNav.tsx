"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, ListChecks, UserCircle, Settings } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/contexts/AppContext';

export function SidebarNav() {
  const pathname = usePathname();
  const { currentUser } = useAppContext();

  const navItems = [
    { href: '/dashboard', label: 'Takvim', icon: CalendarDays, requiresAuth: true },
    { href: '/tasks', label: 'Görev Listesi', icon: ListChecks, requiresAuth: true },
    ...(currentUser ? [{ href: `/profile/${currentUser.id}`, label: 'Profilim', icon: UserCircle, requiresAuth: true }] : []),
    { href: '/settings', label: 'Ayarlar', icon: Settings, requiresAuth: true },
  ];

  if (!currentUser) { // Don't render nav items if user is not logged in or still loading
    return null;
  }

  return (
    <SidebarMenu>
      {navItems.filter(item => !item.requiresAuth || currentUser).map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href || (item.href === '/dashboard' && pathname === '/')}
              tooltip={item.label}
              className={cn(
                (pathname === item.href || (item.href === '/dashboard' && pathname === '/'))
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <a>
                <item.icon className="h-5 w-5" />
                <span className="truncate">{item.label}</span>
              </a>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}