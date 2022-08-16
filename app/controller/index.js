const Base = require('./base');

class Index extends Base
{
    async index() {
        // 首页列表
        const [list, pagination] = await this.$model.article.getIndexList(this.site.list_rows, this.site.style == 'blog');
        // 友情链接
        const friend_links = await this.$model.link.getFriendLinks();
        // seo标题
        if(this.site.seo_title) {
            this.$assign('title', this.site.seo_title + ' - ' + this.site.webname);
        }

        this.$assign('list', list);
        this.$assign('pagination', pagination ? pagination.render() : '');
        this.$assign('friend_links', friend_links);
        await this.$fetch();
    }
}

module.exports = Index;