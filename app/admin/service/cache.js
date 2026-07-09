const {Context} = require('jj.js');

class Cache extends Context
{
    async clear() {
        this.$cache.delete();
        this.$db._$cache.delete();
    }
}

module.exports = Cache;