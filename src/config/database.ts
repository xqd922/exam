import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    database: 'exam_scheduler',
    username: 'root',  // 请根据实际情况修改
    password: 'root',  // 请根据实际情况修改
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    timezone: '+08:00',
    define: {
        timestamps: true,
        underscored: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
    }
});

export default sequelize; 