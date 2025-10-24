'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { authService } from '@/app/lib/auth';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HeaderProps {
  onLogout: () => void;
  remainingTime?: number;
  onChangeTab?: (tab: string) => void;
}

export const Header = ({ onLogout, remainingTime, onChangeTab }: HeaderProps) => {
  const session = authService.getSession();
  const [activeTab, setActiveTab] = useState('users');

  const handleLogoutClick = () => {
    authService.updateActivity();
    onLogout();
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    onChangeTab?.(tab);
  };

  return (
    <header
      className="border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm"
      onClick={authService.updateActivity}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="flex gap-2 bg-muted/40 border border-border rounded-xl shadow-sm px-2 py-1 backdrop-blur-sm">
            <TabsTrigger value="users" className="px-4 py-2 text-sm font-medium">
              👥 QUẢN LÝ NGƯỜI DÙNG
            </TabsTrigger>
            <TabsTrigger value="captcha" className="px-4 py-2 text-sm font-medium">
              🧩 LỊCH SỬ GIẢI CAPTCHA
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Xin chào, <strong className="text-foreground">{session?.username}</strong>
          </span>
          <Button
            variant="outline"
            onClick={handleLogoutClick}
            className="border-destructive/20 text-destructive hover:bg-destructive/10 transition-colors"
          >
            Đăng Xuất
          </Button>
        </div>
      </div>
    </header>
  );
};