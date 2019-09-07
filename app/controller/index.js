const {Controller} = require('iijs');

class index extends Controller {
    async index() {
        let readme = await this.view.load('README.md', true);
        readme = this.view.md.render(readme);
        readme = readme.replace('</p>', '</p><hr>');
        this.assign('title', 'iijs - 一个简单轻量级Node.js MVC框架');
        this.assign('readme', readme);
        await this.fetch();
    }

    async doc() {
        this.assign('title', 'iijs文档手册 - iijs');
        await this.fetch();
    }

    async hello() {
        await this.display(`<div style="font-size:50px;">hello iijs, hello world !</div>`);
    }

    async mysql() {
        const db = this.ctx.loader.config.db;
        await db('select * from link').then(function(data){
            this.ctx.body = data;
        }).catch(function(err){
            console.log(err);
            this.ctx.body = data;
        });
    }
}

module.exports = index;