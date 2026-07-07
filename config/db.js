const {join} = require('path');
const database = join(__dirname, 'melog.db');

module.exports = {
    default: {
        type      : 'sqlite', // 数据库类型
        database  : database, // 数据库文件绝对地址，支持:memory:内存数据库
        prefix    : 'melog_' // 数据库表前缀
    },
};