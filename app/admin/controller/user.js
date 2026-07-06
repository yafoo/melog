const Base = require('./base');

class User extends Base
{
    async index() {
        const list = await this.$model.user.getUserList(undefined, 100);
        this.$assign('list', list);
        await this.$fetch();
    }

    async form() {
        const id = parseInt(this.ctx.query.id);
        let user = {};
        if(id) {
            user = await this.$model.user.get({id});
        }

        this.$assign('user', user);
        await this.$fetch();
    }

    async save() {
        if(this.ctx.method != 'POST') {
            return this.$error('非法请求！');
        }

        const data = this.ctx.request.body;
        if(!data.email) {
            return this.$error('账号不能为空！');
        }
        if(!data.id && !data.password) {
            return this.$error('密码不能为空！');
        }
        if(data.password != data.password2) {
            return this.$error('两次输入密码不一致！');
        }

        const result = await this.$model.user.saveUser(data);
        if(result) {
            this.$success(data.id ? '保存成功！' : '新增成功！', 'index');
        } else {
            this.$error(data.id ? '保存失败！' : '新增失败！');
        }
    }

    async delete() {
        const id = parseInt(this.ctx.query.id);
        if(id == 1) {
            return this.$error('管理员账号请手工在数据库删除！');
        }

        const result = await this.$model.user.del({id});
        if(result) {
            this.$success('删除成功！', 'index');
        } else {
            this.$error('删除失败！');
        }
    }
}

module.exports = User;