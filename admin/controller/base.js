const {Controller} = require('iijs');
const pjson = require('../../package.json');

class Base extends Controller {
    async _init() {
        this.user_id = this.$service.cookie.get('user');
        if(this.user_id) {
            this.user = await this.$model.user.getUser({user_id: this.user_id});
            this.assign('user', this.user);
        }

        this.site = await this.$model.site.getConfig();
        this.site.VERSION = pjson.version;
        this.site.APP_TIME = this.ctx.APP_TIME;
        this.assign('site', this.site);
        
        this.assign('title', '管理中心');
        this.assign('description', this.site.description);
        this.assign('keywords', this.site.keywords);
    }
}

module.exports = Base;