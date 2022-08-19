const {Controller} = require('jj.js');

class Base extends Controller
{
    async _init() {
        // 文章模型
        const model_article = this.$model.article;

        // 站点配置、最新、热门列表、底部链接、顶部专题列表
        const [site_config, latest, hot, foot_links, special_list] = await Promise.all([
            this.$model.site.getConfig(),
            model_article.getNew(),
            model_article.getHot(),
            this.$model.link.getFootLinks(),
            this.$model.special.getTopList()
        ]);

        // 顶部导航
        let nav_list = [];
        if(site_config.style == 'cms') {
            nav_list = await this.$model.cate.getNavList();
            nav_list.forEach(item => {
                item.nav_url = this.$url.build(':cate', {cate: item.cate_dir});
                item.nav_name = item.cate_name;
            });
        } else if(site_config.style == 'blog') {
            nav_list = await this.$model.link.getNavLinks();console.log(nav_list);
            nav_list.forEach(item => {
                item.nav_url = item.url;
                item.nav_name = item.title;
            });
        }

        this.$assign('site', this.site = site_config);
        this.$assign('title', this.site.webname);
        this.$assign('description', this.site.description);
        this.$assign('keywords', this.site.keywords);
        this.$assign('nav_list', nav_list);
        this.$assign('latest', latest);
        this.$assign('hot', hot);
        this.$assign('foot_links', foot_links);
        this.$assign('special_list', special_list);
    }

    // 支持更换模板主题
    async $fetch(template) {
        const content = await this.$view.setFolder(this.site.theme).fetch(template);
        this.$show(content);
    }
}

module.exports = Base;