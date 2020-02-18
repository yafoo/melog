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

module.exports = {randomString, toTreeArray, toTree}