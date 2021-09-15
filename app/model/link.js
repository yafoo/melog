const {Model} = require('jj.js');

class Link extends Model
{
    constructor(...args) {
        super(...args);
        this.cacheTime = this.$config.cache.app_sql_cache_time;
    }

    // 获取列表
    async getLinkList(pid) {
        const link = await this.db.order('sort', 'asc').cache(this.cacheTime).select();
        return this.$utils.toTreeArray(link, pid);
    }

    // 友情链接
    async getFriendLinks() {
        return await this.getLinkList(1);
    }

    // 底部导航
    async getFootLinks(rows) {
        return await this.getLinkList(2);
    }
}

module.exports = Link;