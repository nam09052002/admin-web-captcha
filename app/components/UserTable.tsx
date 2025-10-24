'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Search,
  Plus,
  Trash2,
  Smartphone,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { AddUserModal } from './AddUserModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { ExtendUserModal } from './ExtendUserModal';
import { apiService, DeleteUserData, historyCaptchaModel, UpdateUserData, User } from '../lib/api';
import { authService } from '../lib/auth';

interface UserTableProps {
  activeTab: 'users' | 'captcha';
  users: User[];
  searchTerm: string;
  loading: boolean;
  onSearchChange: (term: string) => void;
  onAddUser: (data: any) => Promise<void>;
  onDeleteUser: (data: DeleteUserData) => void;
  onDeleteDevice: (data: UpdateUserData) => void;
  onExtendUser: (data: UpdateUserData) => void;
  onUserActivity?: () => void;
  onReloadData?: () => void;
}

export const UserTable = ({
  activeTab,
  users,
  searchTerm,
  loading,
  onSearchChange,
  onAddUser,
  onDeleteUser,
  onDeleteDevice,
  onExtendUser,
  onUserActivity,
  onReloadData,
}: UserTableProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [captchaHistory, setCaptchaHistory] = useState<historyCaptchaModel[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [searchCaptcha, setSearchCaptcha] = useState('');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatDateCaptcha = (dateString: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }

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
    setIsDeleteModalOpen(true);
  };

  const handleExtendClick = (user: User) => {
    setSelectedUser(user);
    setIsExtendModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      handleAction(() =>
        onDeleteUser({
          created_by: selectedUser.created_by,
          id: selectedUser.id,
        })
      );
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  const handleConfirmExtend = (months: number) => {
    if (selectedUser) {
      const monthsMap: { [key: string]: number } = {
        '0': 0,
        '0.1': 3,
        '1': 31,
        '3': 91,
        '6': 181,
        '12': 366,
        '9999': 300000,
      };
      handleAction(() =>
        onExtendUser({
          id: selectedUser.id,
          created_by: selectedUser.created_by,
          device_id: selectedUser.device_id,
          add_days: monthsMap[months.toString()] || 0,
        })
      );
      setIsExtendModalOpen(false);
      setSelectedUser(null);
    }
  };

  const kickDevice = (user: User) => {
    handleAction(() =>
      onDeleteDevice({
        id: user.id,
        created_by: user.created_by,
        device_id: null,
        add_days: 0,
      })
    );
  };

  useEffect(() => {
    const fetchHistory = async () => {
      if (activeTab !== 'captcha') return;

      const session = authService.getSession();
      if (!session) {
        throw new Error('Session expired');
      }

      try {
        setLoadingHistory(true);
        const data = await apiService.getHistoryCaptcha(session.username);

        if (data.success && Array.isArray(data.historyCaptcha)) {
          setCaptchaHistory(data.historyCaptcha);
        } else {
          setCaptchaHistory([]);
        }
      } catch (error) {
        setCaptchaHistory([]);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [activeTab]);

  const filteredCaptchaHistory = captchaHistory.filter((item) =>
    (item.username || '').toLowerCase().includes(searchCaptcha.toLowerCase())
  );

  if (activeTab === 'users') {
    return (
      <div className="py-6 space-y-6" onClick={onUserActivity}>
        {/* Header */}
        <Card className="bg-gradient-to-br from-background to-muted/20">
          <CardContent className="flex flex-col sm:flex-row gap-4 sm:gap-0 sm:justify-between sm:items-center">
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

            {/* Action Buttons */}
            <div className="flex gap-2 w-full sm:w-auto order-1 sm:order-2">
              <Button
                variant="outline"
                onClick={() => {
                  onReloadData?.();
                  onUserActivity?.();
                }}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Tải lại
              </Button>

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
          </CardContent>
        </Card>

        {/* Table Section */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto border-b">
              <Table className="w-full table-fixed">
                <TableHeader className="sticky top-0 z-10 bg-background shadow-sm">
                  <TableRow>
                    <TableHead className="w-[60px] text-center">STT</TableHead>
                    <TableHead className="w-[150px] text-left">Tên Người Dùng</TableHead>
                    <TableHead className="w-[220px] text-left">Thiết Bị</TableHead>
                    <TableHead className="w-[150px] text-left">Ngày Hết Hạn</TableHead>
                    <TableHead className="w-[160px] text-left">Thời Gian Còn Lại</TableHead>
                    <TableHead className="w-[150px] text-left">Ngày Tạo</TableHead>
                    <TableHead className="w-[300px] text-center">Hành Động</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>

            <div className="max-h-[600px] overflow-y-auto" style={{ scrollbarGutter: 'stable' }}>
              <Table className="w-full table-fixed">
                <TableBody>
                  {users.length ? (
                    users
                      .sort(
                        (a, b) => new Date(b.expired_at).getTime() - new Date(a.expired_at).getTime()
                      )
                      .map((user, index) => {
                        const today = new Date();
                        const expiry = new Date(user.expired_at);
                        const diffDays = Math.ceil(
                          (expiry.getTime() - today.getTime()) / (1000 * 3600 * 24)
                        );

                        return (
                          <TableRow
                            key={user.username}
                            className="hover:bg-muted/50 transition-colors text-center"
                          >
                            <TableCell className="w-[60px] font-medium">{index + 1}</TableCell>
                            <TableCell className="w-[150px] text-left">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    diffDays <= 0 ? 'bg-red-500' : 'bg-green-500'
                                  }`}
                                />
                                {user.username}
                              </div>
                            </TableCell>
                            <TableCell className="w-[220px] text-left">
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
                            <TableCell className="w-[150px] text-left">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span
                                  className={
                                diffDays <= 0
                                  ? 'text-destructive font-medium'
                                  : ''
                                  }
                                >
                                  {formatDate(user.expired_at)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="w-[160px] text-left">
                              {diffDays > 0 ? (
                                <Badge
                                  variant="outline"
                                  className="text-green-600 border-green-400"
                                >
                                  Còn {diffDays} ngày
                                </Badge>
                              ) : (
                                <Badge variant="destructive">Hết hạn</Badge>
                              )}
                            </TableCell>
                            <TableCell className="w-[150px] text-left text-muted-foreground">
                              {user.created_at ? formatDate(user.created_at) : 'N/A'}
                            </TableCell>
                            <TableCell className="w-[300px] text-center">
                              <div className="flex justify-center gap-2 flex-wrap">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => handleAction(() => kickDevice(user))}
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
                      })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-24 text-center text-muted-foreground"
                      >
                      {loading
                        ? 'Đang tải dữ liệu...'
                        : 'Không tìm thấy người dùng'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Modals */}
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
  }

  return (
    <div className="py-6 space-y-6" onClick={onUserActivity}>
      <Card className="bg-gradient-to-br from-background to-muted/20">
        <CardContent className="flex flex-col sm:flex-row gap-4 sm:gap-0 sm:justify-between sm:items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Tìm kiếm theo người dùng..."
              value={searchCaptcha}
              onChange={(e) => setSearchCaptcha(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto border-b">
            <div className="max-h-[600px] overflow-y-auto" style={{ scrollbarGutter: "stable" }}>
              <Table className="w-full table-fixed">
                <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                  <TableRow>
                    <TableHead className="w-[60px] text-center">STT</TableHead>
                    <TableHead className="w-[120px]">Ảnh</TableHead>
                    <TableHead className="w-[160px]">Người dùng</TableHead>
                    <TableHead className="w-[280px]">Thiết bị</TableHead>
                    <TableHead className="w-[120px]">Trạng thái</TableHead>
                    <TableHead className="w-[280px]">Nội dung</TableHead>
                    <TableHead className="w-[120px] text-center">Kết quả</TableHead>
                    <TableHead className="w-[200px] text-center">Thời gian</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loadingHistory ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                        Đang tải lịch sử...
                      </TableCell>
                    </TableRow>
                  ) : filteredCaptchaHistory.length > 0 ? (
                    filteredCaptchaHistory.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-center">{index + 1}</TableCell>
                        <TableCell className="text-center">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt="Captcha"
                              className="object-cover rounded-md border"
                              style={{ width: "180px", height: "100px" }}
                            />
                          ) : (
                            <span className="text-muted-foreground">Không có</span>
                          )}
                        </TableCell>
                        <TableCell>{item.username}</TableCell>
                        <TableCell className="truncate max-w-[200px]" title={item.device_id}>
                          {item.device_id || <span className="text-muted-foreground">-</span>}
                        </TableCell>
                        <TableCell className="w-[120px]">
                          {item.success === 1 ? (
                            <span className="text-green-600 font-semibold">Thành công</span>
                          ) : (
                            <span className="text-red-500 font-semibold">Thất bại</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {item.message || (
                            <span className="text-muted-foreground">Không có nội dung</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.result ?? <span className="text-muted-foreground">-</span>}
                        </TableCell>
                        <TableCell className="text-center">{item.created_at}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center text-muted-foreground h-24"
                      >
                        Không có dữ liệu
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
