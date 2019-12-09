const Base = require('./base');

class Cate extends Base {
    async cate() {
        const cate_folder = this.ctx.params.cate;
        const model_cate = this.ctx.$ii.app.model.cate;
        const cate = await model_cate.getOne({cate_folder});
        if(!cate) {
            await this.next();
            return;
        }

        const model_article = this.ctx.$ii.app.model.article;
        const list = await model_article.getListByCate(cate.id);

        this.assign('title', cate.cate_name);
        this.assign('cate', cate);
        this.assign('list', list);
        
        await this.fetch();
    }
}

module.exports = Cate;