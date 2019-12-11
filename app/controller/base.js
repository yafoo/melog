const {Controller} = require('iijs');

class Base extends Controller {
    async _init() {
        const nav = await this.$model.cate.getNav();
        const model_article = this.$model.article;
        const [latest, hot] = await Promise.all([
            model_article.getNew(),
            model_article.getHot()
        ]);
        this.site = await this.$model.site.getSiteData();
        
        this.assign('site', this.site);
        
        this.assign('title', this.site.title + ' - ' + this.site.description);
        this.assign('description', this.site.description);
        this.assign('keywords', this.site.keywords);
        this.assign('nav', nav);
        this.assign('latest', latest);
        this.assign('hot', hot);
    }
}

module.exports = Base;