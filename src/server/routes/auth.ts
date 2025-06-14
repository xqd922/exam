import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

router.post('/login', async (req: Request, res: Response) => {
  try {
    console.log('[认证] 收到登录请求:', { username: req.body.username });
    const { username, password } = req.body;
    
    const user = await User.findOne({ where: { username } });
    if (!user) {
      console.log('[认证] 用户不存在:', username);
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      console.log('[认证] 密码验证失败:', username);
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('[认证] 登录成功:', {
      username: user.username,
      role: user.role,
      id: user.id
    });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('[认证] 登录错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

export default router; 