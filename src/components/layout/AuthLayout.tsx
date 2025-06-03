"use client";
import type { ReactNode } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import { Toaster } from '@/components/ui/toaster';

export function AuthLayout({ children, pageTitle }: { children: ReactNode, pageTitle: string }) {
  const { theme, toggleTheme } = useAppContext();

  return (
    <div className="min-h-screen flex flex-col bg-secondary/50">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 shadow-sm sm:px-6">
        <h1 className="text-xl font-semibold">{pageTitle}</h1>
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </header>
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}