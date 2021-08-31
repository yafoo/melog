const {Controller} = require('jj.js');

class Base extends Controller
{
    async _init() {
        this.user_id = this.$service.cookie.get('user');
        if(this.user_id) {
            this.user = await this.$model.user.getOne({id: this.user_id});
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