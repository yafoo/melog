const {Model} = require('iijs');

class Upload extends Model {
    async getList(condition, rows=10){
        return await this.db.where(condition).order('id', 'desc').limit(rows).select();
    }

    // 后台分页列表
    async getPageList(condition){
        const page = this.$$pagination.curPage;
        const pageSize = this.$$pagination.options.pageSize;
        const [total, list] = await Promise.all([
            this.db.where(condition).cache(60).count('id'),
            this.db.where(condition).order('id', 'desc').page(page, pageSize).select()
        ]);
        return [total, list];
    }

    async getOne(condition){
        return await this.db.where(condition).find();
    }

    async add(data){
        data.add_time || (data.add_time = Math.round(new Date() / 1000));
        return await this.db.insert(data);
    }

    async delete(condition){
        return await this.db.delete(condition);
    }
}

module.exports = Upload;