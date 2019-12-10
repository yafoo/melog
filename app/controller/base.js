const {Controller} = require('iijs');

class Base extends Controller {
    async _init() {
        const nav = await this.ctx.$ii.app.model.cate.getNav();
        const model_article = this.ctx.$ii.app.model.article;
        const latest = await model_article.getNew();
        const hot = await model_article.getHot();
        this.site = {
            title: 'iime',
            description: '一个基于iijs构建的简单轻量级blog系统',
            keywords: 'iime,blog,简单,轻量,iijs',
            beian: '<a href="http://www.miibeian.gov.cn/" target="_blank">京ICP备11008151号</a> <span>京公网安备11010802014853</span>'
        }
        
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