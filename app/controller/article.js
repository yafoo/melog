const Base = require('./base');

class Article extends Base {
    async article() {
        const aid = parseInt(this.ctx.params.id);
        const model_article = this.ctx.$ii.app.model.article;
        const article = await model_article.getOneByID(aid);
        if(!article) return;

        this.assign('title', article.title);
        this.assign('article', article);
        
        await this.fetch();
    }
}

module.exports = Article;