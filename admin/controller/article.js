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
            const result = await this.$model.article.update(data, {id: aid});
            if(result) {console.log(result);
                this.success('保存成功！', 'index');
            } else {
                this.error('保存失败！');
            }
        } else {
            const result = await this.$model.article.add(data);
            if(result) {console.log(result);
                this.success('新增成功！', 'index');
            } else {
                this.error('保存失败！');
            }
        }
    }
}

module.exports = Article;