const {utils} = require('iijs');
const Base = require('./base');

class Article extends Base {
    async index() {
        const [total, list] = await this.$model.article.getListWithCate();
        const pagination = total ? this.$$pagination.render(total) : '';
        this.assign('list', list);
        this.assign('pagination', pagination);
        await this.fetch();
    }
    async add() {
        const cate_list = await this.$model.cate.getNav();
        const id = parseInt(this.ctx.query.id);
        let article = {};
        if(id) {
            article = await this.$model.article.getOne({id});
        }

        this.assign('cate_list', cate_list);
        this.assign('article', article);
        await this.fetch();
    }

    async save() {
        if(this.ctx.method != 'POST'){
            return this.error('非法请求！');
        }

        const data = this.ctx.request.body;
        const aid = data.id;
        if(aid) {
            delete data.id;
            data.update_time = Math.round(new Date() / 1000);
            const result = await this.$model.article.update(data, {id: aid});
            if(result) {
                this.success('保存成功！', 'index');
            } else {
                this.error('保存失败！');
            }
        } else {
            data.add_time = Math.round(new Date() / 1000);
            const result = await this.$model.article.add(data);
            if(result) {
                this.success('新增成功！', 'index');
            } else {
                this.error('保存失败！');
            }
        }
    }
}

module.exports = Article;