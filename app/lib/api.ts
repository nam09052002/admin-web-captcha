const API_BASE_URL = 'http://157.66.24.128:8080';

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  username: string;
  is_admin: number;
}

export interface User {
  username: string;
  created_by: string;
  created_at: string;
  device_id: string;
  expired_at: string;
  is_admin: number;
  id: string;
}

export interface UsersResponse {
  success: boolean;
  count: number;
  users: User[];
}

export interface historyCaptchaModel {
  created_at: string;
  device_id: string;
  id: string;
  image_path: string;
  image_url: string;
  message: string;
  result: string;
  success: number;
  username: string;
}

export interface HistoryCaptchaResponse {
  success: boolean;
  count: number;
  historyCaptcha: historyCaptchaModel[];
}

export interface AddUserData {
  username: string;
  months: number;
  created_by?: string;
}

export interface UpdateUserData {
  id: string;
  created_by: string;
  device_id?: string | null;
  add_days: number;
}

export interface DeleteUserData {
  created_by: string;
  id: string;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin_login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data: LoginResponse = await response.json();

      if (data.success && data.token) {
        this.token = data.token;
        alert(`✅ ${data.message || 'Đăng nhập thành công!'}`);
      } else {
        alert(`${data.message || 'Sai tài khoản hoặc mật khẩu!'}`);
      }

      return data;
    } catch (error) {
      alert('Lỗi khi đăng nhập!');
      throw error;
    }
  }

  async getUsers(userName: string): Promise<UsersResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/get_data_users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName }),
      });

      const data: UsersResponse = await response.json();

      if (!data.success) {
        alert(`${'Không thể lấy danh sách người dùng!'}`);
      }

      return data;
    } catch (error) {
      alert('Lỗi khi lấy danh sách người dùng!');
      throw error;
    }
  }

  async addUser(userData: AddUserData): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/add_new_user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        alert(`✅ ${data.message || 'Thêm người dùng thành công!'}`);
      } else {
        alert(`${data.message || 'Thêm người dùng thất bại!'}`);
      }

      return data;
    } catch (error) {
      alert('Lỗi khi thêm người dùng!');
      throw error;
    }
  }

  async deleteUser(data: DeleteUserData): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/delete_user_by_id`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (resData.success) {
        alert(`✅ ${resData.message || 'Xóa người dùng thành công!'}`);
      } else {
        alert(`${resData.message || 'Xóa người dùng thất bại!'}`);
      }

      return resData;
    } catch (error) {
      alert('Lỗi khi xóa người dùng!');
      throw error;
    }
  }

  async updateUser(data: UpdateUserData): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/update_user_info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (resData.success) {
        alert(`✅ ${resData.message || 'Cập nhật thành công!'}`);
      } else {
        alert(`${resData.message || 'Cập nhật thất bại!'}`);
      }

      return resData;
    } catch (error) {
      alert('Lỗi khi cập nhật người dùng!');
      throw error;
    }
  }

  async getHistoryCaptcha(username: string): Promise<HistoryCaptchaResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/get_history_captcha`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (!data.success) {
        alert(`${'Không thể lấy danh sách lịch sử giải captcha!'}`);
      }

      return data;
    } catch (error) {
      alert('Lỗi khi lấy danh sách lịch sử giải captcha!');
      throw error;
    }
  }
}

export const apiService = new ApiService();