const {join} = require('path');
const database = join(__dirname, 'melog.db');

module.exports = {
    default: {
        type      : 'sqlite', // 数据库类型
        database  : database, // 数据库文件绝对地址，支持:memory:内存数据库
        prefix    : 'melog_' // 数据库表前缀
    },
    sqlite: {
        type      : 'sqlite', // 数据库类型
        database  : database, // 数据库文件绝对地址，支持:memory:内存数据库
        prefix    : 'melog_' // 数据库表前缀
    },
    mysql: {
        type      : 'mysql', // 数据库类型
        host      : '127.0.0.1', // 服务器地址
        database  : 'melog', // 数据库名
        user      : 'root', // 数据库用户名
        password  : '', // 数据库密码
        port      : '3306', // 数据库连接端口
        charset   : 'utf8mb4', // 数据库编码默认采用utf8mb4
        prefix    : 'melog_' // 数据库表前缀
    }
};