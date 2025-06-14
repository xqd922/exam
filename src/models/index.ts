import sequelize from '../config/database.mjs';
import Teacher from './Teacher.js';
import Classroom from './Classroom.js';
import Exam from './Exam.js';

// 初始化所有模型
const models = {
    Teacher,
    Classroom,
    Exam,
};

// 同步数据库
async function initDatabase() {
    try {
        await sequelize.authenticate();
        console.log('数据库连接成功。');

        // 同步所有模型到数据库
        await sequelize.sync({ alter: true });
        console.log('数据库模型同步完成。');
    } catch (error) {
        console.error('数据库初始化失败:', error);
        process.exit(1);
    }
}

export { initDatabase };
export default models; 