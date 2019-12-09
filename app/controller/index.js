const Base = require('./base');

class Index extends Base {
    async index() {
        const model_article = this.ctx.$ii.app.model.article;
        const list = await model_article.getListWithCate();
        const site = {
            title: 'iime',
            description: '一个基于iijs构建的简单轻量级blog系统'
        }
        
        this.assign('site', site);
        this.assign('list', list);
        await this.fetch();
    }

    async test() {
        const nav = await this.ctx.$ii.app.model.cate.getNav();
        const model_article = this.ctx.$ii.app.model.article;
        const list = await model_article.getListWithCate();
        const latest = await model_article.getNew();
        const hot = await model_article.getHot();
        const site = {
            title: 'iime',
            description: '一个基于iijs构建的简单轻量级blog系统'
        }
        this.view.art.renderFile.defaults.imports.dateFormat = function(value, format) {return utils.date.format(format, value);}
        this.assign('nav', nav);
        this.assign('site', site);
        this.assign('list', list);
        this.assign('latest', latest);
        this.assign('hot', hot);
        await this.fetch();
    }
}

module.exports = Index;