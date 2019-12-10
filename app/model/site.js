const {Model} = require('iijs');
let siteData = null;

class Site extends Model {
    async getList(condition, rows=10, order='id', sort='asc'){
        return await this.db.where(condition).order(order, sort).limit(rows).select();
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

    async getSiteData(){
        if(!siteData) {
            siteData = {};
            const rows = await this.db.field('name,content').select();
            rows.forEach(item => siteData[item.name] = item.content);
        }
        return siteData;
    }
}

module.exports = Site;