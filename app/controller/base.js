const {Controller} = require('jj.js');
const pjson = require('../../package.json');

class Base extends Controller
{
    async _init() {
        // 文章模型
        const model_article = this.$model.article;

        // 站点配置、顶部导航、最新、热门列表、底部链接
        const [site_config, nav, latest, hot, foot_links] = await Promise.all([
            this.$admin.model.site.getConfig(),
            this.$model.cate.getCateList(),
            model_article.getNew(),
            model_article.getHot(),
            this.$admin.model.link.getFootLinks()
        ]);

        this.$assign('site', this.site = site_config);
        this.$assign('title', this.site.webname + ' - ' + this.site.description);
        this.$assign('description', this.site.description);
        this.$assign('keywords', this.site.keywords);
        this.$assign('nav', nav);
        this.$assign('latest', latest);
        this.$assign('hot', hot);
        this.$assign('foot_links', foot_links);
    }
}

module.exports = Base;