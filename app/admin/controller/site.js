const Base = require('./base');

class Site extends Base
{
    async index() {
        if(this.ctx.method == 'POST') {
            const data = this.$request.postAll();
            const list = await this.$model.site.db.column('value', 'key');
            try {
                await this.$model.site.db.startTrans();
                const keys = Object.keys(data);
                for(const key of keys) {
                    if((key in list) && data[key] !== list[key]) {
                        await this.$model.site.save({value: data[key]}, {key: key});
                    }
                }
                await this.$model.site.db.commit();
                this.clear('保存成功！');
            } catch(e) {
                await this.$model.site.db.rollback();
                this.$logger.error('保存失败：' + e.message);
                this.$error(e.msg);
            }
        } else {
            const list = await this.$model.site.getSiteList();
            list.forEach(item => {
                if(~['radio', 'select'].indexOf(item.type)) {
                    item.options = item.options.split('||').map(option => option.split('|'));
                }
            });
            this.$assign('list', list);
            await this.$fetch();
        }
    }

    async form() {
        const id = this.$request.get('id', 0);
        
        let data = {};
        if(id) {
            data = await this.$model.site.get({key: id});
        }

        this.$assign('id', id);
        this.$assign('data', data);
        await this.$fetch();
    }

    async save() {
        if(this.ctx.method != 'POST') {
            return this.$error('非法请求！');
        }

        const data = this.$request.postAll();
        const id = data.id;
        delete data.id;
        data.group = 'self';

        // 判断是否已存在
        if(!id || data.key != id) {
            const res = await this.$model.site.get({key: data.key});
            if(res) {
                return this.$error('参数' + data.key + '已存在！');
            }
        }
        const result = await this.$model.site.save(data, id ? {key: id} : undefined);

        if(result) {
            this.$success(id ? '保存成功！' : '新增成功！', 'index');
        } else {
            this.$error(id ? '保存失败！' : '新增失败！');
        }
    }

    async delete() {
        const id = this.$request.get('id', 0);
        const result = await this.$model.site.del({key: id, group: 'self'});
        if(result) {
            this.$success('删除成功！', 'index');
        } else {
            this.$error('删除失败！');
        }
    }

    async clear(msg = '') {
        try {
            await this.$service.cache.clear();
            this.$success(msg || '清理成功！');
        } catch(e) {
            this.$logger.error('清理失败：' + e.message);
            this.$error('清理失败！');
        }
    }
}

module.exports = Site;