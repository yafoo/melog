const {Controller} = require('iijs');

class Admin extends Controller {
    async _init() {
        this.$service.cookie.set('id', '1000');
        this.$service.cookie.set('name', encodeURIComponent('中文'));
    }

    async login() {
        console.log(this.$service.cookie.get('id'));
        console.log(decodeURIComponent(this.$service.cookie.get('name')));
        this.display([this.$service.cookie.get('id'), decodeURIComponent(this.$service.cookie.get('name'))]);
    }
}

module.exports = Admin;