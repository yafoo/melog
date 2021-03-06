const Base = require('./base');

class User extends Base {
    async index() {
        const list = await this.$model.user.getList(undefined, 100, 'id');
        this.assign('list', list);
        await this.fetch();
    }

    async add() {
        const id = parseInt(this.ctx.query.id);
        let user = {};
        if(id) {
            user = await this.$model.user.getOne({id});
        }

        this.assign('user', user);
        await this.fetch();
    }

    async save() {
        if(this.ctx.method != 'POST'){
            return this.error('非法请求！');
        }

        const data = this.ctx.request.body;
        const id = data.id;
        delete data.id;

        if(data.password != data.password2) {
            return this.error('两次输入密码不一致！');
        }
        delete data.password2;

        if(id) {
            const result = await this.$model.user.update(data, {id});
            if(result) {
                this.success('保存成功！', 'index');
            } else {
                this.error('保存失败！');
            }
        } else {
            if(!data.email || !data.password) {
                return this.error('账号或密码不能为空！');
            }

            const result = await this.$model.user.add(data);
            if(result) {
                this.success('新增成功！', 'index');
            } else {
                this.error('保存失败！');
            }
        }
    }

    async delete() {
        const id = parseInt(this.ctx.query.id);
        if(id == 1) {
            return this.error('管理员账号请手工在数据库删除！');
        }

        const user = await this.$model.user.getOne({id});
        if(!user) {
            return this.error('数据不存在！');
        }

        const result = await this.$model.user.delete({id});

        if(result) {
            this.success('删除成功！', 'index');
        } else {
            this.error('删除失败！');
        }
    }
}

module.exports = User;