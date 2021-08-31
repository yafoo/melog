const app = {
    app_debug: true, //调试模式
    app_multi: true, //是否开启多应用

    default_app: 'app', //默认应用
    default_controller: 'index', //默认控制器
    default_action: 'index', //默认方法

    common_app: 'admin', //公共应用，存放公共模型及逻辑
    controller_folder: 'controller', //控制器目录名

    static_dir: './public', //静态文件目录，相对于应用根目录，为空或false时，关闭静态访问

    koa_body: {} //koa-body配置参数，为false时，关闭koa-body
}

module.exports = app;