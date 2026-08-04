const Base = require('./base');

class Cate extends Base
{
    // 获取分类列表
    async list() {
        const list = await this.$model.cate.getCateList();
        this.$success('success', list);
    }

    // 获取分类详情
    async detail() {
        const id = this.$request.get('id', 0);
        if(!id) return this.$error('缺少id参数');

        const cate = await this.$model.cate.get({id});
        if(!cate) return this.$error('分类不存在');

        this.$success('success', cate);
    }

    // 新增分类
    async create() {
        if(this.ctx.method != 'POST') return this.$error('请使用POST请求');

        const data = this.$request.postAll ? this.$request.postAll() : this.ctx.request.body;
        if(!data.cate_name) return this.$error('分类名称不能为空');
        if(!data.cate_dir) return this.$error('分类目录不能为空');

        data.is_show = data.is_show !== undefined ? (data.is_show ? 1 : 0) : 1;
        data.sort = data.sort || 0;

        const result = await this.$model.cate.save(data);
        if(result) {
            this.$success('新增成功', {id: result});
        } else {
            this.$error('新增失败');
        }
    }

    // 编辑分类
    async edit() {
        if(this.ctx.method != 'POST') return this.$error('请使用POST请求');

        const data = this.$request.postAll ? this.$request.postAll() : this.ctx.request.body;
        if(!data.id) return this.$error('缺少id参数');

        const cate = await this.$model.cate.get({id: data.id});
        if(!cate) return this.$error('分类不存在');

        if(data.is_show !== undefined) {
            data.is_show = data.is_show ? 1 : 0;
        }

        const result = await this.$model.cate.save(data);
        if(result) {
            this.$success('保存成功');
        } else {
            this.$error('保存失败');
        }
    }

    // 删除分类
    async delete() {
        const id = this.$request.get('id', 0) || (this.ctx.request.body && this.ctx.request.body.id);
        if(!id) return this.$error('缺少id参数');

        const result = await this.$model.cate.del({id});
        if(result) {
            this.$success('删除成功');
        } else {
            this.$error('删除失败');
        }
    }
}

module.exports = Cate;
