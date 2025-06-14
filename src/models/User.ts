import { Sequelize, Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database.mjs';
import bcrypt from 'bcryptjs';

interface UserAttributes {
    id: number;
    username: string;
    password: string;
    role: 'admin' | 'teacher';
    teacherId?: number | null;
    createdAt: Date;
    updatedAt: Date;
}

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'>;

class User extends Model<UserAttributes, UserCreationAttributes> {
    declare id: number;
    declare username: string;
    declare password: string;
    declare role: 'admin' | 'teacher';
    declare teacherId: number | null;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    // 验证密码
    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}

// 定义加密盐值
const SALT_ROUNDS = 10;

const UserModel = User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('admin', 'teacher'),
        allowNull: false,
        defaultValue: 'teacher',
    },
    teacherId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'teachers',
            key: 'id',
        },
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    sequelize,
    tableName: 'users',
    hooks: {
        beforeCreate: async (user: User) => {
            const salt = await bcrypt.genSalt(SALT_ROUNDS);
            user.password = await bcrypt.hash(user.password, salt);
        },
    }
});

export default UserModel; 