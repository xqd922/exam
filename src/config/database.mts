import { Sequelize } from 'sequelize';

let retryCount = 0;
const MAX_RETRIES = 5;
const RETRY_DELAY = 3000; // 3 seconds

const createSequelizeInstance = () => new Sequelize({
    database: 'exam_scheduler',
    username: 'root',
    password: 'root',
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    timezone: '+08:00',
    define: {
        timestamps: true,
        underscored: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: (msg) => console.log('[数据库]', msg),
    dialectOptions: {
        charset: 'utf8mb4',
        dateStrings: true,
        typeCast: true
    }
});

let sequelize = createSequelizeInstance();

// 测试数据库连接
async function testConnection() {
    while (retryCount < MAX_RETRIES) {
        try {
            console.log(`[数据库] 尝试连接数据库 (第 ${retryCount + 1} 次)`);
            await sequelize.authenticate();
            console.log('[数据库] 连接成功');
            
            // 检查数据库是否存在
            try {
                const [results] = await sequelize.query("SHOW DATABASES LIKE 'exam_scheduler'");
                if (Array.isArray(results) && results.length === 0) {
                    console.log('[数据库] 数据库不存在，正在创建...');
                    await sequelize.query("CREATE DATABASE IF NOT EXISTS exam_scheduler");
                    console.log('[数据库] 数据库创建成功');
                    
                    // 重新连接到新创建的数据库
                    sequelize.close();
                    sequelize = createSequelizeInstance();
                    await sequelize.authenticate();
                }
                
                // 使用数据库
                await sequelize.query("USE exam_scheduler");
                console.log('[数据库] 成功切换到 exam_scheduler 数据库');
                break;
            } catch (error: any) {
                console.error('[数据库] 创建/切换数据库失败:', error.message);
                throw error;
            }
        } catch (error: any) {
            console.error(`[数据库] 连接错误 (第 ${retryCount + 1} 次):`, error.message);
            
            if (error.message.includes('Access denied')) {
                console.error('[数据库] 认证错误: 请检查用户名和密码是否正确');
                throw error;
            }
            
            if (error.message.includes('ECONNREFUSED')) {
                console.error('[数据库] 连接被拒绝: 请确保 MySQL 服务已启动');
            }
            
            retryCount++;
            if (retryCount < MAX_RETRIES) {
                console.log(`[数据库] 将在 ${RETRY_DELAY/1000} 秒后重试...`);
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            } else {
                console.error('[数据库] 达到最大重试次数，放弃连接');
                throw new Error('无法连接到数据库，请检查 MySQL 服务是否正常运行');
            }
        }
    }
}

// 导出前先测试连接
testConnection().catch(error => {
    console.error('[数据库] 初始化失败:', error.message);
});

export default sequelize; 