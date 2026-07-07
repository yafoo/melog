const Base = require('./base');

class Cate extends Base
{
    // 获取一个分类
    async getCateInfo(condition) {
        return await this.db.where(condition).withCache(this.cacheTime).find();
    }

    // 博客顶部导航
    async getNavList(rows) {
        return await this.db.order('sort', 'asc').where({is_show: 1}).limit(rows).withCache(this.cacheTime).select();
    }

    // 分类目录地址
    async getCateDirs() {
        return await this.db.withCache(this.cacheTime).column('cate_dir');
    }
}

module.exports = Cate;