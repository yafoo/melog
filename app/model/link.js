const {Model} = require('jj.js');

class Link extends Model
{
    async getLinkList(condition, pid = 0) {
        const list = await this.db.where(condition).order('sort', 'asc').select();
        return this.$utils.toTree(list, pid);
    }
}

module.exports = Link;