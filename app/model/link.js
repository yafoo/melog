const {Model} = require('iijs');

class Link extends Model {
    // 获取节点列表
    async children(pid=0, rows){
        return await this.db.where({pid}).order('sort', 'asc').limit(rows).cache(600).select();
    }

    // 友情链接
    async friends(rows){
        return await this.children(1, rows);
    }

    // 底部导航
    async flinks(rows){
        return await this.children(2, rows);
    }
}

module.exports = Link;