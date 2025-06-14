import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      console.log('[登录页面] 尝试登录:', { username: values.username });
      await login(values.username, values.password);
      console.log('[登录页面] 登录成功，准备跳转');
      message.success('登录成功');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('[登录页面] 登录失败:', error);
      // 显示具体的错误信息
      message.error(error.message || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f0f2f5'
    }}>
      <Card title="考试排程系统" style={{ width: 400 }}>
        <Spin spinning={loading}>
          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名!' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="用户名"
                size="large"
                disabled={loading}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
                size="large"
                disabled={loading}
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                size="large"
                loading={loading}
              >
                {loading ? '登录中...' : '登录'}
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center', color: '#666' }}>
              默认管理员账号: root<br/>
              默认管理员密码: root
            </div>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default Login; 