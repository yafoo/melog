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
        if(data.id > 0) {
            return await this.save(data, condition);
        } else {
            try {
                await this.db.startTrans(async () => {
                    const result = await this.save(data, condition);
                    await this.$db.table('special_item').update({special_id: result.insertId}, {special_id: 0});
                });
                return true;
            } catch(e) {
                this.$logger.error('专题新增失败：' + e.message);
                return false;
            }
        }
        
    }
}

module.exports = Special;