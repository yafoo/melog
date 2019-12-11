const Base = require('./base');

class Index extends Base {
    async index() {
        const list = await this.$model.article.getListWithCate();
        
        this.assign('list', list);
        await this.fetch();
    }
}

module.exports = Index;