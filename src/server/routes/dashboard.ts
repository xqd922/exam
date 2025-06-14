import { Router } from 'express';
import { Op } from 'sequelize';
import Teacher from '../../models/Teacher';
import Classroom from '../../models/Classroom';
import Exam from '../../models/Exam';

const router = Router();

router.get('/stats', async (req, res) => {
  try {
    const teacherCount = await Teacher.count();
    const classroomCount = await Classroom.count();
    const examCount = await Exam.count();
    
    // 获取未来一周的考试数量
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    const upcomingExams = await Exam.count({
      where: {
        examDate: {
          [Op.between]: [
            today.toISOString().split('T')[0],
            nextWeek.toISOString().split('T')[0],
          ],
        },
        status: 'scheduled',
      },
    });

    res.json({
      teacherCount,
      classroomCount,
      examCount,
      upcomingExams,
    });
  } catch (error) {
    console.error('获取统计数据失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router; 