import sqlite3 from 'sqlite3'
interface sqlParams {
    [key: string]: unknown
}
interface sqlObject {
    [key: string]: unknown
}
interface sqlResult {
    status: boolean;
    data?: sqlParams;
    aAffectedRows: number;
    insertLastId?: string;
}


enum queryMode {
    run,
    get,
    all,
}
class coreSqlite {

    db!: sqlite3.Database;
    sqlLinker = '@';
    debugStatus = false;

    async connection(dbPath: string) {
        this.db = await new sqlite3.Database(dbPath);
    }

    setSqlLinker(_linker: string) {
        this.sqlLinker = _linker;
    }


    dbRun(_sql: string, _params: sqlParams = {}, _mode: queryMode = queryMode.all) {
        const params: sqlParams = {};
        for (const key in _params) {
            if (key[0] !== this.sqlLinker) {
                params[this.sqlLinker + key] = _params[key];
            } else {
                params[key] = _params[key];
            }
        }
        return new Promise((resolve, reject) => {
            if (this.debugStatus) {
                console.log(_sql, params);
            }
            if (_mode == queryMode.all) {
                this.db.all(_sql, params, function (err, res) {
                    (!err) ? resolve(res) : reject(err);
                })
            } else if (_mode == queryMode.get) {
                this.db.get(_sql, params, function (err, res) {
                    (!err) ? resolve(res) : reject(err);
                })
            } else {
                this.db.run(_sql, params, function (err) {
                    (!err) ? resolve(true) : reject(err);
                })
            }
            //console.log(_sql, params);
        }).catch((e) => {
            console.log(_sql);
            console.error('dbRun error', e, _sql, params, _mode)
        });
    }

    async beginTrans() {
        return await this.dbRun('BEGIN TRANSACTION;');
    }

    async commit() {
        return await this.dbRun('COMMIT;');
    }

    async rollback() {
        return await this.dbRun('ROLLBACK;');
    }
    async ExecArray(sql: string, params: sqlParams = {}) {
        return await this.dbRun(sql, params);
    }
    async ExecDict(sql: string, params: sqlParams = {}) {
        //sql += ' limit 1';
        return await this.dbRun(sql, params, queryMode.get);
    }
    async ExecScalar(sql: string, params: sqlParams = {}) {
        const result = await this.ExecDict(sql, params);
        if (!result) return undefined;

        return Object.values(result as object)[0];
    }
    async ExecRun(sql: string, params: sqlParams = {}) {
        return await this.dbRun(sql, params, queryMode.run);
    }


    async GetInsertLastId(tableName: string) {
        const sql = "select seq from sqlite_sequence where name='" + tableName + "'";
        return await this.ExecScalar(sql);
    }
    async GetAffectedRows() {
        const sql = "select changes()";
        return await this.ExecScalar(sql);
    }

    getSelectSql(fields: Array<string> | string, tableName: string, where: string | null): string {
        const _fields = (fields == '*' || fields == '' || fields == null) ? '*' : ((fields.constructor === Array) ? fields.join(',') : fields);
        const _where = ((where == null || where == '') ? '' : ' WHERE ' + where);
        return 'SELECT ' + _fields + ' FROM ' + tableName + _where;
    }

    async select(fields: Array<string> | string, tableName: string, where: string | null = null, whereData: sqlParams = {}) {
        return await this.ExecArray(this.getSelectSql(fields, tableName, where), whereData)
    }
    async find(fields: Array<string> | string, tableName: string, where: string | null = null, whereData: sqlParams = {}) {
        return await this.ExecDict(this.getSelectSql(fields, tableName, where), whereData)
    }
    async findField(fields: Array<string> | string, tableName: string, where: string | null = null, whereData: sqlParams = {}) {
        return await this.ExecScalar(this.getSelectSql(fields, tableName, where), whereData)
    }

    async insert(table: string, fieldData: sqlParams, onlyField: string | undefined = undefined, insertLastId = false): Promise<sqlResult> {
        let sql;
        const insertData = [];
        for (const key in fieldData) {
            if (Array.isArray(fieldData[key])) {
                switch ((fieldData[key] as Array<string>)[1]) {
                    case 'fun':
                        insertData.push((fieldData[key] as Array<unknown>)[0]);
                        break;
                }
            } else {
                insertData.push(this.sqlLinker + key);
            }
        }
        sql = 'INSERT INTO `' + table + '` (' + Object.keys(fieldData).join(',') + ')';
        if (onlyField == undefined) {
            sql += ' VALUES (' + insertData.join(',') + ')';
        } else {
            sql += ' SELECT ' + insertData.join(',') + ' FROM dual where not exists (SELECT ' + onlyField + ' FROM ' + table + ' WHERE ' + onlyField + ' = :' + onlyField + ')';
        }
        const insertRd = await this.ExecRun(sql, fieldData);

        const insertResultData: sqlResult = {
            status: insertRd as boolean,
            data: fieldData,
            aAffectedRows: await this.GetAffectedRows() as number,
            insertLastId: (insertLastId ? await this.GetInsertLastId(table) : undefined) as string,
        }
        return insertResultData;
    }

    async update(table: string, fieldData: sqlObject, where: string | undefined = undefined, whereData: sqlParams = {}, onlyField: string | undefined = undefined): Promise<sqlResult> {
        const _updateResult: sqlResult = {
            status: false,
            aAffectedRows: 0,
        }
        if (where == undefined || where == '') return _updateResult;
        const sqli = [];
        const sqlFieldData: sqlParams = {};
        for (const key in fieldData) {
            if (fieldData[key] instanceof Array) {
                const item = (fieldData[key] as Array<string>);
                switch (item[1]) {
                    case 'fun':
                    case 'sql':
                        sqli.push(key + '=' + item[0]);
                        break;
                    case 'ass':
                        sqlFieldData[key] = item[0];
                        sqli.push(key + '=' + key + ' + ' + this.sqlLinker + key);
                        break;
                    case 'decimal':
                        sqlFieldData[key] = item[0];
                        sqli.push(key + '=' + key + ' + cast(' + this.sqlLinker + key + ' as decimal(10,2))');
                        break;

                }
            } else {
                sqlFieldData[key] = fieldData[key] as string;
                sqli.push(key + '=' + this.sqlLinker + key);
            }
        }
        let sql = 'UPDATE ' + table + ' SET ' + sqli.join(',') + ' WHERE ' + where;
        if (onlyField != undefined) {
            sql += ' and not exists (SELECT ' + onlyField + ' FROM (SELECT ' + onlyField + ' FROM `' + table + '` WHERE ' + onlyField + '=:' + onlyField + ')';
        }
        for (const key in whereData) {
            sqlFieldData[key] = whereData[key];
        }
        const rd = await this.ExecRun(sql, sqlFieldData);
        _updateResult.status = rd as boolean;
        _updateResult.aAffectedRows = await this.GetAffectedRows() as number;
        return _updateResult;
    }
    async delete(table: string, where: string | undefined = undefined, whereData: sqlParams = {}): Promise<sqlResult> {
        const _deleteResult: sqlResult = {
            status: false,
            aAffectedRows: 0,
        }
        if (where == undefined || where == '') return _deleteResult;
        const sql = 'DELETE FROM ' + table + ' WHERE ' + where;
        const rd = await this.ExecRun(sql, whereData);
        _deleteResult.status = rd as boolean;
        _deleteResult.aAffectedRows = await this.GetAffectedRows() as number;
        return _deleteResult;
    }

    async getFields(table: string): Promise<string[]> {
        const results = await this.dbRun("PRAGMA table_info('@table')", { table: table }) as Array<sqlParams>;
        return results.map(row => row.name as string);
    }
}

export { coreSqlite, sqlParams, sqlResult, queryMode }
