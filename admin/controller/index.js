const {utils} = require('iijs');
const Base = require('./base');

class Index extends Base {
    async index() {
        await this.fetch();
    }

    async login() {
        if(this.ctx.method == 'POST'){
            const email = this.ctx.request.body.email;
            const password = this.ctx.request.body.password;
            if(!email) {
                this.error('邮箱不能为空！');
            } else if(!this.ctx.request.body.password) {
                this.error('密码不能为空！');
            }

            const user = await this.$model.user.getUser({email});
            if(!user || (user.password != this.passmd5(password, user.salt))) {
                this.error('账号或密码错误！');
            } else {
                this.$service.cookie.set('user', user.user_id);
                this.success('登录成功！', 'index');
            }
        } else {
            this.assign('title', '登录');
            await this.fetch();
        }
    }

    async logout() {
        this.$service.cookie.delete('user');
        this.success('退出成功！', 'index')
    }

    // 加密密码
    passmd5(password, salt){
        return utils.md5(salt + utils.md5(salt + utils.md5(password + salt) + salt));
    }
}

module.exports = Index;