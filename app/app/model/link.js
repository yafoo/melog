const Base = require('./base');

class Link extends Base
{
    // 获取列表
    async getLinkList(pid, rows=100) {
        const link = await this.db.order('sort', 'asc').limit(rows).withCache(this.cacheTime).select();
        return this.$utils.toTreeArray(link, pid);
    }

    // Blog导航
    async getBlogLinks(rows=100) {
        return await this.getLinkList(1, rows);
    }

    // Banner导航
    async getBannerLinks(rows=100) {
        return await this.getLinkList(2, rows);
    }

    // 友情链接
    async getFriendLinks(rows=100) {
        return await this.getLinkList(3, rows);
    }

    // 底部导航
    async getFootLinks(rows=100) {
        return await this.getLinkList(4, rows);
    }
}

module.exports = Link;