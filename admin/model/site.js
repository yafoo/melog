const {Model} = require('jj.js');
const pjson = require('../../package.json');

class Site extends Model
{
    async getList(condition, order='id', sort='asc') {
        return await this.db.where(condition).order(order, sort).select();
    }

    async add(data) {
        return await this.db.insert(data);
    }

    async update(data, condition) {
        return await this.db.update(data, condition);
    }

    async delete(condition) {
        return await this.db.delete(condition);
    }
    
    async getAdminAlias() {
        return await this.getConfig('admin_alias');
    }

    // 获取站点设置
    async getConfig(kname) {
        const result = await this.db.cache(600).column('value', 'kname');
        if(kname) {
            return result[kname];
        } else {
            result.VERSION = pjson.version;
            result.APP_TIME = this.ctx.APP_TIME;
            return result;
        }
    }
}

module.exports = Site;