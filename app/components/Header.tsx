'use client';

import { Button } from '@/components/ui/button';
import { authService } from '@/app/lib/auth';

interface HeaderProps {
  onLogout: () => void;
  remainingTime?: number;
}

export const Header = ({ onLogout, remainingTime }: HeaderProps) => {
  const session = authService.getSession();

  const handleLogoutClick = () => {
    authService.updateActivity(); // Cập nhật activity trước khi logout
    onLogout();
  };

  return (
    <header 
      className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      onClick={authService.updateActivity}
    >
      <div className="flex h-16 items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Quản Lý Người Dùng
        </h1>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Xin chào, <strong className="text-foreground">{session?.username}</strong>
          </span>
          <Button 
            variant="outline" 
            onClick={handleLogoutClick}
            className="border-destructive/20 text-destructive hover:bg-destructive/10"
          >
            Đăng Xuất
          </Button>
        </div>
      </div>
    </header>
  );
};