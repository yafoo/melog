const Base = require('./base');

class Link extends Base
{
    async index() {
        const pid = this.$request.get('pid', 0);
        const list = await this.$model.link.getLinkList(undefined, pid);
        const link_list = await this.$model.link.getLinkList({pid: 0});

        this.$assign('pid', pid);
        this.$assign('list', list);
        this.$assign('link_list', link_list);
        this.$assign('title', '链接管理');
        await this.$fetch();
    }

    async form() {
        const link_list = await this.$model.link.getLinkList();
        const pid = this.$request.get('pid', 0);
        const id = this.$request.get('id', 0);
        let link = {};
        if(id) {
            link = await this.$model.link.get({id});
        }

        this.$assign('pid', pid);
        this.$assign('link_list', link_list);
        this.$assign('link', link);
        this.$assign('title', '链接编辑');
        await this.$fetch();
    }

    async save() {
        if(!this.$request.isPost()) {
            return this.$error('非法请求！');
        }

        const data = this.$request.postAll();
        const id = data.id;
        const result = await this.$model.link.save(data);

        if(result) {
            this.$service.cache.clear();
            this.$success(id ? '保存成功！' : '新增成功！', 'index');
        } else {
            this.$error(id ? '保存失败！' : '新增失败！');
        }
    }

    async delete() {
        const id = this.$request.get('id', 0);
        if([1, 2, 3, 4].includes(id)) {
            return this.$error('系统固定链接不可删除！');
        }

        const result = await this.$model.link.del({id});
        if(result) {
            this.$service.cache.clear();
            this.$success('删除成功！', 'index');
        } else {
            this.$error('删除失败！');
        }
    }
}

module.exports = Link;