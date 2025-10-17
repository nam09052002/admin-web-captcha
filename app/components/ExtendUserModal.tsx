'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User } from '@/app/types';
import { Calendar } from 'lucide-react';

interface ExtendUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onConfirm: (months: number) => void;
  onUserActivity?: () => void;
}

export const ExtendUserModal = ({
  open,
  onOpenChange,
  user,
  onConfirm,
  onUserActivity
}: ExtendUserModalProps) => {
  const [months, setMonths] = useState('1');

  const durationOptions = [
    { value: '0.1', label: '3 Ngày' },
    { value: '1', label: '1 Tháng' },
    { value: '3', label: '3 Tháng' },
    { value: '6', label: '6 Tháng' },
    { value: '12', label: '12 Tháng' }
  ];

  const handleSubmit = () => {
    onConfirm(parseInt(months, 0));
    setMonths('1');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" onClick={onUserActivity}>
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Gia Hạn Người Dùng
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600">
              Gia hạn cho người dùng <strong>{user?.username}</strong>
            </p>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="extendMonths">Thời gian gia hạn</Label>
            <Select value={months} onValueChange={setMonths}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn thời hạn" />
              </SelectTrigger>
              <SelectContent>
                {durationOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter className="flex gap-3 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setMonths('1');
            }}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="flex-1"
          >
            Gia Hạn
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};