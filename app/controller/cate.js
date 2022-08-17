const Base = require('./base');

class Cate extends Base
{
    async _init() {
        // admin、special直接跳过
        if(~['admin', 'special'].indexOf(this.ctx.APP)) {
            await this.$next();
            return false;
        }

        this._cate_dir = this.ctx.params.cate;
        const cate_dirs = await this.$model.cate.getCateDirs();

        // 栏目不存在跳过
        if(!~cate_dirs.indexOf(this._cate_dir)) {
            delete this.ctx.params.cate; // 清除参数
            await this.$next();
            return false;
        }

        await super._init();
    }

    async cate() {
        const cate = await this.$model.cate.getCateInfo({cate_dir: this._cate_dir});
        const [list, pagination] = await this.$model.article.getPageList({cate_id: cate.id}, this.site.list_rows);

        this.$assign('title', (cate.seo_title || cate.cate_name) + ' - ' + this.site.webname);
        this.$assign('description', cate.description);
        this.$assign('keywords', cate.keywords);

        this.$assign('cate', cate);
        this.$assign('list', list);
        this.$assign('pagination', pagination.render());
        
        await this.$fetch();
    }
}

module.exports = Cate;