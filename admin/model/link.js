const {Model} = require('iijs');

class Link extends Model {
    async getList(condition){
        const list = await this.db.where(condition).order('sort', 'asc').select();
        return this.toTree(list);
    }

    async getOne(condition){
        return await this.db.where(condition).find();
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

    // 获取列表带缓存
    async getLinks(pid) {
        const link = await this.db.order('sort', 'asc').cache(600).select();
        return this.toTreeArray(link, pid);
    }

    // 友情链接
    async getFriends(){
        return await this.getLinks(1);
    }

    // 底部导航
    async getFlinks(rows){
        return await this.getLinks(2);
    }

    /**
     * 按父子孙分级整理
     * @param list
     * @param int pid
     * @return array
     */
    toTreeArray(list, pid=0){
        const arr = [];
        list.forEach(v => {
            if(v.pid == pid){
                v.child = this.toTreeArray(list, v.id);
                arr.push(v);
            }
        });
        return arr;
    }

    /**
     * 按父子孙平级排列
     * @param list
     * @param int pid
     * @param int level
     * @return array
     */
    toTree(list, pid=0, level=0) {
        let arr = [];
        list.forEach(v => {
            if(v.pid == pid){
                v.level = level + 1;
                arr.push(v);
                arr = arr.concat(this.toTree(list, v.id, level + 1));
            }
        });
        return arr;
    }
}

module.exports = Link;