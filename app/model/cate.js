const {Model} = require('jj.js');

class Cate extends Model
{
    async getCateList(condition, rows=100, order='sort', sort='asc') {
        return await this.db.where(condition).order(order, sort).limit(rows).select();
    }
}

module.exports = Cate;