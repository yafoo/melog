const Base = require('./base');

class Cate extends Base
{
    async _init() {
        // admin跳过
        if(this.ctx.APP == 'admin') {
            await this.$next();
            return false;
        }

        // 栏目不存在跳过
        const CateArr = await this.$model.cate.getCateArr();
        if(!~CateArr.indexOf(this.ctx.params.cate)) {
            this.ctx.params = {};
            await this.$next();
            return false;
        }

        await super._init();
    }

    async cate() {
        const cate_dir = this.ctx.params.cate;
        const cate = await this.$model.cate.getCate({cate_dir});
        const [list, pagination] = await this.$model.article.getPageList({cate_id: cate.id});

        this.$assign('title', cate.cate_name + ' - ' + this.site.webname);
        this.$assign('description', cate.description);
        this.$assign('keywords', cate.keywords);

        this.$assign('cate', cate);
        this.$assign('list', list);
        this.$assign('pagination', pagination);
        
        await this.$fetch();
    }
}

module.exports = Cate;