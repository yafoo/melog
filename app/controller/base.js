const {Controller} = require('jj.js');

class Base extends Controller
{
    async _init() {
        // 文章模型
        const model_article = this.$model.article;

        // 站点配置、顶部导航、最新、热门列表、底部链接
        const [site_config, nav_list, latest, hot, foot_links] = await Promise.all([
            this.$model.site.getConfig(),
            this.$model.cate.getNavList(),
            model_article.getNew(),
            model_article.getHot(),
            this.$model.link.getFootLinks()
        ]);

        this.$assign('site', this.site = site_config);
        this.$assign('title', this.site.webname + ' - ' + this.site.description);
        this.$assign('description', this.site.description);
        this.$assign('keywords', this.site.keywords);
        this.$assign('nav_list', nav_list);
        this.$assign('latest', latest);
        this.$assign('hot', hot);
        this.$assign('foot_links', foot_links);
    }
}

module.exports = Base;