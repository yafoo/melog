const {Model} = require('jj.js');
const {toTree, toTreeArray} = require('../utils');

class Link extends Model
{
    async getList(condition) {
        const list = await this.db.where(condition).order('sort', 'asc').select();
        return toTree(list);
    }

    async getOne(condition) {
        return await this.db.where(condition).find();
    }

    async add(data) {
        return await this.db.insert(data);
    }

    async update(data, condition) {
        return await this.db.update(data, condition);
    }

    async delete(condition) {
        return await this.db.delete(condition);
    }

    // 获取列表带缓存
    async getLinks(pid) {
        const link = await this.db.order('sort', 'asc').cache(600).select();
        return toTreeArray(link, pid);
    }

    // 友情链接
    async getFriendLinks() {
        return await this.getLinks(1);
    }

    // 底部导航
    async getFootLinks(rows) {
        return await this.getLinks(2);
    }
}

module.exports = Link;