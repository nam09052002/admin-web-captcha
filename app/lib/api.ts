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
}

export interface UsersResponse {
  success: boolean;
  count: number;
  users: User[];
}

export interface AddUserData {
  username: string;
  months: number;
  created_by?: string;
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
    }
    
    return data;
  }

  async getUsers(userName: string): Promise<UsersResponse> {
    const response = await fetch(`${API_BASE_URL}/get_data_users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userName }),
    });

    return response.json();
  }

  async addUser(userData: AddUserData): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/add_new_user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to add user');
    }

    return response.json();
  }

  async deleteUser(username: string): Promise<any> {

    const response = await fetch(`${API_BASE_URL}/delete_user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }

    return response.json();
  }

  async extendUser(username: string, months: number): Promise<any> {

    const response = await fetch(`${API_BASE_URL}/extend_user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, months }),
    });

    if (!response.ok) {
      throw new Error('Failed to extend user');
    }

    return response.json();
  }

  async deleteDevice(username: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/delete_device`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username }),
    });
    if (!response.ok) {
      throw new Error('Failed to delete device');
    }
    return response.json();
  }
}

export const apiService = new ApiService();