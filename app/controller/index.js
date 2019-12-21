const Base = require('./base');

class Index extends Base {
    async index() {
        const list = await this.$model.article.getListWithCate();
        const friend = await this.$model.link.getFriend();
        
        this.assign('list', list);
        this.assign('friend', friend);
        await this.fetch();
    }
}

module.exports = Index;