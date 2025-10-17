'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Search,
  Plus,
  Trash2,
  Smartphone,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { User } from '@/app/types';
import { AddUserModal } from './AddUserModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { ExtendUserModal } from './ExtendUserModal';

interface UserTableProps {
  users: User[];
  searchTerm: string;
  loading: boolean;
  onSearchChange: (term: string) => void;
  onAddUser: (data: any) => Promise<void>;
  onDeleteUser: (username: string) => void;
  onDeleteDevice: (username: string) => void;
  onExtendUser: (username: string, months: number) => void;
  onUserActivity?: () => void;
}

export const UserTable = ({
  users,
  searchTerm,
  loading,
  onSearchChange,
  onAddUser,
  onDeleteUser,
  onDeleteDevice,
  onExtendUser,
  onUserActivity
}: UserTableProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<'deleteUser' | 'extend' | 'deleteDevice' | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };

  const handleAction = (action: () => void) => {
    action();
    onUserActivity?.();
  };

  const handleAddUser = async (userData: any) => {
    await onAddUser(userData);
    onUserActivity?.();
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setActionType('deleteUser');
    setIsDeleteModalOpen(true);
    onUserActivity?.();
  };

  const handleExtendClick = (user: User) => {
    setSelectedUser(user);
    setActionType('extend');
    setIsExtendModalOpen(true);
    onUserActivity?.();
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      handleAction(() => onDeleteUser(selectedUser.username));
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  const handleConfirmExtend = (months: number) => {
    if (selectedUser) {
      handleAction(() => onExtendUser(selectedUser.username, months));
      setIsExtendModalOpen(false);
      setSelectedUser(null);
    }
  };

  const kickDevice = (user: User) => {
    handleAction(() => onDeleteDevice(user.username));
  }

  return (
    <div className="py-6 space-y-6" onClick={onUserActivity}>
      {/* Header */}
      <Card className="bg-gradient-to-br from-background to-muted/20">
        {/* <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-2xl">Danh Sách Người Dùng</CardTitle>
            <Button 
              onClick={() => {
                setIsAddModalOpen(true);
                onUserActivity?.();
              }}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Thêm Người Dùng
            </Button>
          </div>
        </CardHeader> */}
        <CardContent className='flex flex-col sm:flex-row gap-4 sm:gap-0 sm:justify-between sm:items-center'>
          {/* Search Input */}
          <div className="relative w-full sm:w-96 order-2 sm:order-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Tìm kiếm theo tên người dùng..."
              value={searchTerm}
              onChange={(e) => {
                onSearchChange(e.target.value);
                onUserActivity?.();
              }}
              className="pl-10 w-full"
            />
          </div>

          {/* Add Button */}
          <Button
            onClick={() => {
              setIsAddModalOpen(true);
              onUserActivity?.();
            }}
            className="gap-2 w-full sm:w-auto order-1 sm:order-2"
          >
            <Plus className="w-4 h-4" />
            Thêm Người Dùng
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-y-auto max-h-[600px] relative">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[70px] text-center">STT</TableHead>
                  <TableHead className="w-[200px] ">Tên Người Dùng</TableHead>
                  <TableHead className="w-[180px] ">Thiết Bị</TableHead>
                  <TableHead className="w-[150px] ">Ngày Hết Hạn</TableHead>
                  <TableHead className="w-[160px] ">Thời Gian Còn Lại</TableHead>
                  <TableHead className="w-[150px] ">Ngày Tạo</TableHead>
                  <TableHead className="w-[300px] text-center">Hành Động</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {[...users]
                  .sort((a, b) => {
                    const today = new Date();
                    const diffA = Math.ceil(
                      (new Date(a.expired_at).getTime() - today.getTime()) / (1000 * 3600 * 24)
                    );
                    const diffB = Math.ceil(
                      (new Date(b.expired_at).getTime() - today.getTime()) / (1000 * 3600 * 24)
                    );
                    return diffB - diffA;
                  })
                  .map((user, index) => {
                    const today = new Date();
                    const expiry = new Date(user.expired_at);
                    const diffDays = Math.ceil(
                      (expiry.getTime() - today.getTime()) / (1000 * 3600 * 24)
                    );
                  return (
                    <TableRow key={user.username} className="hover:bg-muted/50">
                      <TableCell className="text-center font-medium">
                        {index + 1}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              diffDays <= 0 ? 'bg-red-500' : 'bg-green-500'
                            }`}
                          />
                          {user.username}
                        </div>
                      </TableCell>

                      <TableCell>
                        {user.device_id ? (
                          <Badge variant="secondary" className="gap-1">
                            <Smartphone className="w-3 h-3" />
                            {user.device_id}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            Không có thiết bị
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className={diffDays <= 0 ? 'text-destructive font-medium' : ''}>
                            {formatDate(user.expired_at)}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        {diffDays > 0 ? (
                          <Badge variant="outline" className="text-green-600 border-green-400">
                            Còn {diffDays} ngày
                          </Badge>
                        ) : (
                          <Badge variant="destructive">Hết hạn</Badge>
                        )}
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {user.created_at ? formatDate(user.created_at) : 'N/A'}
                      </TableCell>

                      <TableCell>
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              handleAction(() => kickDevice(user));
                            }}
                            className="gap-1 text-blue-600 border-blue-300 hover:bg-blue-100"
                          >
                            <Smartphone className="w-3 h-3" />
                            Xóa Thiết Bị
                          </Button>

                          <Button
                            size="sm"
                            onClick={() => handleExtendClick(user)}
                            className="gap-1"
                          >
                            <RefreshCw className="w-3 h-3" />
                            Gia Hạn
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(user)}
                            className="gap-1 text-destructive border-destructive/20 hover:bg-destructive/10"
                          >
                            <Trash2 className="w-3 h-3" />
                            Xóa User
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>


            {users.length === 0 && !loading && (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Không tìm thấy người dùng</p>
                <p className="text-sm">Thử thay đổi từ khóa tìm kiếm hoặc thêm người dùng mới</p>
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Đang tải dữ liệu...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AddUserModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAddUser={handleAddUser}
        onUserActivity={onUserActivity}
      />

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        user={selectedUser}
        onConfirm={handleConfirmDelete}
        onUserActivity={onUserActivity}
      />

      <ExtendUserModal
        open={isExtendModalOpen}
        onOpenChange={setIsExtendModalOpen}
        user={selectedUser}
        onConfirm={handleConfirmExtend}
        onUserActivity={onUserActivity}
      />
    </div>
  );
};