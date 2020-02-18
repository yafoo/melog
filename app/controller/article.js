const Base = require('./base');
const md = require('markdown-it')();

class Article extends Base {
    async article() {
        const aid = parseInt(this.ctx.params.id);
        const model_article = this.$model.article;

        // 文章信息
        const article = await model_article.getArticle({id: aid});
        if(!article) return;

        // 栏目信息
        const cate = await this.$model.cate.getCate({id: article.cate_id});

        // 上一篇、下一篇
        const [prevOne, nextOne] = await Promise.all([
            model_article.prevOne(aid),
            model_article.nextOne(aid)
        ]);

        // 更新点击(页面及数据库)
        article.click++;
        model_article.db.where({id: article.id}).inc('click');

        // markdown
        article.content = md.render(article.content);

        this.assign('title', article.title + ' - ' + cate.cate_name + ' - ' + this.site.webname);
        this.assign('description', article.description);
        this.assign('keywords', article.keywords);

        this.assign('cate', cate);
        this.assign('article', article);
        this.assign('prevOne', prevOne);
        this.assign('nextOne', nextOne);

        this.assign('is_comment', this.site.is_comment + article.is_comment >= 1);
        
        await this.fetch();
    }
}

module.exports = Article;