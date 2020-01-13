const {Cookie: C, utils} = require('iijs');
const {randomString} = require('../../config/utils');
const cookieEncode = randomString(16);

class Cookie extends C {
    constructor(...args) {
        super(...args);
        this.cookieEncode = this.ctx.$.config.cookie.cookieEncode || cookieEncode;
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
        return utils.md5(this.cookieEncode + value).substr(0, 16);
    }
}

module.exports = Cookie;