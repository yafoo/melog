const {Model} = require('jj.js');

class Upload extends Model
{
    async getList(condition, rows=10) {
        const list = await this.db.where(condition).order('id', 'desc').limit(rows).select();

        if(list && list.length) {
            const site_config = await this.$model.site.getConfig();
            list.map(item => {
                item.image = site_config.upload + item.image;
                item.thumb = site_config.upload + item.thumb;
                item.size_text = item.size < 1024 ? item.size + 'B' : item.size < 1024 * 1024 ? (item.size/1024).toFixed(1) + 'KB' : (item.size/1024/1024).toFixed(1) + 'MB';
                return item;
            });
        }
        
        return list;
    }

    // 后台分页列表
    async getPageList(condition) {
        const page = this.$pagination.curPage;
        const pageSize = this.$pagination.options.pageSize;
        const [total, list] = await Promise.all([
            this.db.where(condition).count('id'),
            this.db.where(condition).order('id', 'desc').page(page, pageSize).select()
        ]);
        const pagination = total ? this.$pagination.render(total) : '';
        
        if(list && list.length) {
            const site_config = await this.$model.site.getConfig();
            list.map(item => {
                item.image = site_config.upload + item.image;
                item.thumb = site_config.upload + item.thumb;
                item.size_text = item.size < 1024 ? item.size + 'B' : item.size < 1024 * 1024 ? (item.size/1024).toFixed(1) + 'KB' : (item.size/1024/1024).toFixed(1) + 'MB';
                return item;
            });
        }

        return [list, pagination];
    }

    async getOne(condition) {
        return await this.db.where(condition).find();
    }

    async add(data) {
        if(!data.add_time) {
            data.add_time = this.$utils.time();
        }
        return await this.db.insert(data);
    }

    async delete(condition) {
        return await this.db.delete(condition);
    }
}

module.exports = Upload;