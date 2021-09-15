const Base = require('./base');

class Cate extends Base
{
    async index() {
        const list = await this.$model.cate.getCateList();
        this.$assign('list', list);
        await this.$fetch();
    }

    async form() {
        const id = parseInt(this.ctx.query.id);
        let cate = {};
        if(id) {
            cate = await this.$model.cate.get({id});
        }

        this.$assign('cate', cate);
        await this.$fetch();
    }

    async save() {
        if(this.ctx.method != 'POST') {
            return this.$error('非法请求！');
        }

        const data = this.ctx.request.body;
        data.is_show = data.is_show ? 1 : 0;

        const result = await this.$model.cate.save(data);
        if(result) {
            this.$success(data.id ? '保存成功！' : '新增成功！', 'index');
        } else {
            this.$error(data.id ? '保存失败！' : '新增失败！');
        }
    }

    async delete() {
        const id = parseInt(this.ctx.query.id);

        const result = await this.$model.cate.del({id});
        if(result) {
            this.$success('删除成功！', 'index');
        } else {
            this.$error('删除失败！');
        }
    }
}

module.exports = Cate;