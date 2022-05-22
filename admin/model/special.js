const {Model} = require('jj.js');

class Special extends Model
{
    // 后台专题列表
    async getSpecialList(condition) {
        return await this.db.where(condition).order('id', 'desc').pagination();
    }

    // 专题新增修改
    async saveSpecial(data, condition) {
        if(!data.id && !data.add_time) {
            data.add_time = this.$utils.time();
        }
        return await this.save(data, condition);
    }
}

module.exports = Special;