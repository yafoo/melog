const Base = require('./base');

class Index extends Base {
    async index() {
        const list = await this.$model.article.getIndexList();
        const friends = await this.$model.link.friends();
        
        this.assign('list', list);
        this.assign('friends', friends);
        await this.fetch();
    }
}

module.exports = Index;