export interface User {
  username: string;
  created_by: string;
  created_at: string;
  device_id: string;
  expired_at: string;
  is_admin: number;
}

export interface AddUserData {
  username: string;
  durationType: string;
  created_by?: string;
}