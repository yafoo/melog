const {Model} = require('jj.js');

class Cate extends Model
{
    constructor(...args) {
        super(...args);
        this.cacheTime = this.$config.cache.app_sql_cache_time;
    }

    // 获取一个分类
    async getCateInfo(condition) {
        return await this.db.where(condition).cache(this.cacheTime).find();
    }

    // 博客顶部导航
    async getNavList(rows) {
        return await this.db.order('sort', 'asc').where({is_show: 1}).limit(rows).cache(this.cacheTime).select();
    }

    // 分类目录地址
    async getCateDirs() {
        return await this.db.cache(this.cacheTime).column('cate_dir');
    }
}

module.exports = Cate;