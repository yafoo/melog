const {Cookie: LibCookie} = require('jj.js');
let cookieEncode = '';

class Cookie extends LibCookie
{
    constructor(...args) {
        super(...args);
        cookieEncode || (cookieEncode = this.$utils.randomString(16));
        this.cookieEncode = this.$config.cookie && this.$config.cookie.cookieEncode
            || this.$config.app.app_debug && 'debug_cookie_encode'
            || cookieEncode;
    }

    set(key, value, options) {
        super.set(key, value, options);
        super.set(key + '__ck', this.encode(value), options);
    }

    get(key) {
        const value = super.get(key);
        const value__ck = super.get(key + '__ck');
        return this.encode(value) == value__ck ? value : undefined;
    }

    delete(key) {
        super.delete(key);
        super.delete(key + '__ck');
    }

    encode(value) {
        return this.$utils.md5(this.cookieEncode + value).substr(0, 16);
    }
}

module.exports = Cookie;