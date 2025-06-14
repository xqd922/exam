import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.mjs';

class Teacher extends Model {
    public id!: number;
    public name!: string;
    public employeeId!: string;
    public department!: string;
    public email?: string;
    public phone?: string;
}

Teacher.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    employeeId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
    },
    department: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
    }
}, {
    sequelize,
    tableName: 'teachers',
});

export default Teacher; 