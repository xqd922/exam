import { Router } from 'express';
import Classroom from '../../models/Classroom';

const router = Router();

// 获取所有教室
router.get('/', async (req, res) => {
  try {
    const classrooms = await Classroom.findAll();
    res.json(classrooms);
  } catch (error) {
    console.error('获取教室列表失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取单个教室
router.get('/:id', async (req, res) => {
  try {
    const classroom = await Classroom.findByPk(req.params.id);
    if (!classroom) {
      return res.status(404).json({ message: '教室不存在' });
    }
    res.json(classroom);
  } catch (error) {
    console.error('获取教室信息失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 创建教室
router.post('/', async (req, res) => {
  try {
    const classroom = await Classroom.create(req.body);
    res.status(201).json(classroom);
  } catch (error) {
    console.error('创建教室失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新教室
router.put('/:id', async (req, res) => {
  try {
    const classroom = await Classroom.findByPk(req.params.id);
    if (!classroom) {
      return res.status(404).json({ message: '教室不存在' });
    }
    await classroom.update(req.body);
    res.json(classroom);
  } catch (error) {
    console.error('更新教室失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 删除教室
router.delete('/:id', async (req, res) => {
  try {
    const classroom = await Classroom.findByPk(req.params.id);
    if (!classroom) {
      return res.status(404).json({ message: '教室不存在' });
    }
    await classroom.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('删除教室失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router; 