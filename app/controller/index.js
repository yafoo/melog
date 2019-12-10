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
}

module.exports = Index;