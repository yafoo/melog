const {utils} = require('iijs');
const Base = require('./base');

class Article extends Base {
    async add() {
        const cate_list = await this.$model.cate.getNav({user_id: this.user_id});
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
            const result = await this.$modle.article.update(data, {id: aid});
            if(result) {
                this.success('保存成功！', 'index/index');
            } else {
                this.error('保存失败！');
            }
        } else {
            const result = await this.$modle.article.add(data);
            if(result) {
                this.success('新增成功！', 'index/index');
            } else {
                this.error('保存失败！');
            }
        }
    }
}

module.exports = Article;