const Base = require('./base');
const md = require('markdown-it')({html: true});

class Special extends Base
{
    async _init() {
        const id = this.ctx.params.id;
        if((this._sp_id = parseInt(id)) != id) {
            this._sp_dir = id;
        }

        // 参数为空
        if(!this._sp_id && !this._sp_dir) {
            return false;
        }

        await super._init();
    }

    async special() {
        const condition = {};
        if(this._sp_dir) {
            condition.sp_dir = this._sp_dir;
        } else {
            condition.id = this._sp_id;
        }

        const special = await this.$model.special.getSpecialInfo(condition);
        if(!special) return;
 
        const special_item = await this.$model.specialItem.specialItemList(special.id, 1);
        const special_modules = [];
        let map_data = {};
        special_item.forEach(item => {
            if(!~special_modules.indexOf(item.type)) {
                special_modules.push(item.type);
            }
            if(item.type == 'markdown') {
                item.data.content = md.render(item.data.content);
            }
            if(item.type == 'map') {
                map_data[item.id] = item.data;
            }
        });
        map_data = JSON.stringify(map_data);

        this.$assign('title', (special.seo_title || special.title) + ' - ' + this.site.webname);
        this.$assign('description', special.description);
        this.$assign('keywords', special.keywords);

        this.$assign('special', special);
        this.$assign('special_item', special_item);
        this.$assign('special_modules', special_modules);
        this.$assign('map_data', map_data);

        this.$assign('map_ak', this.site.map_ak);
        
        await this.$fetch();
    }
}

module.exports = Special;