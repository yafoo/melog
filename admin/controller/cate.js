const Base = require('./base');

class Cate extends Base
{
    async index() {
        const list = await this.$model.cate.getList(undefined, 100, 'sort', 'asc');
        this.$assign('list', list);
        await this.$fetch();
    }

    async add() {
        const id = parseInt(this.ctx.query.id);
        let cate = {};
        if(id) {
            cate = await this.$model.cate.getOne({id});
        }

        this.$assign('cate', cate);
        await this.$fetch();
    }

    async save() {
        if(this.ctx.method != 'POST'){
            return this.$error('非法请求！');
        }

        const data = this.ctx.request.body;
        const id = data.id;
        delete data.id;
        if(id) {
            const result = await this.$model.cate.update(data, {id});
            if(result) {
                this.$success('保存成功！', 'index');
            } else {
                this.$error('保存失败！');
            }
        } else {
            const result = await this.$model.cate.add(data);
            if(result) {
                this.$success('新增成功！', 'index');
            } else {
                this.$error('保存失败！');
            }
        }
    }

    async delete() {
        const id = parseInt(this.ctx.query.id);

        const result = await this.$model.cate.delete({id});
        if(result) {
            this.$success('删除成功！', 'index');
        } else {
            this.$error('删除失败！');
        }
    }
}

module.exports = Cate;