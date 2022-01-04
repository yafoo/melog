const Base = require('./base');
const md = require('markdown-it')({html: true});

class Article extends Base
{
    async article() {
        const aid = parseInt(this.ctx.params.id);
        const model_article = this.$model.article;

        // 文章信息
        const article = await model_article.getArticle({id: aid});
        if(!article) return;

        // 栏目信息、上一篇、下一篇、相关文章
        const [cate, prevOne, nextOne, related] = await Promise.all([
            this.$model.cate.getCateInfo({id: article.cate_id}),
            model_article.prevOne(aid),
            model_article.nextOne(aid),
            model_article.getRelated({'id': ['!=', aid], keywords: article.keywords}, 9)
        ]);

        // 更新点击(页面及数据库)
        article.click++;
        model_article.db.where({id: article.id}).inc('click');
        // markdown
        article.content = md.render(article.content);
        const is_comment = this.site.is_comment + article.is_comment >= 1 ? true : false;

        this.$assign('title', article.title + ' - ' + cate.cate_name + ' - ' + this.site.webname);
        this.$assign('description', article.description);
        this.$assign('keywords', article.keywords);

        this.$assign('cate', cate);
        this.$assign('article', article);
        this.$assign('prevOne', prevOne);
        this.$assign('nextOne', nextOne);
        this.$assign('related', related);

        this.$assign('is_comment', is_comment);

        // 文章关键词列表
        const keywords_list = [];
        if(article.keywords) {
            article.keywords.split(',').forEach(keyword => {
                if(keyword) {
                    keywords_list.push(keyword);
                }
            });
        }
        this.$assign('keywords_list', keywords_list);

        // 文章地址
        this.$assign('article_link', this.site.basehost + this.$url.build(':article', {id: article.id}));
        
        await this.$fetch();
    }
}

module.exports = Article;