const Base = require('./base');

class Index extends Base {
    async index() {
        const model_article = this.ctx.$ii.app.model.article;
        const list = await model_article.getListWithCate();
        
        this.assign('list', list);
        await this.fetch();
    }
}

module.exports = Index;