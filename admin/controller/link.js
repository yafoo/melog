const Base = require('./base');

class Link extends Base
{
    async index() {
        const pid = this.ctx.query.pid || 0;
        const list = await this.$model.link.getLinkList(undefined, pid);
        const link_list = await this.$model.link.getLinkList({pid: 0});

        this.$assign('pid', pid);
        this.$assign('list', list);
        this.$assign('link_list', link_list);
        await this.$fetch();
    }

    async form() {
        const link_list = await this.$model.link.getLinkList();
        const pid = parseInt(this.ctx.query.pid);
        const id = parseInt(this.ctx.query.id);
        let link = {};
        if(id) {
            link = await this.$model.link.get({id});
        }

        this.$assign('pid', pid);
        this.$assign('link_list', link_list);
        this.$assign('link', link);
        await this.$fetch();
    }

    async save() {
        if(this.ctx.method != 'POST'){
            return this.$error('非法请求！');
        }

        const data = this.ctx.request.body;
        const result = await this.$model.link.save(data);

        if(result) {
            this.$success(data.id ? '保存成功！' : '新增成功！', 'index');
        } else {
            this.$error(data.id ? '保存失败！' : '新增失败！');
        }
    }

    async delete() {
        const id = parseInt(this.ctx.query.id);
        if(id == 1 || id == 2) {
            return this.$error('系统固定链接不可删除！');
        }

        const result = await this.$model.link.del({id});
        if(result) {
            this.$success('删除成功！', 'index');
        } else {
            this.$error('删除失败！');
        }
    }
}

module.exports = Link;