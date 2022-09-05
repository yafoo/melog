const {Controller} = require('jj.js');
const pjson = require('../../package.json');

class Index extends Controller
{
    async _init() {
        this.config = {
            db: this.$config.db.default,
            VERSION: pjson.version,
            APP_TIME: this.ctx.APP_TIME
        };
        
        this.base_dir = this.$config.app.base_dir;
        this.installFile = this.base_dir + '/config/install.js';
        this.dbFile = this.base_dir + '/config/db.js';
        this.sqlFile = this.base_dir + '/melog.sql';

        if(await this._isInstalled()) {
            this.$error('系统已安装！');
            return false;
        }

        this.$assign('title', 'Melog系统安装');
        this.$assign('description', 'melog，一个基于jj.js(nodejs)构建的简单轻量级blog系统。代码极简，无需编译，方便二次开发。');
        this.$assign('keywords', 'melog');
        this.$assign('config', this.config);
    }

    async _isInstalled() {
        if(this.$config.install) {
            return true;
        }

        if(await this.$.utils.fs.isFile(this.installFile)) {
            return true;
        }

        return false;
    }

    async _writeInstallFile(config_db) {
        const install_content = `// 本文件用来标识系统已安装，不可删除。如需重新安装，请删除本文件并重启系统。
module.exports = {
    install: true,
    version: '${this.config.VERSION}'
};`;
        await this.$.utils.fs.writeFile(this.installFile, install_content);

        const db_content = `module.exports = {
    default: {
        type      : 'mysql', // 数据库类型
        host      : '${config_db.host}', // 服务器地址
        database  : '${config_db.database}', // 数据库名
        user      : '${config_db.user}', // 数据库用户名
        password  : '${config_db.password}', // 数据库密码
        port      : '${config_db.port}', // 数据库连接端口
        charset   : 'utf8', // 数据库编码默认采用utf8
        prefix    : 'melog_' // 数据库表前缀
    }
};`;
        await this.$.utils.fs.writeFile(this.dbFile, db_content);
    }

    async index() {
        await this.$fetch();
    }

    async install() {
        if(this.ctx.method != 'POST') {
            return this.$error('非法请求！');
        }

        const form_data = this.ctx.request.body;
        let db = null;
        let error = '';

        try {
            const config_db = {...this.config.db, ...form_data};
            delete config_db.database;
            const database = form_data.database;

            // 新建db实例
            db = new this.$db(this.ctx, config_db);
            // 创建数据库
            await db.query(`create database if not exists \`${database}\` DEFAULT CHARACTER SET utf8mb4;`);
            // 设置数据库并重新连接
            config_db.database = database;
            (await db.close()).connect(config_db);
            // 获取sql文件
            let sql_data = await this.$.utils.fs.readFile(this.sqlFile);
            sql_data = sql_data.split(/;\r\n/);
            // 使用事务执行sql语句
            await db.startTrans(async () => {
                for(let i=0; i<sql_data.length; i++) {
                    await db.query(sql_data[i]);
                }
            });

            // 写入安装文件
            await this._writeInstallFile(config_db);

            // 修改默认db配置
            this.$config.db.default.host = config_db.host;
            this.$config.db.default.database = config_db.database;
            this.$config.db.default.user = config_db.user;
            this.$config.db.default.password = config_db.password;
            this.$config.db.default.port = config_db.port;
            // 重启默认数据库连接
            (await this.$db.close()).connect();
        } catch(e) {
            this.$logger.debug(e);
            error = e.message || '安装出错！';
        }

        db && db.close();

        error ? this.$error(error) : this.$success('安装成功！');
    }
}

module.exports = Index;