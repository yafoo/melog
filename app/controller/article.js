const Base = require('./base');

class Article extends Base {
    async article() {
        const aid = parseInt(this.ctx.params.id);
        const model_article = this.ctx.$ii.app.model.article;
        const article = await model_article.getOneByID(aid);
        if(!article) return;

        const model_cate = this.ctx.$ii.app.model.cate;
        const cate = await model_cate.getOneByID(article.cate_id);

        const [preOne, nextOne] = await Promise.all([
            model_article.preOne(aid),
            model_article.nextOne(aid)
        ]);

        this.assign('title', article.title + ' - ' + cate.c_name + ' - ' + this.site.title);
        this.assign('description', article.description);
        this.assign('keywords', article.keywords);

        this.assign('cate', cate);
        this.assign('article', article);
        this.assign('preOne', preOne);
        this.assign('nextOne', nextOne);
        
        await this.fetch();
    }
}

module.exports = Article;