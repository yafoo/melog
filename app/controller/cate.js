const Base = require('./base');

class Cate extends Base {
    async cate() {
        const c_folder = this.ctx.params.cate;
        const cate = await this.$model.cate.getOne({c_folder});
        if(!cate) {
            await this.next();
            return;
        }

        const [total, list] = await this.$model.article.getPageList({cate_id: cate.id});
        if(!list || list.length == 0) {
            return;
        }
        const pagination = total ? this.$pagination.cate.config({urlIndex: this.$config.utils.urlC(c_folder), urlPage: this.$config.utils.urlC(c_folder) + 'list_${page}.html'}).render(total) : '';

        this.assign('title', cate.c_name + ' - ' + this.site.title);
        this.assign('description', cate.c_description);
        this.assign('keywords', cate.c_keywords);

        this.assign('cate', cate);
        this.assign('list', list);

        this.assign('pagination', pagination);
        
        await this.fetch();
    }
}

module.exports = Cate;