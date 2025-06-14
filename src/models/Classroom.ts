import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Classroom extends Model {
    public id!: number;
    public name!: string;
    public building!: string;
    public floor!: number;
    public capacity!: number;
    public hasComputers!: boolean;
    public status!: 'available' | 'maintenance' | 'reserved';
}

Classroom.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    building: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    floor: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    hasComputers: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    status: {
        type: DataTypes.ENUM('available', 'maintenance', 'reserved'),
        allowNull: false,
        defaultValue: 'available',
    }
}, {
    sequelize,
    tableName: 'classrooms',
});

export default Classroom; 