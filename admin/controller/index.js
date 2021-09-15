const Base = require('./base');

class Index extends Base
{
    async index() {
        await this.$fetch();
    }

    async login() {
        if(this.ctx.method == 'POST'){
            const email = this.ctx.request.body.email;
            const password = this.ctx.request.body.password;
            if(!email) {
                this.$error('邮箱不能为空！');
            } else if(!this.ctx.request.body.password) {
                this.$error('密码不能为空！');
            }

            const err = await this.$model.user.login(email, password);
            if(err) {
                this.$error(err);
            } else {
                this.$success('登录成功！', 'index');
            }
        } else {
            this.$assign('title', '登录');
            await this.$fetch();
        }
    }

    async logout() {
        await this.$model.user.logout();
        this.$success('退出成功！', 'index')
    }

    async register() {
        this.$error('注册功能未开放！');
    }
}

module.exports = Index;