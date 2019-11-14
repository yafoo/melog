let handle;

class Base {
    constructor(ctx, next) {
        this.ctx = ctx;
        this.next = next;
        this._cfg = this.ctx.$ii.config.db;
        this._sql = {};
        this.connect(this._cfg.type);
    }

    connect(type) {
        if(type == 'mysql') {console.log(this._cfg);
            if(!handle) {
                const mysql = require('mysql');
                handle = mysql.createPool({
                    host     : this._cfg.host,
                    user     : this._cfg.user,
                    password : this._cfg.password,
                    database : this._cfg.database
                });
            }
        } else {
            // other database
        }
        return this;
    }

    async query(sql) {
        return new Promise((resolve, reject)=>{
            handle.getConnection(function(err, connection) {
                if(err) {
                    console.log('MySQL数据库建立连接失败。');
                    reject(err);
                } else {
                    console.log('MySQL数据库建立连接成功。');
                    connection.query(sql, function(err, data){
                        if(err){
                            console.log('数据操作失败，SQL：' + sql);
                            reject(err);
                        }else{
                            resolve(data);
                            handle.end();
                        }
                    });
                }
            });
        });
    }

    table(table) {
        this._sql.table = table;
        return this;
    }

    name(name) {
        this._sql.table = this._cfg.prefix + name;
        return this;
    }

    where(where) {
        if(!where) {
            return this;
        }
        this._sql.where || (this._sql.where = {});
        Object.keys(where).forEach(key => {
            this._sql.where[key] = where[key];
        });
        return this;
    }

    data(data) {
        if(!data) {
            return this;
        }
        this._sql.data || (this._sql.data = {});
        Object.keys(data).forEach(key => {
            this._sql.data[key] = data[key];
        });
        return this;
    }

    field(field) {
        if(!field) {
            return this;
        }
        this._sql.field || (this._sql.field = []);
        this._sql.field.concat(field.split(',').map(value=>value.trim()));
        return this;
    }

    order(field, order) {
        if(!field) {
            return this;
        }
        this._sql.order || (this._sql.order = []);
        if(typeof field == 'string') {
            if(~field.indexOf(',')) {
                [field, order] = field.split(',');
            }
            const obj = {};
            obj[field] = order;
            this._sql.order.push(obj);
        }
        return this;
    }

    limit(offset=0, length=0) {
        if(typeof offset == 'string') {
            [offset, length] = first.split(',');
        }
        offset = parseInt(offset);
        length = parseInt(length);
        this._sql.limit = offset + (length ? ',' + length : '');
        return this;
    }

    async page() {
        //
        return this;
    }

    async select(condition) {
        if(condition) {
            this._sql.where = condition;
        }
        const table = this._sql.table;
        const where = this._parseWhere();
        const fields = this._sql.field ? this._sql.field.join(',') : '*';
        let order = '';
        this._sql.order && this._sql.order.forEach(item => {
            order += (order ? ',' : '') + item.field + ' ' + item.order;
        });
        order && (order = 'order by ' + order);
        const limit = this._sql.limit;
        return await this.query(`select ${fields} from ${table} ${where} ${order} ${limit}`);
    }

    async insert(data) {
        if(data) {
            this._sql.data = data;
        }
        const table = this._sql.table;
        const fields = Object.keys(this._sql.data || {}).join(',');
        const values = Object.values(this._sql.data || {}).join(',');
        return await this.query(`insert into ${table} (${fields}) values (${values})`);
    }

    async update(data, condition) {
        if(data) {
            this._sql.data = data;
        }
        if(condition) {
            this._sql.where = condition;
        }
        const table = this._sql.table;
        let data = '';
        this._sql.data && Object.keys(this._sql.data).forEach(key => {
            data += (data ? ',' : '') + key + '=' + this._sql.data[key];
        });
        const where = this._parseWhere();
        return await this.query(`update ${table} set ${data} where ${where}`);
    }

    async delete(condition) {
        if(condition) {
            this._sql.where = condition;
        }
        const table = this._sql.table;
        const where = this._parseWhere();
        return await this.query(`delete from ${table} where ${where}`);
    }

    async count() {
        //
    }

    async max() {
        //
    }

    async min() {
        //
    }

    async avg() {
        //
    }

    async sum() {
        //
    }

    _parseWhere() {
        const where = '';
        this._sql.where && Object.keys(this._sql.where).forEach(key => {
            where += (where ? ' and ' : '') + key + '=' + this._sql.where[key];
        });
        return where;
    }
}

module.exports = Base;