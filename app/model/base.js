const {Model} = require('jj.js');

class Base extends Model
{
    constructor(...args) {
        super(...args);
        this.cacheTime = this.$config.cache.app_sql_cache_time;
    }
}

module.exports = Base;