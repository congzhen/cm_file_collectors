/*
core:{
    console:{
        addMessage: ((text: string) => void)
    },
    loading:{
        open: (() => void),
        close: (fn: () => {}) => void,
        closeSync: () => Promise<unknown>,
    },
    config:{
        basePath: string;
        configFolderPath: string;
        softwareConfigPath: string;
        dbFolderPath: string;
        dbPath: string;
        performerFacePath: string;
        resCoverPosterPath: string;
        webPagePath: string;
        pluginPath: string;
    },
    db: {
        CoreDbC: {
            ExecArray: (sql: string, params?: sqlParams): Promise<unknown>,
            ExecDict: (sql: string, params?: sqlParams): Promise<unknown>,
            ExecScalar: (sql: string, params?: sqlParams): Promise<unknown>,
            ExecRun: (sql: string, params?: sqlParams): Promise<unknown>,
        }
        CoreDbS: () => coreDBS
    },
    axios,
    fs,

}
*/

async function demoRun(core) {
    console.log(core.axios);
    console.log(core.fs);
    core.console.addMessage("Hello the console!");
    core.console.addMessage("");
    core.console.addMessage("");
    core.console.addMessage(await core.axios.get('https://ifconfig.me/ip'));
    let t = 2000;
    core.loading.open();
    setTimeout(async () => {
        await core.loading.closeSync();
    }, t);
    core.console.addMessage("");
    core.console.addMessage("");
    for (const c in core.config) {
        t += 100;
        setTimeout(async () => {
            core.console.addMessage(c + ": " + core.config[c]);
        }, t);
    }
    t += 200;
    setTimeout(async () => {
        core.console.addMessage("");
        core.console.addMessage("");
        core.console.addMessage("Table List ...");
        const coreDbC = core.db.CoreDbC;
        const tableList = await coreDbC.ExecArray('select * from sqlite_master where type="table"');
        console.log(tableList);
        for (const table of tableList) {
            t += 100;
            setTimeout(async () => {
                core.console.addMessage("Table Name: " + table.name);
            }, t);
            table.info = await coreDbC.ExecArray('PRAGMA table_info(' + table.name + ')');
        }
        t += 200;
        setTimeout(async () => {
            core.console.addMessage("");
            core.console.addMessage("");
            core.console.addMessage("Table Info ...");
            for (const table of tableList) {
                t += 100;
                setTimeout(async () => {
                    core.console.addMessage("");
                    core.console.addMessage("Table " + table.name + ' field: ');
                }, t);
                for (const tableInfo of table.info) {
                    t += 100;
                    setTimeout(async () => {
                        core.console.addMessage("Field: " + tableInfo.name + ' , Type: ' + tableInfo.type + ' , Default: ' + tableInfo.dflt_value);
                    }, t);
                }
            }
        }, t);
    }, t);


}