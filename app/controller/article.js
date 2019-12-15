const Base = require('./base');
const md = require('markdown-it')();

class Article extends Base {
    async article() {
        const aid = parseInt(this.ctx.params.id);
        const model_article = this.$model.article;
        const article = await model_article.getOneByID(aid);
        if(!article) return;

        //栏目信息
        const cate = await this.$model.cate.getOneByID(article.cate_id);

        //上一篇、下一篇
        const [prevOne, nextOne] = await Promise.all([
            model_article.prevOne(aid),
            model_article.nextOne(aid)
        ]);

        //更新点击
        article.click++;
        model_article.db.update({click: article.click}, {id: article.id});

        //markdown
        article.content = md.render(article.content);

        this.assign('title', article.title + ' - ' + cate.cate_name + ' - ' + this.site.title);
        this.assign('description', article.description);
        this.assign('keywords', article.keywords);

        this.assign('cate', cate);
        this.assign('article', article);
        this.assign('prevOne', prevOne);
        this.assign('nextOne', nextOne);
        
        await this.fetch();
    }
}

module.exports = Article;