import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.mjs';
import Teacher from './Teacher.js';
import Classroom from './Classroom.js';

class Exam extends Model {
    public id!: number;
    public name!: string;
    public courseCode!: string;
    public examDate!: Date;
    public startTime!: string;
    public duration!: number;
    public studentCount!: number;
    public needComputer!: boolean;
    public status!: 'scheduled' | 'pending' | 'completed' | 'cancelled';
}

Exam.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    courseCode: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    examDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    duration: {
        type: DataTypes.INTEGER, // 考试时长（分钟）
        allowNull: false,
    },
    studentCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    needComputer: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    status: {
        type: DataTypes.ENUM('scheduled', 'pending', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
    }
}, {
    sequelize,
    tableName: 'exams',
});

// 建立关联关系
Exam.belongsTo(Teacher, { as: 'examiner', foreignKey: 'examinerId' });
Exam.belongsTo(Teacher, { as: 'invigilator', foreignKey: 'invigilatorId' });
Exam.belongsTo(Classroom, { foreignKey: 'classroomId' });

export default Exam; 