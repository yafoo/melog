const {Model, utils} = require('jj.js');

class SpecialItem extends Model
{
    async specialItemList(special_id, enable=0) {
        const condition = {special_id};
        if(enable) {
            condition.enable = 1;
        }
        const item_list = await this.db.order('sort', 'asc').order('id', 'asc').select(condition);

        await Promise.all(item_list.map(async item => {
            if(item.data) {
                item.data = JSON.parse(item.data);
            } else {
                item.data = {};
            }
            switch(item.type) {
                case 'list':
                    if(item.data.rows === undefined) {
                        item.data.rows = 5;
                    }
                    if(item.data.source === undefined) {
                        item.data.source = 'keyword';
                    }
                    if(item.data.style === undefined) {
                        item.data.style = '';
                    }
                    if(item.data.ids === undefined) {
                        item.data.ids = '';
                    }
                    item.data.list = [];
                    let field = 'id,thumb,title,description,click,keywords,add_time,cate_id';
                    if(item.data.style) {
                        field = 'id,thumb,title';
                    }
                    if(item.data.source == 'keyword' && item.data.keyword) {
                        const list = await this.$db.table('article').where({title: ['like', '%' + item.data.keyword + '%']}).field(field).order('id', 'desc').limit(item.data.rows).select();
                        item.data.list = list;
                    } else if(item.data.source != 'keyword' && item.data.ids) {
                        const ids = item.data.ids.split(',');
                        const list = await this.$db.table('article').where({id: ['in', ids]}).field(field).select();
                        const temp_list = {};
                        list.forEach(item => {
                            temp_list[item.id] = item;
                        });
                        ids.forEach(id => {
                            item.data.list.push(temp_list[id]);
                        });
                    }
                    let cate_list = {};
                    if(!item.data.style) {
                        const temp_list = await this.$db.table('cate').limit(100).field('id,cate_name,cate_dir').select();
                        temp_list.forEach(item => {
                            cate_list[item.id] = item;
                        });
                    }
                    item.data.list.forEach(arc => {
                        arc.url = this.$url.build(':article', {id: arc.id});
                        if(arc.add_time) {
                            arc.add_date = this.$utils.date('YYYY-mm-dd', arc.add_time)
                        }
                        if(arc.cate_id) {
                            arc.cate_name = cate_list[arc.cate_id].cate_name;
                            arc.cate_dir = cate_list[arc.cate_id].cate_dir;
                            arc.cate_url = this.$url.build(':cate', {cate: cate_list[arc.cate_id].cate_dir});
                        }
                    });
                    break;
                case 'map':
                    if(item.data.zoom === undefined) {
                        item.data.zoom = 14;
                    }
                    if(item.data.center === undefined) {
                        item.data.center = '';
                    }
                    if(item.data.list === undefined) {
                        item.data.list = [{points: [''], point_type: 'point'}];
                    }
                    break;
            }
        }));

        return item_list;
    }

    async specialItemSave(data) {
        if(data.data) {
            data.data = JSON.stringify(data.data);
        } else if(!data.id) {
            data.data = '';
        }

        let msg = true;

        if(data.id) {
            const result = await this.save(data);
            if(!result) {
                msg = '修改失败！';
            }
        } else {
            data.add_time = this.$utils.time();

            await this.db.startTrans();
            try {
                const result = await this.save(data);
                if(!result) {
                    throw new Error('新增失败！');
                }

                const sort_data = [];
                if(data.sort) {
                    const item_list = await this.db.where({special_id: data.special_id}).order('sort', 'asc').order('id', 'asc').limit(data.sort, 1000).select();
                    item_list.forEach((item, index) => {
                        sort_data.push({id: item.id, sort: data.sort + index + 1});
                    });

                    msg = await this.specialItemSort(sort_data);
                    if(msg !== true) {
                        throw new Error(msg);
                    }
                }

                await this.db.commit();
            } catch(err) {
                msg = err.msg || '系统出错！';
                await this.db.rollback();
            }

        }

        return msg;
    }

    async specialItemSort(sort_data) {
        let msg = true;
        if(!sort_data || !sort_data.length) {
            return msg;
        }

        await this.db.startTrans();
        try {
            for(let i=0; i<sort_data.length; i++) {
                const result = await this.save(sort_data[i]);
                if(!result) {
                    throw new Error('更新排序失败！');
                }
            }
            await this.db.commit();
        } catch(err) {
            msg = err.msg || '系统出错！';
            await this.db.rollback();
        }

        return msg;
    }

    async specialItemDel(id) {
        let msg = true;
        if(!id) {
            msg = '参数错误！';
            return msg;
        }

        const result = await this.del({id});
        if(!result) {
            msg = '删除失败！';
        }

        return msg;
    }
}

module.exports = SpecialItem;