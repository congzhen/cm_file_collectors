import fs from 'fs'
import config from './config'
interface IfolderPath {
    [key: string]: string;
}
const folderPath: IfolderPath = {
    db: config.dbFolderPath,
    performerFace: config.performerFacePath,
    resCoverPoster: config.resCoverPosterPath,
    plugin: config.pluginPath,
}

function folderInit() {
    for (const k in folderPath) {
        createFolder(folderPath[k]);
    }
}

function createFolder(folderPath: string) {
    const folderExists = fs.existsSync(folderPath);
    if (!folderExists) {
        //创建上传文件夹
        fs.mkdirSync(folderPath);
    }
}


export { folderInit, createFolder }