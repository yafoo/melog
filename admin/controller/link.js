const Base = require('./base');

class Link extends Base {
    async index() {
        const list = await this.$model.link.getList();
        this.assign('list', list);
        await this.fetch();
    }

    async add() {
        const link_list = await this.$model.link.getList();
        const pid = parseInt(this.ctx.query.pid);
        const id = parseInt(this.ctx.query.id);
        let link = {};
        if(id) {
            link = await this.$model.link.getOne({id});
        }

        this.assign('pid', pid);
        this.assign('link_list', link_list);
        this.assign('link', link);
        await this.fetch();
    }

    async save() {
        if(this.ctx.method != 'POST'){
            return this.error('非法请求！');
        }

        const data = this.ctx.request.body;
        const id = data.id;
        delete data.id;
        if(id) {
            const result = await this.$model.link.update(data, {id});
            if(result) {
                this.success('保存成功！', 'index');
            } else {
                this.error('保存失败！');
            }
        } else {
            const result = await this.$model.link.add(data);
            if(result) {
                this.success('新增成功！', 'index');
            } else {
                this.error('保存失败！');
            }
        }
    }

    async delete() {
        const id = parseInt(this.ctx.query.id);
        if(id == 1 || id == 2) {
            return this.error('系统固定链接不可删除！');
        }
        const link = await this.$model.link.getOne({id});
        if(!link) {
            return this.error('数据不存在！');
        }

        const result = await this.$model.link.delete({id});

        if(result) {
            this.success('删除成功！', 'index');
        } else {
            this.error('删除失败！');
        }
    }
}

module.exports = Link;