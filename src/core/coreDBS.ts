import { coreCreateGuid, ECoreGuidType } from './coreGuid'
import { coreSqlite, sqlParams, queryMode, sqlResult } from "./coreSqlite";

enum linkMode {
    and = 'and',
    or = 'or'
}

enum likeMode {
    LR = 'LR',
    L = 'L',
    R = 'R'
}

enum typeMode {
    field = 'field',
    group = 'group',
    sql = 'sql',
    in = 'in',
    insql = 'insql',
    dateRange = 'dateRange',
    valueRange = 'valueRange',
    today = 'today',
    like = 'like'
}

enum joinMode {
    left = 'left',
    right = 'right',
    inner = 'inner'
}

enum ECreateUpdateTime {
    timeStamp = 'timeStamp',
    dateTime = 'dateTime',
    date = 'date',
}

enum EexecType {
    select = 'select',
    find = 'find',
    findField = 'findField',
}

interface ICreateGuid {
    type: ECoreGuidType;
    field: string;
}

interface ICreateUpdateTime {
    type: ECreateUpdateTime;
    field: string;
}

interface IWhereData {
    type: typeMode;
    field?: string;
    condition?: string | null;
    value?: unknown;
    link?: linkMode;
    tableName?: string | null;

    sql?: string;
    arrIn?: Array<string>;

    startDateField?: string;
    endDateField?: string;
    startDate?: string;
    endDate?: string;
    mode?: boolean;
    random_1?: string;
    random_2?: string;

    direction?: likeMode;
    random?: number;


    startSymbol?: string;
    startValue?: number | string;
    endSymbol?: string;
    endValue?: number | string;
}


interface IJoinData {
    type: joinMode,
    tableName: string,
    whereStr: string
}
interface IOrderData {
    field: string;
    mode: string;
    tableName: string | null;
}
interface IGroupData {
    field: string;
    tableName: string | null;
}
interface ILimit {
    page: number;
    limit: number;
}

interface IConditions {
    [key: string]: unknown;
}


class coreDBS {
    CoreDb!: coreSqlite;
    sqlLinker = '@';
    transactionID = undefined as undefined | string;

    fieldsData: Array<string> = [];
    fieldSqlArray: Array<string> = [];
    tablseName: string | null = null;
    whereArray: Array<IWhereData> = [];
    joinArray: Array<IJoinData> = [];
    orderArray: Array<IOrderData> = [];
    groupArray: Array<IGroupData> = [];
    limitData: ILimit | null = null;

    createGuidObj: ICreateGuid | null = null;
    createTimeObj: ICreateUpdateTime | null = null;
    updateTimeObj: ICreateUpdateTime | null = null;

    whereObj: sqlParams = {};

    noWhereStatus = false;

    random: number = Math.round(Math.random() * 100000);
    inSqlStrBaseNum = 0;

    init() {
        this.fieldsData = [];
        this.fieldSqlArray = [];
        this.tablseName = null;
        this.whereArray = [];
        this.joinArray = [];
        this.orderArray = [];
        this.groupArray = [];
        this.limitData = null;
        this.inSqlStrBaseNum = 0;

        this.whereObj = {};

        this.createTimeObj = null;
        this.updateTimeObj = null;

        this.noWhereStatus = false;

    }
    setCoreDb(_coreDb: coreSqlite) {
        this.CoreDb = _coreDb;
        this.CoreDb.setSqlLinker(this.sqlLinker);
    }

    //开启事务
    async beginTrans() {
        const tID = 'transactionID' + Math.round(Math.random() * 100000);
        if (this.transactionID == undefined) {
            await this.CoreDb.beginTrans();
            this.transactionID = tID;
        }
        return tID;
    }
    //提交事务
    async commit(_transactionID: string) {
        if (_transactionID == this.transactionID) {
            await this.CoreDb.commit();
            this.transactionID = undefined;
            return true;
        }
        return false;
    }
    //回滚事务
    async rollback() {
        await this.CoreDb.rollback();
        this.transactionID = undefined;
    }


    //执行sql语句
    async sqlRun(sql: string, params: sqlParams | undefined = undefined) {
        const rd = await this.CoreDb.dbRun(sql, params, queryMode.run);
        if (rd) {
            return await this.CoreDb.GetAffectedRows();
        } else {
            return null;
        }
    }

    async getList(_execType = EexecType.select) {
        return await this.dbList(
            this.getTable(),
            this.getField(),
            this.getWhereCombination(),
            this.getGroup() + this.getOrder() + this.getPaging(),
            this.whereObj,
            true,
            _execType
        );
    }
    async getFind() {
        return await this.getList(EexecType.find);
    }
    async getFindField() {
        return await this.getList(EexecType.findField);
    }
    async getCount() {
        return await this.dbCount(
            this.getTable(),
            this.getWhereCombination(),
            this.whereObj,
        );
    }

    async getInfo(_id: string | number, _field = '*', _primary = 'id') {
        const whereStr = _primary + ' = ' + this.sqlLinker + _primary;
        const whereObj: sqlParams = {}
        const key = this.sqlLinker + _primary;
        whereObj[key] = _id;
        const rd = this.CoreDb.find(_field, this.getTable(), whereStr, whereObj);
        this.clear();
        return rd;
    }

    async find(_conditions: IConditions, _field = '*') {
        const whereStrArr = [];
        const whereObj: sqlParams = {};
        for (const key in _conditions) {
            whereObj[key] = _conditions[key];
            whereStrArr.push(key + '=' + this.sqlLinker + key);
        }
        const rd = this.CoreDb.find(_field, this.getTable(), whereStrArr.join(' and '), whereObj);
        this.clear();
        return rd;
    }
    //成功返回ID，失败返回null
    async create(_infoObj: IConditions): Promise<sqlResult | undefined> {

        if (this.createGuidObj != null && _infoObj[this.createGuidObj.field] == undefined) {
            _infoObj[this.createGuidObj.field] = this.getGuid(this.createGuidObj.type)
        }
        if (this.createTimeObj != null && _infoObj[this.createTimeObj.field] == undefined) {
            _infoObj[this.createTimeObj.field] = this.getTime(this.createTimeObj.type)
        }
        const rd = this.CoreDb.insert(this.getTable(), _infoObj);
        this.clear();
        return rd;
    }
    //成功返回受影响行数，失败返回null
    async update(_id: string | number, _updateObj: IConditions, _primary = 'id'): Promise<sqlResult | undefined> {
        const whereStr = _primary + ' = ' + this.sqlLinker + _primary;
        const whereObj: sqlParams = {}
        whereObj[this.sqlLinker + _primary] = _id;

        if (this.updateTimeObj != null && _updateObj[this.updateTimeObj.field] == undefined) {
            _updateObj[this.updateTimeObj.field] = this.getTime(this.updateTimeObj.type);
        }

        const rd = await this.CoreDb.update(this.getTable(), _updateObj, whereStr, whereObj);
        this.clear();
        return rd;
    }

    async updeteWhere(_updateObj: IConditions): Promise<sqlResult | undefined> {
        const whereStr = this.getWhere();
        const whereObj = this.whereObj;
        if (this.updateTimeObj != null && _updateObj[this.updateTimeObj.field] == undefined) {
            _updateObj[this.updateTimeObj.field] = this.getTime(this.updateTimeObj.type);
        }
        const rd = await this.CoreDb.update(this.getTable(), _updateObj, whereStr, whereObj);
        this.clear();
        return rd;
    }

    async delete(_id: string | number, _primary = 'id'): Promise<sqlResult | undefined> {
        const whereStr = _primary + ' = ' + this.sqlLinker + _primary;
        const whereObj: sqlParams = {}
        whereObj[_primary] = _id;
        const rd = await this.CoreDb.delete(this.getTable(), whereStr, whereObj);
        this.clear();
        return rd;
    }

    async deleteWhere(): Promise<sqlResult | undefined> {
        const whereStr = this.getWhere();
        const whereObj = this.whereObj;
        if (whereStr == '') {
            this.clear();
            return { status: false } as sqlResult
        }
        const rd = await this.CoreDb.delete(this.getTable(), whereStr, whereObj);
        this.clear();
        return rd;
    }

    //获取时间
    getTime(_type: ECreateUpdateTime) {

        function gDt() {
            const now = new Date();
            const y = now.getFullYear();
            const m = now.getMonth() + 1;
            const d = now.getDate();

            const h = now.getHours();
            const i = now.getMinutes();
            const s = now.getSeconds();
            return {
                date: y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d),
                time: (h < 10 ? '0' + h : h) + ':' + (i < 10 ? '0' + i : i) + ':' + (s < 10 ? '0' + s : s),
            }
        }

        if (_type == ECreateUpdateTime.timeStamp) {
            return Date.now();
        } else if (_type == ECreateUpdateTime.dateTime) {
            const g = gDt();
            return g.date + ' ' + g.time;
        } else if (_type == ECreateUpdateTime.date) {
            const g = gDt();
            return g.date;
        }
    }

    getGuid(_type: ECoreGuidType): string {
        return coreCreateGuid(_type);
    }

    createGuid(_field = 'id', _type = ECoreGuidType.nanoid) {
        this.createGuidObj = {
            type: _type,
            field: _field
        }
        return this;
    }

    //创建时，设置创建与更新的时间
    createTime(_field = 'addTime', _type = ECreateUpdateTime.dateTime) {
        this.createTimeObj = {
            type: _type,
            field: _field
        }
        return this;
    }
    //更新时，设置创建与更新的时间
    upDateTime(_field = 'updateTime', _type = ECreateUpdateTime.dateTime) {
        this.updateTimeObj = {
            type: _type,
            field: _field
        }
        return this;
    }

    debug() {
        this.CoreDb.debugStatus = true;
        return this;
    }

    table(_tableName: string) {
        this.tablseName = _tableName;
        return this;
    }
    fields(_fields: Array<string> | string) {
        if (_fields instanceof Array) {
            this.fieldsData = this.fieldsData.concat(_fields);
        } else {
            this.fieldsData.push(_fields);
        }
        return this;
    }
    fieldSql(sql: string) {
        this.fieldSqlArray.push(sql);
        return this;
    }
    noWhere(s = true) {
        this.noWhereStatus = s;
        return this;
    }
    where(_field: string, _condition: string, _value: string, _link: linkMode = linkMode.and, _tableName: string | null = null) {
        this.whereArray.push({
            type: typeMode.field,
            field: _field,
            condition: _condition,
            value: _value,
            link: _link,
            tableName: _tableName,
        });
        this.whereObj[_field] = _value;
        return this;
    }
    whereGroup(_fieldArr: Array<{ filed: string, condition: string, value: unknown, link: string }>, _link: linkMode = linkMode.and) {

        _fieldArr.forEach(item => {
            const boxName = 'wg_' + item.filed + '_' + this.getRandom();
            this.whereObj[boxName] = item.value;
            item.value = boxName;
        })

        this.whereArray.push({
            type: typeMode.group,
            value: _fieldArr,
            link: _link,
        });
        return this;
    }
    whereSql(_sql: string, _parameterObj = {}, _link = linkMode.and) {
        this.whereArray.push({
            type: typeMode.sql,
            sql: _sql,
            link: _link
        });
        for (const key in _parameterObj) {
            this.whereObj[key] = (_parameterObj as sqlParams)[key];
        }
        return this;
    }
    whereIn(_field: string, _arrIn: Array<string>, _link: linkMode = linkMode.and, _tableName: string | null = null) {
        this.whereArray.push({
            type: typeMode.in,
            field: _field,
            arrIn: _arrIn,
            link: _link,
            tableName: _tableName,
        });
        return this;
    }
    whereInSql(_field: string, _sql: string, _link = linkMode.and) {
        this.whereArray.push({
            type: typeMode.insql,
            field: _field,
            sql: _sql,
            link: _link
        });
        return this;
    }
    //用法(age,'>',10,'<',20); 即 age大于10小于20
    whereRange(_field: string, _startSymbol: string, _startValue: number | string, _endSymbol: string, _endValue: number | string, _link: linkMode = linkMode.and) {
        const _random_1 = this.getRandom();
        const _random_2 = this.getRandom();
        this.whereArray.push({
            type: typeMode.valueRange,
            field: _field,
            startSymbol: _startSymbol,
            startValue: _startValue,
            endSymbol: _endSymbol,
            endValue: _endValue,
            link: _link,
            random_1: _random_1.toString(),
            random_2: _random_2.toString(),
        });
        const _fieldWhere = _field.replace('.', '');
        this.whereObj[_fieldWhere + _random_1] = _startValue;
        this.whereObj[_fieldWhere + _random_2] = _endValue;
        return this;
    }
    whereDateRange(_startDateField: string, _endDateField: string, _startDate: string, _endDate: string, _link: linkMode = linkMode.and, _mode = true) {
        const _random_1 = this.getRandom();
        const _random_2 = this.getRandom();
        this.whereArray.push({
            type: typeMode.dateRange,
            startDateField: _startDateField,
            endDateField: _endDateField,
            startDate: _startDate,
            endDate: _endDate,
            link: _link,
            mode: _mode,
            random_1: _random_1.toString(),
            random_2: _random_2.toString(),
        });
        this.whereObj[_startDateField + _random_1] = _startDate + (_mode ? ' 00:00:00' : '');
        this.whereObj[_endDateField + _random_2] = _endDate + (_mode ? ' 23:59:59' : '');
        return this;
    }
    whereDateToday(_field: string, _link: linkMode = linkMode.and) {
        this.whereArray.push({
            type: typeMode.today,
            field: _field,
            link: _link,
        });
        return this;
    }
    whereLike(_field: string, _value: string, _direction: likeMode = likeMode.LR, _link: linkMode = linkMode.and) {
        const _random = this.getRandom();
        this.whereArray.push({
            type: typeMode.like,
            field: _field,
            value: _value,
            direction: _direction,
            link: _link,
            random: _random
        });
        this.whereObj[_field + _random] = ((_direction == likeMode.LR || _direction == likeMode.L) ? '%' : '') + _value + ((_direction == likeMode.LR || _direction == likeMode.R) ? '%' : '');
        return this;
    }
    leftJoin(_tableName: string, _whereStr: string) {
        this.joinArray.push({
            type: joinMode.left,
            tableName: _tableName,
            whereStr: _whereStr
        });
        return this;
    }
    rightJoin(_tableName: string, _whereStr: string) {
        this.joinArray.push({
            type: joinMode.right,
            tableName: _tableName,
            whereStr: _whereStr
        });
        return this;
    }
    innerJoin(_tableName: string, _whereStr: string) {
        this.joinArray.push({
            type: joinMode.inner,
            tableName: _tableName,
            whereStr: _whereStr
        });
        return this;
    }
    order(_field: string, _mode = 'ASC', _tableName: string | null = null) {
        this.orderArray.push({
            field: _field,
            mode: _mode,
            tableName: _tableName,
        })
        return this;
    }
    group(_field: string, _tableName: string | null = null) {
        this.groupArray.push({
            field: _field,
            tableName: _tableName,
        })
        return this;
    }
    limit(_page: number, _limit = 30) {
        this.limitData = {
            page: _page,
            limit: _limit
        }
        return this;
    }
    getRandom() {
        return this.random = this.random + 1;
    }
    private async dbList(_table: string, _field: string, _where: string, _whereOther: string, _whereObj: sqlParams, _clearSet = true, _execType = EexecType.select) {
        const where = _where + _whereOther;
        let data: unknown;
        if (_execType == EexecType.find) {
            data = await this.CoreDb.find(_field, _table, where, _whereObj);
        } else if (_execType == EexecType.findField) {
            data = await this.CoreDb.findField(_field, _table, where, _whereObj);
        } else {
            data = await this.CoreDb.select(_field, _table, where, _whereObj);
        }
        if (_clearSet) this.clear();
        return data;
    }

    private async dbCount(_table: string, _where: string, _whereObj: sqlParams, _clearSet = true) {
        if (this.groupArray.length > 0) {
            const _sql = 'SELECT COUNT(*) as num FROM (' + this.CoreDb.getSelectSql('count(*)', _table, _where) + ') groups';
            if (_clearSet) this.clear();
            return await this.CoreDb.ExecScalar(_sql, _whereObj) as number;
        } else {
            if (_clearSet) this.clear();
            return await this.CoreDb.findField(' count(*) as num ', _table, _where, _whereObj) as number;
        }
    }

    clear() {
        this.init();
    }
    private getThisTableAsName() {
        return 't';
    }
    private getTable() {
        let tableName = this.tablseName;
        if (tableName == null) {
            console.error('tablseName is null');
        }
        if (this.isJoin()) {
            tableName += ' as ' + this.getThisTableAsName();
        }
        return tableName + this.getJoin();
    }
    private isJoin() {
        if (this.joinArray.length > 0) {
            return true;
        }
        return false;
    }
    private getJoin() {
        let s = '';
        this.joinArray.forEach((item) => {
            switch (item.type) {
                case joinMode.left:
                    s += ' LEFT JOIN ';
                    break;
                case joinMode.right:
                    s += ' RIGHT JOIN ';
                    break;
                case joinMode.inner:
                    s += ' INNER JOIN ';
                    break;
            }
            s += item.tableName + ' ON ' + item.whereStr;
        })
        return s;
    }
    private getField() {
        let s = '';
        const t = this.isJoin() ? this.getThisTableAsName() + '.' : '';
        if (this.fieldsData.length == 0) {
            return t + '*';
        } else {
            if (this.groupArray.length > 0) {
                const _fieldArr: Array<string> = [];
                this.fieldsData.forEach((_field) => {
                    let tj = '';
                    if (!_field.includes('.')) {
                        tj = t;
                    }
                    _fieldArr.push('ANY_VALUE(' + tj + _field + ') as ' + _field);
                })
                s = _fieldArr.join(',');
            } else {
                const fa: Array<string> = [];
                this.fieldsData.forEach(_field => {
                    let tj = '';
                    if (!_field.includes('.')) {
                        tj = t;
                    }
                    fa.push(tj + _field);
                })
                s = fa.join(',');
            }
        }
        this.fieldSqlArray.forEach((item) => {
            s += ',' + item;
        });
        return s;
    }
    private getWhere() {

        let w = '';
        let iss;
        const t = this.isJoin() ? this.getThisTableAsName() + '.' : '';
        this.whereArray.forEach((obj) => {
            switch (obj.type) {
                case typeMode.field:
                    w += obj.link + ' ' + ((obj.tableName == null) ? t : obj.tableName + '.') + obj.field + ' ' + obj.condition + ' ' + this.sqlLinker + obj.field + ' ';
                    break;
                case typeMode.sql:
                    w += obj.link + ' ' + obj.sql + ' ';
                    break;
                case typeMode.in:
                    iss = this.getInSqlStr(obj.field as string, obj.arrIn as Array<string>, ((obj.tableName == null) ? t : obj.tableName + '.'));
                    for (const key in iss.whereObj) {
                        this.whereObj[key] = (iss.whereObj as sqlParams)[key];
                    }
                    w += obj.link + ' ' + iss.sql + ' ';
                    break;
                case typeMode.insql:
                    w += obj.link + ' ' + t + obj.field + ' IN (' + obj.sql + ') ';
                    break;
                case typeMode.dateRange:
                    w += obj.link + ' ' + '(' + t + obj.startDateField + ' >= ' + this.sqlLinker + obj.startDateField + obj.random_1 + ' and ' + t + obj.endDateField + ' <= ' + this.sqlLinker + obj.endDateField + obj.random_2 + ') ';
                    break;
                case typeMode.valueRange:
                    w += obj.link + ' ' + '(' + obj.field + obj.startSymbol + this.sqlLinker + obj.field?.toString().replace('.', '') + obj.random_1 + ' and ' + obj.field + obj.endSymbol + this.sqlLinker + obj.field?.toString().replace('.', '') + obj.random_2 + ') ';
                    break;
                case typeMode.today:
                    w += obj.link + ' TO_DAYS(' + t + obj.field + ') = TO_DAYS(NOW()) ';
                    break;
                case typeMode.like:
                    w += obj.link + ' ' + t + obj.field + ' LIKE ' + this.sqlLinker + obj.field + obj.random + ' ';
                    break;
                case typeMode.group: {
                    const v = obj.value as Array<{ filed: string, condition: string, value: unknown, link: string }>;
                    let groupSqlStr = '';
                    v.forEach((item) => {
                        if (groupSqlStr != '') {
                            groupSqlStr += item.link;
                        }
                        groupSqlStr += ' ' + item.filed + ' ' + item.condition + ' ' + this.sqlLinker + item.value + ' ';
                    });
                    w += obj.link + ' (' + groupSqlStr + ')';
                    break;
                }
            }
        })

        return w.replace(/(^and)|(^or)|(^AND)|(^OR)/, '');
    }
    private getWhereCombination() {
        let nws = '';
        const getWhere = this.getWhere();
        if (this.noWhereStatus && getWhere == '') {
            nws = '1=1';
        }
        return nws + getWhere;
    }
    private getInSqlStr(_field: string, arrIds: Array<string>, tableName = '', _identification = 'CREATEINSQL_') {
        const wArr: sqlParams = {};
        const cArr: Array<string> = [];
        this.inSqlStrBaseNum++;
        _identification = _identification + (this.inSqlStrBaseNum) + '_';
        arrIds.forEach((item, index) => {
            wArr[_identification + index] = item;
            cArr.push(this.sqlLinker + _identification + index);
        })
        return {
            whereObj: wArr,
            sql: tableName + _field + ' IN (' + cArr.join(',') + ')'
        };
    }
    private getGroup() {
        if (this.groupArray.length == 0) {
            return '';
        }
        const osr: Array<string> = [];
        const t = this.isJoin() ? this.getThisTableAsName() + '.' : '';
        this.groupArray.forEach((obj) => {
            osr.push((obj.tableName == null ? t : obj.tableName + '.') + obj.field);
        });
        return ' GROUP BY ' + osr.join(',') + ' ';
    }
    private getOrder() {
        if (this.orderArray.length == 0) {
            return '';
        }
        const osr: Array<string> = [];
        const t = this.isJoin() ? this.getThisTableAsName() + '.' : '';
        for (const obj of this.orderArray) {
            if (obj.mode.toUpperCase() == 'RAND') {
                return ' ORDER BY RANDOM()';
            }
            osr.push((obj.tableName == null ? t : obj.tableName + '.') + obj.field + ' ' + obj.mode);
        }
        return ' ORDER BY ' + osr.join(',') + ' ';
    }
    private getPaging() {
        if (this.limitData == null) {
            return '';
        }
        return ' LIMIT ' + ((this.limitData.page - 1) * this.limitData.limit) + ',' + this.limitData.limit + ' ';
    }
}

export { coreDBS, linkMode, likeMode, IConditions, ECreateUpdateTime }