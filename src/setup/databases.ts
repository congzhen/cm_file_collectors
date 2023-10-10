import config from "./config"
import { createFolder } from "./folder"
import { CoreDbC } from "@/core/core"
import { coreCreateGuid } from "@/core/coreGuid"

interface ItableData {
    [key: string]: Array<string>
}
interface ItableInfo {
    cid: number,
    name: string,
    type: string,
}


async function dbInit() {
    createFolder(config.dbFolderPath);
    await CoreDbConnection(config.dbPath)
    await checkDataTables();
    await checkTableField();
}

async function CoreDbConnection(_dbPath: string) {
    await CoreDbC.connection(_dbPath);
}

async function checkDataTables() {
    for (const key in initTableData) {
        const hasTable = await CoreDbC.ExecDict('select * from sqlite_master where type="table" AND name = "' + key + '"');
        if (!hasTable) {
            for (const item in initTableData[key]) {
                await CoreDbC.ExecRun(initTableData[key][item]);
            }
        }
    }
}

async function checkTableField() {
    for (const fd of initFieldData) {
        const tableInfo = await CoreDbC.ExecArray('PRAGMA table_info(' + fd.table + ')') as Array<ItableInfo>;
        const fieldArr = tableInfo.map(info => {
            return info.name
        })
        if (!fieldArr.includes(fd.field)) {
            await CoreDbC.ExecRun(fd.sql);
        }
    }
}

const filesBasesDefaultId = coreCreateGuid();
const performerBasesDefaultId = coreCreateGuid();

const initFieldData = [
    { table: 'filesBasesSetting', field: 'nfo_json_data', sql: 'ALTER TABLE filesBasesSetting ADD nfo_json_data TEXT;' },
    { table: 'filesBasesSetting', field: 'simple_json_data', sql: 'ALTER TABLE filesBasesSetting ADD simple_json_data TEXT;' },
    { table: 'resourcesPerformers', field: 'sort', sql: 'ALTER TABLE resourcesPerformers ADD sort INT DEFAULT (0);' },
    { table: 'resourcesDirectors', field: 'sort', sql: 'ALTER TABLE resourcesDirectors ADD sort INT DEFAULT (0);' },
    { table: 'resourcesTags', field: 'sort', sql: 'ALTER TABLE resourcesTags ADD sort INT DEFAULT (0);' },
    { table: 'resourcesDramaSeries', field: 'sort', sql: 'ALTER TABLE resourcesDramaSeries ADD sort INT DEFAULT (0);' },
]

const initTableData: ItableData = {
    filesBases: [
        'CREATE TABLE filesBases ( id CHAR(21), name VARCHAR(200), sort int, addTime DATETIME DEFAULT (CURRENT_TIMESTAMP), status int DEFAULT (1),  CONSTRAINT filesBases_PK PRIMARY KEY (id));',
        'INSERT INTO `filesBases` (`id`,`name`,`sort`) VALUES ("' + filesBasesDefaultId + '","Default Files Databases",1) ;',
    ],
    performerBases: [
        'CREATE TABLE performerBases ( id CHAR(21), name VARCHAR(200), sort int, addTime DATETIME DEFAULT (CURRENT_TIMESTAMP), status int DEFAULT (1),  CONSTRAINT performerBases_PK PRIMARY KEY (id));',
        'INSERT INTO `performerBases` (`id`,`name`,`sort`) VALUES ("' + performerBasesDefaultId + '","Default Performer Databases",1) ;',
    ],
    filesRelatedPerformerBases: [
        'CREATE TABLE filesRelatedPerformerBases (id CHAR(21),filesBases_id CHAR(21),performerBases_id CHAR(21),main int DEFAULT (0),  CONSTRAINT filesRelatedPerformerBases_PK PRIMARY KEY (id));',
        'INSERT INTO `filesRelatedPerformerBases` (`id`,`filesBases_id`,`performerBases_id`,`main`) VALUES ("' + coreCreateGuid() + '","' + filesBasesDefaultId + '","' + performerBasesDefaultId + '",1) ;'
    ],
    filesBasesSetting: [
        'CREATE TABLE filesBasesSetting (filesBases_id char(21),config_json_data TEXT,CONSTRAINT filesBasesSetting_PK PRIMARY KEY (filesBases_id));',
    ],
    tagClass: [
        'CREATE TABLE tagClass (id CHAR(21),filesBases_id CHAR(21),name VARCHAR(200),leftShow int DEFAULT (1),hot int DEFAULT (0),sort int,addTime DATETIME DEFAULT (CURRENT_TIMESTAMP),status int DEFAULT (1),CONSTRAINT tagClass_PK PRIMARY KEY (id));',
        'CREATE INDEX tagClass_filesBases_id_IDX ON tagClass (filesBases_id);',
    ],
    tag: [
        'CREATE TABLE tag (id CHAR(21), tagClass_id CHAR(21), name VARCHAR(200), hot int DEFAULT (0), sort int,addTime DATETIME DEFAULT (CURRENT_TIMESTAMP), status int DEFAULT (1), CONSTRAINT tag_PK PRIMARY KEY (id));',
        'CREATE INDEX tag_tagClass_id_IDX ON tag (tagClass_id);',
    ],
    performer: [
        'CREATE TABLE performer (id CHAR(21),performerBases_id CHAR(21),name VARCHAR(200),aliasName VARCHAR(500),birthday DATE, nationality VARCHAR(50),careerPerformer int(1) DEFAULT 1,careerDirector int(1) DEFAULT 0,photo VARCHAR(100),introduction TEXT,cup VARCHAR(10), bust INTEGER,waist INTEGER,hip INTEGER,stars INTEGER,addTime DATATIME DEFAULT (CURRENT_TIMESTAMP),status INTEGER DEFAULT (1),CONSTRAINT performer_PK PRIMARY KEY (id));',
        'CREATE INDEX performer_performerBases_id_IDX ON performer (performerBases_id);',
        'CREATE INDEX performer_cup_IDX ON performer (cup);',
    ],
    resources: [
        'CREATE TABLE resources ( id CHAR(21),filesBases_id CHAR(21),title VARCHAR(200),issueNumber VARCHAR(50), mode VARCHAR(20), coverPoster VARCHAR(50),coverPosterMode int(4) DEFAULT 0,coverPosterWidth int(8) DEFAULT 300,coverPosterHeight int(8) DEFAULT 420,issuingDate DATE,country VARCHAR(50) ,definition VARCHAR(50),stars int DEFAULT (0),hot int DEFAULT (0), lastPlayTime DATETIME, lastPlayFile VARCHAR(300),abstract TEXT,addTime DATETIME DEFAULT (CURRENT_TIMESTAMP),status INT DEFAULT (1), CONSTRAINT resources_PK PRIMARY KEY (id));',
        'CREATE INDEX resources_filesBases_id_IDX ON resources (filesBases_id);',
    ],
    resourcesDramaSeries: [
        'CREATE TABLE resourcesDramaSeries ( id CHAR(21), resources_id CHAR(21),type VARCHAR(50), src TEXT, CONSTRAINT resourcesDramaSeries_PK PRIMARY KEY (id));',
        'CREATE INDEX resourcesDramaSeries_resources_id_IDX ON resourcesDramaSeries (resources_id); ',
    ],
    resourcesTags: [
        'CREATE TABLE resourcesTags (id CHAR(21),resources_id CHAR(21),tag_id CHAR(21), CONSTRAINT resourcesTags_PK PRIMARY KEY (id) );',
        'CREATE INDEX resourcesTags_resources_id_IDX ON resourcesTags (resources_id);',
        'CREATE INDEX resourcesTags_tag_id_IDX ON resourcesTags (tag_id,resources_id);',
    ],
    resourcesPerformers: [
        'CREATE TABLE resourcesPerformers (id CHAR(21),resources_id CHAR(21),performer_id CHAR(21), CONSTRAINT resourcesPerformers_PK PRIMARY KEY (id));',
        'CREATE INDEX resourcesPerformers_resources_id_IDX ON resourcesPerformers (resources_id,performer_id);',
        'CREATE INDEX resourcesPerformers_performer_id_IDX ON resourcesPerformers (performer_id);',
    ],
    resourcesDirectors: [
        'CREATE TABLE resourcesDirectors (id CHAR(21), resources_id CHAR(21), performer_id CHAR(21), CONSTRAINT resourcesDirectors_PK PRIMARY KEY (id));',
        'CREATE INDEX resourcesDirectors_resources_id_IDX ON resourcesDirectors (resources_id,performer_id);',
        'CREATE INDEX resourcesDirectors_performer_id_IDX ON resourcesDirectors (performer_id);',
    ],
}

export { dbInit }