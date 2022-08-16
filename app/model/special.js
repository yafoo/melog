const {Model} = require('jj.js');

class Special extends Model
{
    constructor(...args) {
        super(...args);
        this.cacheTime = this.$config.cache.app_sql_cache_time;
    }

    // 获取专题信息
    async getSpecialInfo(condition) {
        return await this.db.where(condition).cache(this.cacheTime).find();
    }

    // 获取专题列表
    async getSpecialList(condition) {
        return await this.db.where(condition).cache(this.cacheTime).select();
    }

    // 获取顶部专题列表
    async getTopList(rows=100) {
        return await this.db.where({flag: 1}).order('sort').order('id').limit(rows).cache(this.cacheTime).select();
    }
}

module.exports = Special;