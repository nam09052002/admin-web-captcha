const SESSION_KEY = 'user_session';
const INACTIVITY_DURATION = 5 * 60 * 1000; // 5 phút không hoạt động

export interface SessionData {
  username: string;
  token: string;
  lastActivity: number; // Thời gian hoạt động cuối cùng
}

export const authService = {
  setSession: (username: string, token: string) => {
    const sessionData: SessionData = {
      username,
      token,
      lastActivity: Date.now() // Set thời gian hiện tại
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  },

  // Cập nhật thời gian hoạt động mỗi khi user tương tác
  updateActivity: () => {
    const session = authService.getSession();
    if (session) {
      session.lastActivity = Date.now();
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
  },

  getSession: (): SessionData | null => {
    if (typeof window === 'undefined') return null;
    
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (!sessionData) return null;

    const { username, token, lastActivity } = JSON.parse(sessionData);
    
    // Kiểm tra nếu không hoạt động quá 5 phút
    if (Date.now() - lastActivity > INACTIVITY_DURATION) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    return { username, token, lastActivity };
  },

  clearSession: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  isSessionValid: (): boolean => {
    return !!authService.getSession();
  },

  getRemainingTime: (): number => {
    const session = authService.getSession();
    if (!session) return 0;
    
    const elapsed = Date.now() - session.lastActivity;
    return Math.max(0, INACTIVITY_DURATION - elapsed);
  }
};