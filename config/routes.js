route = [
    {url: '/', path: 'index/index'},
    {url: '/article/:id.html', path: 'article/article', name: 'article'},
    {url: '/:cate/', path: 'cate/cate', name: 'cate'},
    {url: '/:cate/list_:page.html', path: 'cate/cate', name: 'cate_page'},
    {url: '/:app/:controller?/:action?', path: 'admin/auth/index', type: 'middleware'}
];

module.exports = route;