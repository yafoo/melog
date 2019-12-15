const Base = require('./base');

class Cate extends Base {
    async cate() {
        const folder = this.ctx.params.cate;
        const cate = await this.$model.cate.getOne({folder});
        if(!cate) {
            await this.next();
            return;
        }

        const [total, list] = await this.$model.article.getPageList({cate_id: cate.id});
        if(!list || list.length == 0) {
            return;
        }
        const pagination = total ? this.$pagination.cate.config({urlIndex: this.$config.utils.urlC(folder), urlPage: this.$config.utils.urlC(folder) + 'list_${page}.html'}).render(total) : '';

        this.assign('title', cate.cate_name + ' - ' + this.site.title);
        this.assign('description', cate.description);
        this.assign('keywords', cate.keywords);

        this.assign('cate', cate);
        this.assign('list', list);

        this.assign('pagination', pagination);
        
        await this.fetch();
    }
}

module.exports = Cate;