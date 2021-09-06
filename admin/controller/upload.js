const Base = require('./base');

class Upload extends Base {
    async index() {
        const condition = {};
        const keys = this.ctx.query.keys;
        if(keys !== undefined) {
            condition['concat(user_id,title,url)'] = ['like', '%' + keys + '%'];
        }
        const [total, list] = await this.$model.upload.getPageList(condition);
        const pagination = total ? this.$$pagination.render(total) : '';
        this.assign('keys', keys);
        this.assign('list', list);
        this.assign('pagination', pagination);
        await this.fetch();
    }

    async upload() {
        if(this.ctx.method != 'POST'){
            return this.error('非法请求！');
        }

        const size = parseInt(this.site.limit_size);
        const cfg_upload = this.site.upload;
        const result = await this.$$upload.file('file').validate({size}).save(this.$.config.app.static_dir + cfg_upload);
        if(result) {
            const filepath = result.filepath;
            const jimp = require('jimp');
            const image = await jimp.read(filepath);
            const cfg_width = parseInt(this.site.img_width);
            const cfg_height = parseInt(this.site.img_height);
            if(image.getWidth() > cfg_width || image.getHeight() > cfg_height) {
                if(image.getWidth() > this.site.img_width && image.getWidth() / image.getHeight() > cfg_width / cfg_height) {
                    await image.resize(cfg_width, jimp.AUTO);
                } else {
                    await image.resize(jimp.AUTO, cfg_height);
                }
                await image.writeAsync(filepath);
            }
            const lit_filepath = filepath.replace('.' + result.extname, '_lit.' + result.extname);
            const lit_img_width = parseInt(this.site.thumb);
            await image.resize(lit_img_width, jimp.AUTO);
            await image.writeAsync(lit_filepath);

            const stats = await this.$$utils.fs.stat(filepath);
            const data = {};
            data.user_id = this.user_id;
            data.title = result.name.replace('.' + result.extname, '');
            data.extname = result.extname;
            data.url = result.savename.replace('.' + data.extname, '_lit.' + data.extname);
            data.size = stats.size;
            
            if(await this.$model.upload.add(data)) {
                this.success('上传成功！', cfg_upload + '/' + data.url);
            } else {
                await this.$$utils.fs.unlink(filepath);
                await this.$$utils.fs.unlink(lit_filepath);
                this.error('文件保存失败！', 'index');
            }
        } else {
            this.error(this.$$upload.getError(), 'index');
        }
    }

    async delete() {
        const id = parseInt(this.ctx.query.id);
        const file = await this.$model.upload.getOne({id});
        if(!file) {
            return this.error('数据不存在！');
        }

        try {
            const lit_filepath = this.$.$map.path + this.$.config.app.static_dir + this.site.upload + '/' + file.url;
            const filepath = lit_filepath.replace('_lit.', '.');
            await this.$$utils.fs.unlink(filepath);
            await this.$$utils.fs.unlink(lit_filepath);
            await this.$model.upload.delete({id});
            this.success('删除成功！', 'index');
        } catch(e) {
            this.error('删除失败！');
        }
    }

    async base64() {
        this.$success({url: 'https://upload.jianshu.io/users/upload_avatars/6860761/b343643c-5ced-4421-ab58-1274e7bfe704?imageMogr2/auto-orient/strip|imageView2/1/w/96/h/96/format/webp'});
    }
}

module.exports = Upload;