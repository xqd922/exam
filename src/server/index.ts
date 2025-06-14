import express from 'express';
import cors from 'cors';
import { initDatabase } from '../models/index.js';
import authRoutes from './routes/auth.js';
import teacherRoutes from './routes/teachers.js';
import classroomRoutes from './routes/classrooms.js';
import examRoutes from './routes/exams.js';
import dashboardRoutes from './routes/dashboard.js';

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 初始化数据库并启动服务器
async function startServer() {
  try {
    await initDatabase();
    app.listen(port, () => {
      console.log(`服务器运行在 http://localhost:${port}`);
    });
  } catch (error) {
    console.error('服务器启动失败:', error);
    process.exit(1);
  }
}

startServer(); 