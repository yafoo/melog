const {Controller} = require('jj.js');

class Base extends Controller
{
    middleware = [
        '/install/check',
        {middleware: 'admin/auth/index', except: 'login,register'} // 验证登录中间件
    ];

    async _init() {
        this.user_id = this.$cookie.get('user');
        if(this.user_id) {
            this.user = await this.$model.user.get({id: this.user_id});
            if(!this.user) {
                this.$model.user.logout();
                this.$redirect('admin/index/login');
                return false;
            }
            this.$assign('user', this.user);
        }

        this.site = await this.$model.site.getConfig();
        this.$assign('site', this.site);
        
        this.$assign('title', '管理中心');
        this.$assign('description', this.site.description);
        this.$assign('keywords', this.site.keywords);
    }
}

module.exports = Base;