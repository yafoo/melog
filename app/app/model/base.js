const {Model} = require('jj.js');

class Base extends Model
{
    /**
     * 数据缓存时间
     */
    cacheTime = 600;
}

module.exports = Base;