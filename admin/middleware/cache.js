const {Middleware} = require('jj.js');

class Cache extends Middleware
{
    async clear() {
        // 兼容直接调用
        if(this.$next) {
            await this.$next();
        }
        
        this.$cache.delete();
        this.$db.deleteCache();
    }
}

module.exports = Cache;