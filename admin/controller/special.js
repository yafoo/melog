const Base = require('./base');

class Special extends Base
{
    async index() {
        const keyword = this.ctx.query.keyword;

        const condition = {};
        if(keyword) {
            condition['concat(title, short_title, seo_title)'] = ['like', '%' + keyword + '%'];
        }

        const [list, pagination] = await this.$model.special.getSpecialList(condition);

        this.$assign('keyword', keyword);
        this.$assign('list', list);
        this.$assign('pagination', pagination.render());

        await this.$fetch();
    }
    
    async form() {
        const id = parseInt(this.ctx.query.id);
        
        let special = {};
        if(id) {
            special = await this.$model.special.get({id});
        }

        this.$assign('special', special);

        await this.$fetch();
    }

    async save() {
        if(this.ctx.method != 'POST') {
            return this.$error('非法请求！');
        }

        const data = this.ctx.request.body;
        const id = data.id;
        const result = await this.$model.special.saveSpecial(data);

        if(result) {
            this.$success(id ? '保存成功！' : '新增成功！', 'index');
        } else {
            this.$error(id ? '保存失败！' : '新增失败！');
        }
    }

    async delete() {
        const id = parseInt(this.ctx.query.id);

        const result = await this.$model.special.del({id});
        if(result) {
            this.$success('删除成功！', 'index');
        } else {
            this.$error('删除失败！');
        }
    }

    async special() {
        const id = parseInt(this.ctx.query.id) || 0;
        this.$assign('id', id);

        const {resolve} = require('path');
        const dir = resolve(__dirname, '../view/components');
        const component_files = await this.$.utils.fs.readdir(dir);
        this.$assign('component_files', component_files);

        // 地图sdk
        this.$assign('map_ak', '465c0734722cfde06f7d7eac68559354');

        await this.$fetch();
    }

    async specialItemList() {
        const special_id = parseInt(this.ctx.query.special_id);
        const item_list = await this.$model.specialItem.specialItemList(special_id);
        await this.$success(item_list);
    }

    async specialItemAdd() {
        if(this.ctx.method == 'POST') {
            const data = this.ctx.request.body;
            const msg = await this.$model.specialItem.specialItemSave(data);
            if(msg === true) {
                return this.$success('新增成功！');
            } else {
                return this.$error(msg);
            }
        }

        this.$error('非法请求！');
    }

    async specialItemSave() {
        if(this.ctx.method == 'POST') {
            const form_data = this.ctx.request.body;

            const data = {};
            data.id = form_data.id;
            data.enable = parseInt(form_data.enable);
            delete(form_data.id);
            delete(form_data.enable);
            delete(form_data.type);
            data.data = form_data;

            const msg = await this.$model.specialItem.specialItemSave(data);
            if(msg === true) {
                return this.$success('保存成功！');
            } else {
                return this.$error(msg);
            }
        }

        this.$error('非法请求！');
    }

    async specialItemSort() {
        if(this.ctx.method == 'POST') {
            const form_data = this.ctx.request.body;
            const post_sort = form_data.sort.split(',');
            const item_ids = [];

            post_sort.forEach((sort, index) => {
                post_sort[index] = sort.split(':');
                item_ids.push(post_sort[index][0]);
            });
            const item_list = await this.$model.specialItem.db.where({special_id: form_data.special_id, id: ['in', item_ids]}).column('sort', 'id');

            const sort_change = [];
            post_sort.forEach(sort => {
                if(typeof(item_list[sort[0]]) != 'undefined' && item_list[sort[0]] != sort[1]) {
                    sort_change.push({id: sort[0], sort: sort[1]});
                }
            });
            
            const msg = await this.$model.specialItem.specialItemSort(sort_change);
            if(msg === true) {
                return this.$success('排序成功！');
            } else {
                return this.$error(msg);
            }
        }

        this.$error('非法请求！');
    }

    async specialItemDel() {
        if(this.ctx.method == 'POST') {
            const data = this.ctx.request.body;
            const id = data.id;

            const msg = await this.$model.specialItem.specialItemDel(id);
            if(msg === true) {
                return this.$success('删除成功！');
            } else {
                return this.$error(msg);
            }
        }

        this.$error('非法请求！');
    }
}

module.exports = Special;