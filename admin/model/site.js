const {Model} = require('iijs');

class Site extends Model {
    async getList(condition, order='id', sort='asc'){
        return await this.db.where(condition).order(order, sort).select();
    }

    async add(data){
        return await this.db.insert(data);
    }

    async update(data, condition){
        return await this.db.update(data, condition);
    }

    async delete(condition){
        return await this.db.delete(condition);
    }
    
    async getAdminAlias(){
        return await this.db.cache(600).where({sname: 'admin_alias'}).value('value');
    }

    // 获取站点设置
    async getConfig(){
        return await this.db.cache(600).column('value', 'sname');
    }
}

module.exports = Site;