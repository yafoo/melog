const {Model} = require('jj.js');
const pjson = require('../../package.json');

class Site extends Model
{
    constructor(...args) {
        super(...args);
        this.cacheTime = this.$config.cache.app_sql_cache_time;
    }

    async getSiteList(condition, order='sort', sort='asc') {
        return await this.db.where(condition).order(order, sort).select();
    }

    // 获取站点设置
    async getConfig(key) {
        const result = await this.db.cache(this.cacheTime).column('value', 'key');
        if(key) {
            return result[key];
        } else {
            result.VERSION = pjson.version;
            result.APP_TIME = this.ctx.APP_TIME;
            return result;
        }
    }
}

module.exports = Site;