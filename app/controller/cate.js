const {Controller} = require('iijs');

class Cate extends Controller {
    async cate() {
        const cate_folder = this.ctx.params.cate;
        const model_cate = this.ctx.$ii.app.model.cate;
        const cate = await model_cate.getOne({cate_folder});
        if(!cate) return;

        const nav = await this.ctx.$ii.app.model.cate.getNav();
        const model_article = this.ctx.$ii.app.model.article;
        const list = await model_article.getListByCate(cate.id);
        const latest = await model_article.getNew();
        const hot = await model_article.getHot();

        this.assign('nav', nav);
        this.assign('title', cate.cate_name);
        this.assign('cate', cate);
        this.assign('list', list);
        this.assign('latest', latest);
        this.assign('hot', hot);
        
        await this.fetch();
    }
}

module.exports = Cate;