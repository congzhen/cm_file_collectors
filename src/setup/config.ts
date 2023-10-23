import path from 'path'
import { readDir } from '@/assets/file'
import timer from '@/assets/timer'


function getDataBasesName(_dbFolderPath: string) {
    const dbFiles = readDir(_dbFolderPath, ['.db']);
    if (dbFiles[0] == undefined) {
        const dataTime = timer.getToday();
        return 'cm_' + dataTime.date + '_' + dataTime.time + '.db';
    }
    return dbFiles[0];

}

const basePath = path.resolve('./');
const configFolderPath = path.join(basePath, '/config/');
const softwareConfigPath = path.join(configFolderPath, '/softwareConfig.json');
const dbFolderPath = path.join(basePath, '/db/');
const dbPath = path.join(dbFolderPath, '/', getDataBasesName(dbFolderPath));
const performerFacePath = path.join(basePath, '/db/performerFace/');
const resCoverPosterPath = path.join(basePath, '/db/resCoverPoster/');

const webPagePath = path.join(basePath, '/static/webPage/');

const config = {
    basePath,
    configFolderPath,
    softwareConfigPath,
    dbFolderPath,
    dbPath,
    performerFacePath,
    resCoverPosterPath,
    webPagePath,
    isFullscreen: { width: 1280, height: 700 },
}

export const setDbPath = (FPath: string) => {
    config.dbFolderPath = FPath;
    config.dbPath = path.join(config.dbFolderPath, '/', getDataBasesName(config.dbFolderPath));
    config.performerFacePath = path.join(config.dbFolderPath, '/performerFace/');
    config.resCoverPosterPath = path.join(config.dbFolderPath, '/resCoverPoster/');

}

export default config
