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

/**
 * 按父子孙分级整理
 * @param list
 * @param int pid
 * @return array
 */
function toTreeArray(list, pid=0){
    const arr = [];
    list.forEach(v => {
        if(v.pid == pid){
            v.child = toTreeArray(list, v.id);
            arr.push(v);
        }
    });
    return arr;
}

/**
 * 按父子孙平级排列
 * @param list
 * @param int pid
 * @param int level
 * @return array
 */
function toTree(list, pid=0, level=0) {
    let arr = [];
    list.forEach(v => {
        if(v.pid == pid){
            v.level = level + 1;
            arr.push(v);
            arr = arr.concat(toTree(list, v.id, level + 1));
        }
    });
    return arr;
}

/**
 * @getIP
 * @desc 获取用户 ip 地址
 * @param {Object} req - 请求
 */
function getIP(req) {
    return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
        req.connection.remoteAddress || // 判断 connection 的远程 IP
        req.socket.remoteAddress || // 判断后端的 socket 的 IP
        req.connection.socket.remoteAddress;
}

module.exports = {randomString, toTreeArray, toTree, getIP}