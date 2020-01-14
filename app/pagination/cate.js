const {Pagination} = require('iijs');

class Cate extends Pagination {
    config(opts) {
        super.config({
            pageQuery: 'params',
            pageKey: 'page',
            pageSize: 10,
            urlIndex: this.$$url.build(':cate'),
            urlPage: this.$$url.build(':cate_page', {page: '${page}'}),
            ...opts
        });
        return this;
    }
}

module.exports = Cate;