const {Model} = require('jj.js');

class Cate extends Model
{
    // 获取一个分类
    async getCate(condition) {
        return await this.db.where(condition).cache(600).find();
    }

    // 博客顶部导航
    async getCateList(rows) {
        return await this.db.order('sort', 'asc').limit(rows).cache(600).select();
    }

    // 分类目录地址
    async getCateDirList() {
        const rows = await this.getCateList();
        return rows.reduce((arr, cate) => {
            return arr.concat(cate.cate_dir);
        }, []);
    }
}

module.exports = Cate;