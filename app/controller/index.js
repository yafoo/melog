const Base = require('./base');

class Index extends Base
{
    async index() {
        // 首页列表
        const list = await this.$model.article.getIndexList();
        // 友情链接
        const friend_links = await this.$model.link.getFriendLinks();
        
        this.$assign('list', list);
        this.$assign('friend_links', friend_links);
        await this.$fetch();
    }
}

module.exports = Index;