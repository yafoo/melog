const {Pagination} = require('iijs');

class Cate extends Pagination {
    config(opts) {
        super.config({pageQuery: 'params', pageKey: 'page', pageSize: 10, ...opts});
        return this;
    }
}

module.exports = Cate;