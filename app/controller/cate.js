const Base = require('./base');

class Cate extends Base {
    async cate() {
        const c_folder = this.ctx.params.cate;
        const model_cate = this.ctx.$ii.app.model.cate;
        const cate = await model_cate.getOne({c_folder});
        if(!cate) {
            await this.next();
            return;
        }

        const model_article = this.ctx.$ii.app.model.article;
        const list = await model_article.getListByCate(cate.id);

        this.assign('title', cate.c_name + ' - ' + this.site.title);
        this.assign('description', cate.c_description);
        this.assign('keywords', cate.c_keywords);

        this.assign('cate', cate);
        this.assign('list', list);
        
        await this.fetch();
    }
}

module.exports = Cate;