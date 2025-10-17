'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/app/components/Header';
import { UserTable } from '@/app/components/UserTable';
import { useUsers } from '@/app/hooks/use-users';
import { authService } from '@/app/lib/auth';
import { apiService } from '@/app/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const {
    users,
    searchTerm,
    setSearchTerm,
    loading,
    loadUsers,
    addUser,
    deleteUser,
    deleteDevice,
    extendUser
  } = useUsers();

  const updateUserActivity = () => {
    authService.updateActivity();
  };

  useEffect(() => {
    const session = authService.getSession();
    
    if (!session) {
      router.push('/login');
      return;
    }

    apiService.setToken(session.token);

    updateUserActivity();

    const events = ['click', 'keypress', 'scroll', 'mousemove'];
    const handleActivity = () => {
      updateUserActivity();
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    const updateRemainingTime = () => {
      const time = authService.getRemainingTime();
      setRemainingTime(time);
      
      if (time <= 0) {
        handleLogout();
      }
    };

    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 1000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      clearInterval(interval);
    };
  }, [router]);

  const handleLogout = () => {
    authService.clearSession();
    apiService.setToken('');
    router.push('/login');
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    loadUsers(term);
    updateUserActivity();
  };

  // Format thời gian còn lại
  const formatRemainingTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="min-h-screen bg-slate-50 flex flex-col" 
      onClick={updateUserActivity}
    >
      <Header onLogout={handleLogout} remainingTime={remainingTime} />
      <UserTable
        users={users}
        searchTerm={searchTerm}
        loading={loading}
        onSearchChange={handleSearch}
        onAddUser={addUser}
        onDeleteUser={deleteUser}
        onDeleteDevice={deleteDevice}
        onExtendUser={extendUser}
        onUserActivity={updateUserActivity}
        onReloadData={loadUsers}
      />
    </div>
  );
}