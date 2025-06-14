import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { initDatabase } from '../models/index.js';
import authRoutes from './routes/auth.js';
import teacherRoutes from './routes/teachers.js';
import classroomRoutes from './routes/classrooms.js';
import examRoutes from './routes/exams.js';
import dashboardRoutes from './routes/dashboard.js';

const app = express();
const port = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 请求日志中间件
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('请求体:', req.body);
  next();
});

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 错误处理中间件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`[${new Date().toISOString()}] 错误:`, err);
  res.status(500).json({ message: '服务器错误', error: err.message });
});

// 初始化数据库并启动服务器
async function startServer() {
  try {
    console.log('正在连接数据库...');
    await initDatabase();
    console.log('数据库连接成功');
    
    // 创建默认管理员用户
    const { default: User } = await import('../models/User.js');
    console.log('正在检查管理员用户...');
    const adminExists = await User.findOne({ where: { username: 'root' } });
    
    if (!adminExists) {
      console.log('未找到管理员用户，正在创建...');
      const adminUser = await User.create({
        username: 'root',
        password: 'root',
        role: 'admin'
      });
      console.log('默认管理员用户创建成功:', adminUser.toJSON());
    } else {
      console.log('管理员用户已存在');
    }

    app.listen(port, () => {
      console.log('=================================');
      console.log(`服务器启动成功！`);
      console.log(`API 地址: http://localhost:${port}`);
      console.log(`默认管理员账号: root`);
      console.log(`默认管理员密码: root`);
      console.log('=================================');
    });
  } catch (error) {
    console.error('服务器启动失败:', error);
    process.exit(1);
  }
}

startServer(); 