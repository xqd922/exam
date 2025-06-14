import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Layout from './components/Layout';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ConfigProvider locale={zhCN}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            } />
          </Routes>
        </Router>
      </ConfigProvider>
    </AuthProvider>
  );
};

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default App;
