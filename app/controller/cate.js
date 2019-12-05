const {Controller} = require('iijs');

class Cate extends Controller {
    async cate() {
        this.assign('title', ' - 分类：' + this.ctx.params.cate);
        await this.fetch();
    }
}

module.exports = Cate;