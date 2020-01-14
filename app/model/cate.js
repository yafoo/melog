const {Model} = require('iijs');

class Cate extends Model {
    // 获取一个分类
    async getCate(condition) {
        return await this.db.where(condition).cache(600).find();
    }

    // 顶部导航
    async getCateList(rows) {
        return await this.db.order('cate_sort', 'asc').limit(rows).cache(600).select();
    }

    // 分类数组
    async getCateArr() {
        const rows = await this.getCateList();
        return rows.reduce((arr, cate) => {
            return arr.concat(cate.folder);
        }, []);
    }
}

module.exports = Cate;