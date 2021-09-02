const {Pagination} = require('jj.js');

class Search extends Pagination
{
    init(opts) {
        super.init({
            pageSize: 10,
            ...opts
        });
        return this;
    }
}

module.exports = Search;