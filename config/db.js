const mysql = require('mysql');
const pool = mysql.createPool({
  host     : '127.0.0.1',   // 数据库地址
  user     : 'root',    // 数据库用户
  password : 'root',   // 数据库密码
  database : 'iijs'  // 选中数据库
});

let db = function(sql){
	return new Promise((resolve, reject)=>{
		pool.query(sql, function(err, rows, fields){
			if(err){
				reject(err);
			}else{
				resolve(rows);
			}
		});
  })
}

module.exports = db;
