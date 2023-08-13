import { coreSqlite } from "./coreSqlite";
import { coreDBS } from "./coreDBS";

const CoreDbC = new coreSqlite();

const createCoreDb = function () {
    const _DBS = new coreDBS();
    _DBS.setCoreDb(CoreDbC);
    return _DBS;
}

const _CoreDb = createCoreDb();

const CoreDb = function () {
    _CoreDb.clear();
    return _CoreDb;
}


export { CoreDbC, CoreDb, createCoreDb };
