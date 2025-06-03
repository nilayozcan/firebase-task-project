"use client";

import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ThemeSettings() {
  const { theme, toggleTheme } = useAppContext();

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Tema Ayarları</CardTitle>
        <CardDescription>Uygulama temasını buradan değiştirebilirsiniz.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
          <div className="flex items-center space-x-2">
            {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            <Label htmlFor="theme-toggle" className="text-base">
              {theme === 'dark' ? 'Koyu Mod' : 'Açık Mod'}
            </Label>
          </div>
          <Switch
            id="theme-toggle"
            checked={theme === 'dark'}
            onCheckedChange={toggleTheme}
            aria-label="Tema değiştirici"
          />
        </div>
      </CardContent>
    </Card>
  );
}