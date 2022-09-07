routes = [
    {url: '/', path: 'index/index'},
    {url: '/article/:id.html', path: 'article/article', name: 'article'},
    {url: '/search', path: 'search/search', name: 'search'},
    {url: '/special/:id.html', path: 'special/special', name: 'special'},
    {url: '/:cate((?!admin|install)[^/]+)/', path: 'cate/cate', name: 'cate'}, // 会匹配到自定义后台地址，所以程序内需执行this.$next()
    {url: '/:cate((?!admin|install)[^/]+)/list_:page.html', path: 'cate/cate', name: 'cate_page'},
    {url: '/:app((?!install)[^/]+)/:controller?/:action?', path: 'admin/auth/index', type: 'middleware'} // 后台验证中间件
];

module.exports = routes;