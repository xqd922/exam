import React, { useState } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  BookOutlined,
  ScheduleOutlined,
  HomeOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Dashboard from '../../pages/Dashboard';
import Teachers from '../../pages/Teachers';
import Classrooms from '../../pages/Classrooms';
import Exams from '../../pages/Exams';

const { Header, Sider, Content } = Layout;

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleMenuClick = (key: string) => {
    if (key === 'logout') {
      logout();
      navigate('/login');
    } else {
      navigate(key);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['/dashboard']}
          items={[
            {
              key: '/dashboard',
              icon: <HomeOutlined />,
              label: '首页',
              onClick: () => handleMenuClick('/dashboard'),
            },
            {
              key: '/teachers',
              icon: <UserOutlined />,
              label: '教师管理',
              onClick: () => handleMenuClick('/teachers'),
            },
            {
              key: '/classrooms',
              icon: <BookOutlined />,
              label: '教室管理',
              onClick: () => handleMenuClick('/classrooms'),
            },
            {
              key: '/exams',
              icon: <ScheduleOutlined />,
              label: '考试管理',
              onClick: () => handleMenuClick('/exams'),
            },
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: '退出登录',
              onClick: () => handleMenuClick('logout'),
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <span style={{ marginLeft: 16 }}>
            欢迎, {user?.username} ({user?.role === 'admin' ? '管理员' : '教师'})
          </span>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/classrooms" element={<Classrooms />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout; 