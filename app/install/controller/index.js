const {Controller, loader} = require('jj.js');
const {version: VERSION} = require('../../../package.json');
const {join} = require('path');
const {readFile, writeFile} = require('fs').promises;

class Index extends Controller
{
    async _init() {
        this.base_dir = this.$config.app.base_dir;
        this.lockFile = this.base_dir + '/config/lock.js';
        this.dbFile = this.base_dir + '/config/db.js';
        this.sqlFile = this.base_dir + '/app/install/melog_sqlite.sql';
        this.mysqlFile = this.base_dir + '/app/install/melog_mysql.sql';

        if(await this._isInstalled()) {
            return this.$error('系统已安装！', '/');
        }

        this.$assign('title', 'Melog系统安装');
        this.$assign('description', 'melog，一个基于jj.js开发的简单轻量级blog系统。代码极简，无需编译，方便二次开发。');
        this.$assign('keywords', 'melog');
        this.$assign('VERSION', VERSION);
        this.$assign('APP_TIME', this.ctx.APP_TIME);
        this.$assign('sqlite', this.$config.db.sqlite);
        this.$assign('mysql', this.$config.db.mysql);
        this.$assign('sqljs', this.$config.db.sqljs);

        // 检测可用的数据库驱动
        const db_drivers = [
            {type: 'sqlite', name: 'SQLite', driver: 'sqlite3', install_cmd: 'npm install sqlite3'},
            {type: 'mysql', name: 'MySQL', driver: 'mysql', install_cmd: 'npm install mysql'},
            {type: 'sqljs', name: 'SQL.js', driver: 'sql.js', install_cmd: 'npm install sql.js'}
        ];
        for(const d of db_drivers) {
            try { require(d.driver); d.available = true; } catch(e) { d.available = false; }
        }
        this.$assign('db_drivers', db_drivers);

        // 计算默认选中的数据库类型：优先sqlite，否则第一个可用的
        const default_db = db_drivers.find(d => d.available && d.type === 'sqlite') || db_drivers.find(d => d.available);
        this.$assign('default_db_type', default_db ? default_db.type : '');
    }

    async _isInstalled() {
        if(this.$config.lock) {
            return true;
        }

        if(await this.$.utils.fs.isFile(this.lockFile)) {
            return true;
        }

        return false;
    }

    async index() {
        await this.$fetch();
    }

    async install() {
        if(!this.$request.isPost()) {
            return this.$error('非法请求！');
        }

        const form_data = this.$request.postAll();
        const db_type = form_data.db_type || '';
        const username = form_data.username;
        const user_password = form_data.user_password;
        if(!username || !user_password) {
            return this.$error('用户名或密码不能为空！');
        }

        // 检测所选数据库驱动是否可用
        const driver_map = {sqlite: 'sqlite3', mysql: 'mysql', sqljs: 'sql.js'};
        try { require(driver_map[db_type]); } catch(e) {
            return this.$error(`数据库驱动 ${driver_map[db_type]} 未安装，请先执行: npm install ${driver_map[db_type]}`);
        }

        let error = '';
        try {
            await this._writeDbFile(form_data, db_type);
            // delete require.cache[require.resolve(this.dbFile)]; // 清除配置缓存
            // loader.clearPathCache(); // 清除路径缓存
            this.$utils.config.reload();
            await this._initSql(db_type, username, user_password);
            await this._writeLockFile();
            loader.clearPathCache(); // 清除路径缓存
        } catch(e) {console.log(e);
            this.$logger.debug(e);
            error = e.message || '安装出错！';
        }
        error ? this.$error(error) : this.$success('安装成功！');
    }

    /**
     * 初始化数据库
     * @param {string} db_type - 数据库类型
     * @param {string} username - 登录用户名
     * @param {string} password - 登录密码
     */
    async _initSql(db_type, username, password) {
        try {
            const sql_data = (await readFile((db_type === 'mysql') ? this.mysqlFile : this.sqlFile, 'utf8')).split(/;\r\n/);
            const db = this.$db;
            await db.startTrans(async () => {
                // 执行sql语句
                for(let i = 0; i < sql_data.length; i++) {
                    const sql = sql_data[i].trim();
                    if(sql) await db.query(sql);
                }
            });
            await this.$admin.model.user.saveUser({username, password});
        } catch(e) {
            throw e;
        }
    }

    /**
     * 写入数据库配置文件
     * @param {object} config_db - 数据库配置
     * @param {string} db_type - 数据库类型
     */
    async _writeDbFile(config_db, db_type) {
        let default_content;
        if(db_type === 'sqlite') {
            default_content = `    default: {
        type      : 'sqlite', // 数据库类型
        database  : database, // 数据库文件绝对地址，支持:memory:内存数据库
        optimize  : false, // 是否启用性能优化（WAL模式、减少磁盘同步、锁等待超时）
        prefix    : 'melog_' // 数据库表前缀
    }`;
        } else if(db_type === 'sqljs') {
            default_content = `    default: {
        type      : 'sqljs', // 数据库类型（基于sql.js的纯JS SQLite驱动）
        database  : database, // 数据库文件绝对地址，支持:memory:内存数据库
        optimize  : false, // 是否启用性能优化（WAL模式、减少磁盘同步、锁等待超时）
        prefix    : 'melog_' // 数据库表前缀
    }`;
        } else {
            default_content = `    default: {
        type      : 'mysql', // 数据库类型
        host      : '${config_db.host}', // 服务器地址
        database  : '${config_db.database}', // 数据库名
        user      : '${config_db.user}', // 数据库用户名
        password  : '${config_db.password}', // 数据库密码
        port      : '${config_db.port}', // 数据库连接端口
        charset   : 'utf8mb4', // 数据库编码默认采用utf8mb4
        prefix    : 'melog_' // 数据库表前缀
    }`;
        }
        // 读取现有文件，替换default部分
        let content = await readFile(this.dbFile, 'utf8');
        content = content.replace(/    default: \{[\s\S]*?\n    \}/, default_content);
        await writeFile(this.dbFile, content);
    }

    /**
     * 写入锁定文件
     */
    async _writeLockFile() {
        const lock_content = `// 本文件用来标识系统已安装，不可删除。如需重新安装，请删除本文件并重启系统。
module.exports = {
    install: true,
    version: '${VERSION}'
};`;
        await writeFile(this.lockFile, lock_content);
    }
}

module.exports = Index;