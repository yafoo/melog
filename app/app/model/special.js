const Base = require('./base');

class Special extends Base
{
    // 获取专题信息
    async getSpecialInfo(condition) {
        return await this.db.where(condition).withCache(this.cacheTime).find();
    }

    // 获取专题列表
    async getSpecialList(condition) {
        return await this.db.where(condition).withCache(this.cacheTime).select();
    }

    // 获取顶部专题列表
    async getTopList(rows=100) {
        return await this.db.where({flag: 1}).order('sort').order('id').limit(rows).withCache(this.cacheTime).select();
    }
}

module.exports = Special;