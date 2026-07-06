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
                if(item.original) {
                    item.original = site_config.upload + item.original;
                }
                item.size_text = this.getFileSize(item.size);
                item.origin_size_text = this.getFileSize(item.origin_size);
                return item;
            });
        }

        return [list, pagination];
    }

    getFileSize(size) {
        return !size ? '' : size < 1024 ? size + 'B' : size < 1024 * 1024 ? (size/1024).toFixed(1) + 'KB' : (size/1024/1024).toFixed(1) + 'MB';
    }
}

module.exports = Upload;