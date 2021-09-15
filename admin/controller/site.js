const Base = require('./base');

class Site extends Base
{
    async index() {
        if(this.ctx.method == 'POST') {
            const data = this.ctx.request.body;
            const list = await this.$model.site.db.column('value', 'kname');
            try {
                await this.$model.site.db.startTrans();
                Object.keys(data).forEach(async key => {
                    if(list[key] !== undefined && list[key] !== data[key]) {
                        await this.$model.site.save({value: data[key]}, {kname: key});
                    }
                });
                await this.$model.site.db.commit();
                this.clear();
                this.$success('保存成功！');
            } catch(e) {
                await this.$model.site.db.rollback();
                this.$logger.error('保存失败：' + e.message);
                this.$error(e.msg);
            }
        } else {
            const list = await this.$model.site.getSiteList();
            this.$assign('list', list);
            await this.$fetch();
        }
    }

    async clear() {
        try {
            this.$cache.delete();
            this.$db.deleteCache();
            this.$success('清理成功！');
        } catch(e) {
            this.$logger.error('清理失败：' + e.message);
            this.$error('程序出错！');
        }
    }
}

module.exports = Site;