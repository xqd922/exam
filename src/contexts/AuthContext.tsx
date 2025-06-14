import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  role: 'admin' | 'teacher';
  teacherId?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 检查本地存储中的用户信息
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      console.log('[认证] 从本地存储恢复用户会话');
      setUser(JSON.parse(storedUser));
    } else {
      console.log('[认证] 未找到存储的用户会话');
    }
  }, []);

  const login = async (username: string, password: string) => {
    console.log('[认证] 尝试登录:', { username });
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[认证] 登录失败:', errorData);
        throw new Error(errorData.message || '登录失败');
      }

      const data = await response.json();
      console.log('[认证] 登录成功:', { username: data.user.username, role: data.user.role });
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
    } catch (error) {
      console.error('[认证] 登录错误:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('[认证] 用户登出');
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 