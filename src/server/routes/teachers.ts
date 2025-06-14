import { Router } from 'express';
import Teacher from '../../models/Teacher';

const router = Router();

// 获取所有教师
router.get('/', async (req, res) => {
  try {
    const teachers = await Teacher.findAll();
    res.json(teachers);
  } catch (error) {
    console.error('获取教师列表失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取单个教师
router.get('/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: '教师不存在' });
    }
    res.json(teacher);
  } catch (error) {
    console.error('获取教师信息失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 创建教师
router.post('/', async (req, res) => {
  try {
    const teacher = await Teacher.create(req.body);
    res.status(201).json(teacher);
  } catch (error) {
    console.error('创建教师失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新教师
router.put('/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: '教师不存在' });
    }
    await teacher.update(req.body);
    res.json(teacher);
  } catch (error) {
    console.error('更新教师失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 删除教师
router.delete('/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: '教师不存在' });
    }
    await teacher.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('删除教师失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router; 