const Base = require('./base');

class Index extends Base {
    async index() {
        const list = await this.$model.article.getListWithCate();

        const friend = [
            {title: '雅赋网', url: 'https://www.yafu.me/'},
            {title: '爱主页', url: 'https://www.i-i.me/'},
            {title: 'IIJS', url: 'https://js.i-i.me/'}
        ]
        
        this.assign('list', list);
        this.assign('friend', friend);
        await this.fetch();
    }
}

module.exports = Index;