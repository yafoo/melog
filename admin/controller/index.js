const {Controller} = require('iijs');

class Index extends Controller {
    async index() {
        const admin_auth = this.$service.cookie.get('admin_auth');
        this.display(admin_auth);
    }

    async login() {
        console.log(this.$service.cookie.get('id'));
        console.log(decodeURIComponent(this.$service.cookie.get('name')));
        this.display([this.$service.cookie.get('id'), decodeURIComponent(this.$service.cookie.get('name'))]);
    }
}

module.exports = Index;