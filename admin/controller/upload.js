const Base = require('./base');
const {utils} = require('jj.js');
const path = require('path');

class Upload extends Base
{
    async index() {
        const condition = {};
        const keyword = this.ctx.query.keyword;
        if(keyword !== undefined) {
            condition['title'] = ['like', '%' + keyword + '%'];
        }
        const [list, pagination] = await this.$model.upload.getPageList(condition);

        this.$assign('keyword', keyword);
        this.$assign('list', list);
        this.$assign('pagination', pagination.render());
        await this.$fetch();
    }

    async upload() {
        if(this.ctx.method != 'POST'){
            return this.error('非法请求！');
        }

        const size = parseInt(this.site.limit_size);
        const cfg_upload = this.site.upload;
        const upload_dir = this.$config.app.static_dir + cfg_upload;
        const result = await this.$upload.file('file').validate({size}).save(upload_dir);

        if(result) {
            const img_path = result.filepath;
            const jimp = require('jimp');
            const image = await jimp.read(img_path);
            const cfg_width = parseInt(this.site.img_width) || 0;
            const cfg_height = parseInt(this.site.img_height) || 0;

            image.quality(80);

            // 限制图片大小
            if((cfg_width && image.getWidth() > cfg_width) || (cfg_height && image.getHeight() > cfg_height)) {
                if(image.getWidth() > this.site.img_width && image.getWidth() / image.getHeight() > cfg_width / cfg_height) {
                    image.resize(cfg_width, jimp.AUTO);
                } else {
                    image.resize(jimp.AUTO, cfg_height);
                }
                await image.writeAsync(img_path);
            }

            // 生成缩略图
            let thumb_path = img_path;
            const thumb_width = parseInt(this.site.thumb_width) || 0;
            const thumb_height = parseInt(this.site.thumb_height) || 0;
            if((thumb_width && image.getWidth() > thumb_width) || (thumb_height && image.getHeight() > thumb_height)) {
                thumb_path = thumb_path.replace('.' + result.extname, '_lit.' + result.extname);
                image.cover(thumb_width, thumb_height);
                await image.writeAsync(thumb_path);
            }

            // 图片信息
            const stats = await utils.fs.stat(img_path);
            const data = {};
            data.user_id = this.user_id;
            data.title = result.name.replace('.' + result.extname, '');
            data.extname = result.extname;
            data.image = data.thumb = '/' + result.savename;
            if(thumb_path != img_path) {
                data.thumb = data.image.replace('.' + data.extname, '_lit.' + data.extname);
            }
            data.size = stats.size;
            
            if(await this.$model.upload.add(data)) {
                this.$success('上传成功！', cfg_upload + data.image);
            } else {
                if(utils.fs.isFileSync(img_path)) {
                    await utils.fs.unlink(img_path);
                }
                if(thumb_path != img_path && utils.fs.isFileSync(thumb_path)) {
                    await utils.fs.unlink(thumb_path);
                }
                this.$error('文件保存失败！', 'index');
            }
        } else {
            this.$error(this.$upload.getError(), 'index');
        }
    }

    async delete() {
        const id = parseInt(this.ctx.query.id);
        const file = await this.$model.upload.getOne({id});
        if(!file) {
            return this.$error('数据不存在！');
        }

        try {
            const upload_dir = path.join(this.$config.app.base_dir,this.$config.app.static_dir,this.site.upload);
            const img_path = upload_dir + file.image;
            const thumb_path = upload_dir + file.thumb;

            if(utils.fs.isFileSync(img_path)) {
                await utils.fs.unlink(img_path);
            }
            if(thumb_path != img_path && utils.fs.isFileSync(thumb_path)) {
                await utils.fs.unlink(thumb_path);
            }
            await this.$model.upload.delete({id});
            
            this.$success('删除成功！', 'index');
        } catch(e) {
            this.$error('删除失败！');
        }
    }
}

module.exports = Upload;