const Base = require('./base');

class Article extends Base {
    async article() {
        const aid = parseInt(this.ctx.params.id);
        const model_article = this.ctx.$ii.app.model.article;
        const article = await model_article.getOneByID(aid);
        if(!article) return;

        //栏目信息
        const model_cate = this.ctx.$ii.app.model.cate;
        const cate = await model_cate.getOneByID(article.cate_id);

        //上一篇、下一篇
        const [preOne, nextOne] = await Promise.all([
            model_article.preOne(aid),
            model_article.nextOne(aid)
        ]);

        //更新点击
        article.click++;
        model_article.db.update({click: article.click}, {id: article.id});

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