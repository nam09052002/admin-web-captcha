'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AddUserData } from '@/app/types';
import { Users, Calendar } from 'lucide-react';

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddUser: (data: any) => Promise<void>;
  onUserActivity?: () => void; // Thêm prop này
}

export const AddUserModal = ({ open, onOpenChange, onAddUser, onUserActivity }: AddUserModalProps) => {
  const [formData, setFormData] = useState<AddUserData>({
    username: '',
    durationType: '1month'
  });
  const [loading, setLoading] = useState(false);

  const durationOptions = [
    { value: '3days', label: '3 Ngày' },
    { value: '1month', label: '1 Tháng' },
    { value: '3months', label: '3 Tháng' },
    { value: '6months', label: '6 Tháng' },
    { value: '12months', label: '12 Tháng' },
    { value: '9999months', label: 'Vĩnh viễn' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onAddUser(formData);
      setFormData({ username: '', durationType: '1month' });
      onOpenChange(false);
      onUserActivity?.(); // Update activity sau khi submit
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-2xl" onClick={onUserActivity}>
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Thêm Người Dùng Mới
          </DialogTitle>
          <p className="text-gray-600 text-sm">
            Thêm người dùng mới vào hệ thống
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="username" className="text-sm font-medium text-gray-700">
              Tên người dùng
            </Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              placeholder="Nhập tên người dùng"
              required
              className="py-2.5 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="durationType" className="text-sm font-medium text-gray-700">
              Thời hạn sử dụng
            </Label>
            <Select
              value={formData.durationType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, durationType: value }))}
            >
              <SelectTrigger className="py-2.5 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                <SelectValue placeholder="Chọn thời hạn" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-0 shadow-lg">
                {durationOptions.map(option => (
                  <SelectItem key={option.value} value={option.value} className="rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 py-2.5 rounded-xl border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang thêm...
                </div>
              ) : (
                'Thêm Người Dùng'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};