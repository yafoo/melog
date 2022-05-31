const Base = require('./base');
const {utils} = require('jj.js');
const path = require('path');
const fs = require('fs');

class Upload extends Base
{
    async index() {
        const condition = {};
        const keyword = this.ctx.query.keyword;
        if(keyword) {
            condition['title'] = ['like', '%' + keyword + '%'];
        }
        const [list, pagination] = await this.$model.upload.getPageList(condition);

        this.$assign('keyword', keyword);
        this.$assign('list', list);
        this.$assign('pagination', pagination.render());
        this.$assign('callback', this.ctx.query.callback || 'callback');
        await this.$fetch();
    }

    async form() {
        const id = parseInt(this.ctx.query.id);
        let data = {};
        if(id) {
            data = await this.$model.upload.get({id});
        }

        this.$assign('data', data);
        await this.$fetch();
    }

    async save() {
        if(this.ctx.method != 'POST') {
            return this.$error('非法请求！');
        }

        const data = this.ctx.request.body;
        const id = data.id;
        const result = await this.$model.upload.save(data);

        if(result) {
            this.$success(id ? '保存成功！' : '新增成功！', 'index');
        } else {
            this.$error(id ? '保存失败！' : '新增失败！');
        }
    }

    async upload() {
        if(this.ctx.method != 'POST') {
            return this.error('非法请求！');
        }

        const limit_size = parseInt(this.site.limit_size);
        const cfg_upload = this.site.upload;
        const upload_dir = this.$config.app.static_dir + cfg_upload;
        const result = await this.$upload.file('file').validate({size: limit_size}).save(upload_dir);

        if(result) {
            const jimp = require('jimp');
            let image;
            try {
                image = await jimp.read(result.filepath);
            } catch(e) {
                await utils.fs.unlink(result.filepath);
                return this.$error(e.message);
            }
            const cfg_width = parseInt(this.site.img_width) || 0;
            const cfg_height = parseInt(this.site.img_height) || 0;

            image.quality(80);

            // 限制图片大小
            let img_path = result.filepath; //缩放图地址
            let origin_path = ''; //原图地址
            if((cfg_width && image.getWidth() > cfg_width) || (cfg_height && image.getHeight() > cfg_height)) {
                // 保留原图
                if(this.site.img_origin == 1) {
                    origin_path = this._getOri(result.filepath, result.extname);
                    fs.renameSync(result.filepath, origin_path);

                    img_path = this._getMid(img_path, result.extname);
                }
                
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
                thumb_path = this._getLit(result.filepath, result.extname);
                image.cover(thumb_width, thumb_height);
                await image.writeAsync(thumb_path);
            }

            // 添加图片水印（不知为何，水印加不上）
            // const watermark = this.site.watermark || '';
            // const watermark_path = path.join(this.$config.app.base_dir, this.$config.app.static_dir, watermark);
            // if(watermark && utils.fs.isFileSync(watermark_path)) {
            //     const image = await jimp.read(img_path);
            //     const mask = await jimp.read(watermark_path);
            //     const x = image.getWidth() - mask.getWidth() - 20;
            //     const y = image.getHeight() - mask.getHeight() - 20;
            //     if(x > 0 && y > 0) {
            //         image.mask(mask, 0, 0);
            //         await image.quality(80).writeAsync(img_path);
            //     }
            // }

            // 图片信息保存
            const data = {};
            data.user_id = this.user_id;
            data.title = result.name.replace('.' + result.extname, '');
            data.extname = result.extname;
            const save_name = '/' + result.savename;
            data.image = origin_path ? this._getMid(save_name, data.extname) : save_name;
            data.thumb = thumb_path != img_path ? this._getLit(save_name, data.extname) : data.image;
            const stats = await utils.fs.stat(img_path);
            data.size = stats.size;
            data.add_time = this.$utils.time();

            if(origin_path) {
                data.original = this._getOri(save_name, data.extname);
                const origin_stats = await utils.fs.stat(origin_path);
                data.origin_size = origin_stats.size;
            }
            
            if(await this.$model.upload.add(data)) {
                const re_data = {
                    title: data.title,
                    image: cfg_upload + data.image,
                    thumb: cfg_upload + data.thumb,
                    size: data.size,
                    extname: data.extname
                };
                this.$success('上传成功！', re_data);
            } else {
                if(utils.fs.isFileSync(img_path)) {
                    await utils.fs.unlink(img_path);
                }
                if(thumb_path != img_path && utils.fs.isFileSync(thumb_path)) {
                    await utils.fs.unlink(thumb_path);
                }
                if(origin_path && utils.fs.isFileSync(origin_path)) {
                    await utils.fs.unlink(origin_path);
                }
                this.$error('文件保存失败！', 'index');
            }
        } else {
            this.$error(this.$upload.getError(), 'index');
        }
    }

    async delete() {
        const id = parseInt(this.ctx.query.id);
        const file = await this.$model.upload.get({id});
        if(!file) {
            return this.$error('数据不存在！');
        }

        try {
            const upload_dir = path.join(this.$config.app.base_dir, this.$config.app.static_dir, this.site.upload);
            const img_path = upload_dir + file.image;
            const thumb_path = upload_dir + file.thumb;

            if(utils.fs.isFileSync(img_path)) {
                await utils.fs.unlink(img_path);
            }
            if(thumb_path != img_path && utils.fs.isFileSync(thumb_path)) {
                await utils.fs.unlink(thumb_path);
            }
            await this.$model.upload.del({id});
            
            this.$success('删除成功！', 'index');
        } catch(e) {
            this.$logger.error('删除失败：' + e.message);
            this.$error('删除失败！');
        }
    }

    // 获取缩略图名字
    _getLit(img_str, extname) {
        return img_str.replace('.' + extname, '_lit.' + extname);
    }

    // 获取缩放名字
    _getMid(img_str, extname) {
        return img_str.replace('.' + extname, '_mid.' + extname);
    }

    // 获取原图名字
    _getOri(img_str, extname) {
        if(!this._rand_str) {
            this._rand_str = this.$utils.randomString(9);
        }
        return img_str.replace('.' + extname, '_ori_' + this._rand_str + '.' + extname);
    }
}

module.exports = Upload;