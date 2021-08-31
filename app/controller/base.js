const {Controller} = require('jj.js');
const pjson = require('../../package.json');

class Base extends Controller
{
    async _init() {
        const nav = await this.$model.cate.getCateList();
        const model_article = this.$model.article;

        // 最新、热门列表
        const [latest, hot] = await Promise.all([
            model_article.getNew(),
            model_article.getHot()
        ]);

        // 站点配置
        this.site = await this.$admin.model.site.getConfig();
        this.$assign('site', this.site);

        // 底部链接
        const foot_links = await this.$admin.model.link.getFootLinks();
        this.$assign('foot_links', foot_links);
        
        this.$assign('title', this.site.webname + ' - ' + this.site.description);
        this.$assign('description', this.site.description);
        this.$assign('keywords', this.site.keywords);
        this.$assign('nav', nav);
        this.$assign('latest', latest);
        this.$assign('hot', hot);
    }
}

module.exports = Base;