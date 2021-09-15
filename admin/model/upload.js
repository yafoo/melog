const {Model} = require('jj.js');

class Upload extends Model
{
    // 后台文件列表
    async getPageList(condition) {
        const [list, pagination] = await this.db.where(condition).order('id', 'desc').pagination();
        
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
}

module.exports = Upload;