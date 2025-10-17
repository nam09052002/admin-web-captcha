'use client';

import { useState, useEffect } from 'react';
import { User, AddUserData } from '@/app/types';
import { apiService, DeleteUserData, UpdateUserData } from '@/app/lib/api';
import { authService } from '@/app/lib/auth';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (search = '') => {
    setLoading(true);
    setError('');
    
    try {
      const session = authService.getSession();
      if (!session) {
        throw new Error('Session expired');
      }

      const response = await apiService.getUsers(session.username);
      
      if (response.success) {
        let filteredUsers = response.users;
        
        if (search) {
          filteredUsers = response.users.filter(user => 
            user.username.toLowerCase().includes(search.toLowerCase())
          );
        }
        
        setUsers(filteredUsers);
      } else {
        setError('Failed to load users');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (userData: AddUserData) => {
    setLoading(true);
    setError('');
    
    try {
      const session = authService.getSession();
      if (!session) {
        throw new Error('Session expired');
      }

      const monthsMap: { [key: string]: number } = {
        '3days': 3,
        '1month': 31,
        '3months': 91,
        '6months': 181,
        '12months': 366
      };

      const dataToSend = {
        username: userData.username,
        months: monthsMap[userData.durationType] || 1,
        created_by: session.username
      };

      const response = await apiService.addUser(dataToSend);
      
      if (response.success) {
        await loadUsers(searchTerm);
        return response;
      } else {
        throw new Error(response.message || 'Failed to add user');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add user');
      console.error('Error adding user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (data: DeleteUserData) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await apiService.deleteUser(data);
      
      if (response.success) {
        await loadUsers(searchTerm);
        return response;
      } else {
        throw new Error(response.message || 'Failed to delete user');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      console.error('Error deleting user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDevice  = async (data: UpdateUserData) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await apiService.updateUser(data);
      
      if (response.success) {
        await loadUsers(searchTerm);
        return response;
      } else {
        throw new Error(response.message || 'Failed to delete user');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      console.error('Error deleting user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const extendUser = async (data: UpdateUserData) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await apiService.updateUser(data);
      
      if (response.success) {
        await loadUsers(searchTerm);
        return response;
      } else {
        throw new Error(response.message || 'Failed to extend user');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extend user');
      console.error('Error extending user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    searchTerm,
    setSearchTerm,
    loading,
    error,
    loadUsers,
    addUser,
    deleteUser,
    extendUser,
    deleteDevice
  };
};