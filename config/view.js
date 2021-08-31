const view = {
    view_depr: '_', // 模版文件名分割符，'/'代表二级目录
    view_filter: {
        Date,
        dateFormat: (value, format) => require('jj.js').utils.date.format(format, value)
    }
}

module.exports = view;