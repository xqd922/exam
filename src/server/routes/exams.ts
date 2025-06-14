import { Router } from 'express';
import { Op } from 'sequelize';
import Exam from '../../models/Exam';
import Teacher from '../../models/Teacher';
import Classroom from '../../models/Classroom';

const router = Router();

// 获取所有考试
router.get('/', async (req, res) => {
  try {
    const exams = await Exam.findAll({
      include: [
        { model: Teacher, as: 'examiner' },
        { model: Teacher, as: 'invigilator' },
        { model: Classroom },
      ],
    });
    res.json(exams);
  } catch (error) {
    console.error('获取考试列表失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取单个考试
router.get('/:id', async (req, res) => {
  try {
    const exam = await Exam.findByPk(req.params.id, {
      include: [
        { model: Teacher, as: 'examiner' },
        { model: Teacher, as: 'invigilator' },
        { model: Classroom },
      ],
    });
    if (!exam) {
      return res.status(404).json({ message: '考试不存在' });
    }
    res.json(exam);
  } catch (error) {
    console.error('获取考试信息失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 创建考试
router.post('/', async (req, res) => {
  try {
    // 检查时间冲突
    const { examDate, startTime, duration, classroomId, examinerId, invigilatorId } = req.body;
    const examEndTime = new Date(`${examDate} ${startTime}`);
    examEndTime.setMinutes(examEndTime.getMinutes() + duration);

    const conflictingExam = await Exam.findOne({
      where: {
        examDate,
        [Op.or]: [
          {
            [Op.and]: [
              { startTime: { [Op.lte]: startTime } },
              {
                startTime: {
                  [Op.gte]: examEndTime.toLocaleTimeString('en-US', { hour12: false }),
                },
              },
            ],
          },
          {
            [Op.or]: [
              { classroomId },
              { examinerId },
              { invigilatorId },
            ],
          },
        ],
      },
    });

    if (conflictingExam) {
      return res.status(400).json({ message: '存在时间或资源冲突' });
    }

    const exam = await Exam.create(req.body);
    const examWithRelations = await Exam.findByPk(exam.id, {
      include: [
        { model: Teacher, as: 'examiner' },
        { model: Teacher, as: 'invigilator' },
        { model: Classroom },
      ],
    });
    res.status(201).json(examWithRelations);
  } catch (error) {
    console.error('创建考试失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新考试
router.put('/:id', async (req, res) => {
  try {
    const exam = await Exam.findByPk(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: '考试不存在' });
    }

    // 检查时间冲突（排除当前考试）
    const { examDate, startTime, duration, classroomId, examinerId, invigilatorId } = req.body;
    const examEndTime = new Date(`${examDate} ${startTime}`);
    examEndTime.setMinutes(examEndTime.getMinutes() + duration);

    const conflictingExam = await Exam.findOne({
      where: {
        id: { [Op.ne]: req.params.id },
        examDate,
        [Op.or]: [
          {
            [Op.and]: [
              { startTime: { [Op.lte]: startTime } },
              {
                startTime: {
                  [Op.gte]: examEndTime.toLocaleTimeString('en-US', { hour12: false }),
                },
              },
            ],
          },
          {
            [Op.or]: [
              { classroomId },
              { examinerId },
              { invigilatorId },
            ],
          },
        ],
      },
    });

    if (conflictingExam) {
      return res.status(400).json({ message: '存在时间或资源冲突' });
    }

    await exam.update(req.body);
    const updatedExam = await Exam.findByPk(exam.id, {
      include: [
        { model: Teacher, as: 'examiner' },
        { model: Teacher, as: 'invigilator' },
        { model: Classroom },
      ],
    });
    res.json(updatedExam);
  } catch (error) {
    console.error('更新考试失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 删除考试
router.delete('/:id', async (req, res) => {
  try {
    const exam = await Exam.findByPk(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: '考试不存在' });
    }
    await exam.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('删除考试失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router; 