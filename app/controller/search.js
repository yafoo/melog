const Renderer = require('markdown-it/lib/renderer');
const Base = require('./base');

class Search extends Base
{
    async search() {
        const url = this.ctx.url;
        if(!~url.indexOf('/search/')) {
            this.$redirect(url.replace('/search', '/search/'), 301);
            return false;
        }

        const keyword = this.ctx.query.keyword;
        let [list, pagination] = [[], ''];

        if(!keyword) {
            this.$assign('title', '搜索' + ' - ' + this.site.webname);
            this.$assign('search_title', '搜索');
        } else {
            const condition = {};
            condition['concat(a.title, a.writer, a.keywords, a.description)'] = ['like', '%' + keyword + '%'];
            [list, pagination] = await this.$model.article.getSearchList(condition);
            pagination = pagination.render();

            this.$assign('title', keyword + ' - ' + this.site.webname);
            this.$assign('search_title', keyword);
            this.$assign('description', `关于 《${keyword}》的博文文章`);
            this.$assign('keywords', keyword);
        }
        
        this.$assign('keyword', keyword);
        this.$assign('list', list);
        this.$assign('pagination', pagination);
        await this.$fetch();
    }
}

module.exports = Search;