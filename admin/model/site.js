const {Model} = require('iijs');

class Site extends Model {
    async getAdminAlias(){
        return await this.db.cache(600).where({name: 'admin_alias'}).value('content');
    }
}

module.exports = Site;