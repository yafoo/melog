const {utils} = require('iijs');
const dateFormat = (value, format) => utils.date.format(format, value);
const urlC = (folder) => `/${folder}/`;
const urlA = (id) => `/article/${id}.html`;
function randomString(len) {
　　len = len || 32;
　　var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
　　var maxPos = $chars.length;
　　var pwd = '';
　　for (i = 0; i < len; i++) {
　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
}

module.exports = {dateFormat, urlC, urlA, randomString,
    view_filter: {dateFormat, urlC, urlA}
}