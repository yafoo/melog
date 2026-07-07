const {Middleware} = require('jj.js');

class Auth extends Middleware
{
    async index() {
        await this.checkLogin();
    }

    // 后台登录验证
    async checkLogin() {
        if(!this.$cookie.get('user')) {
            return this.$redirect('admin/index/login');
        }
        await this.$next();
    }
}

module.exports = Auth;