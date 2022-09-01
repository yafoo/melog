routes = [
    {url: '/', path: 'index/index'},
    {url: '/article/:id.html', path: 'article/article', name: 'article'},
    {url: '/search', path: 'search/search', name: 'search'},
    {url: '/:cate/', path: 'cate/cate', name: 'cate'}, // 会匹配到后台地址，所以程序内需执行this.$next()
    {url: '/:cate/list_:page.html', path: 'cate/cate', name: 'cate_page'},
    {url: '/special/:id.html', path: 'special/special', name: 'special'},
    {url: '/:app/:controller?/:action?', path: 'admin/auth/index', type: 'middleware'} // 后台登录验证
];

module.exports = routes;