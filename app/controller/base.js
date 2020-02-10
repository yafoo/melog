const {Controller} = require('iijs');
const pjson = require('../../package.json');

class Base extends Controller {
    async _init() {
        const nav = await this.$model.cate.getCateList();
        const model_article = this.$model.article;

        // 最新、热门列表
        const [latest, hot] = await Promise.all([
            model_article.getNew(),
            model_article.getHot()
        ]);

        this.site = await this.$admin.model.site.getConfig();
        this.site.VERSION = pjson.version;
        this.site.APP_TIME = this.ctx.APP_TIME;
        this.assign('site', this.site);

        const flinks = await this.$admin.model.link.getFlinks();
        this.assign('flinks', flinks);
        
        this.assign('title', this.site.title + ' - ' + this.site.description);
        this.assign('description', this.site.description);
        this.assign('keywords', this.site.keywords);
        this.assign('nav', nav);
        this.assign('latest', latest);
        this.assign('hot', hot);
    }
}

module.exports = Base;