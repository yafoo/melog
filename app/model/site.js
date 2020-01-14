const {Model} = require('iijs');

class Site extends Model {
    // 获取站点设置
    async getSite(){
        return await this.db.cache(600).column('content', 'name');
    }
}

module.exports = Site;