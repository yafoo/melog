const {Controller} = require('iijs');

class Article extends Controller {
    async article() {
        const aid = parseInt(this.ctx.params.id);
        const model_article = this.ctx.$ii.app.model.article;
        const article = await model_article.getOneByID(aid);
        if(!article) return;

        const latest = await model_article.latest();
        const hot = await model_article.hot();

        this.assign('title', article.title);
        this.assign('article', article);
        this.assign('latest', latest);
        this.assign('hot', hot);
        await this.fetch();
    }
}

module.exports = Article;