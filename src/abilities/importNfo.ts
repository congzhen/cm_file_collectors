import { IfilesBasesNofConfig } from '@/dataInterface/filesBasesSetting.interface';
import fs from 'fs';
import path from 'path';
import { parseString } from 'xml2js';

function parseXml(xml: Buffer) {
    return new Promise((resolve, reject) => {
        parseString(xml, (err: unknown, result: unknown) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function getAllNfoFiles(directory: string) {
    const files = fs.readdirSync(directory);
    let nfoFiles: string[] = [];

    files.forEach((file) => {
        const filePath = path.join(directory, file);
        const fileStat = fs.statSync(filePath);

        if (fileStat.isDirectory()) {
            nfoFiles = nfoFiles.concat(getAllNfoFiles(filePath));
        } else if (path.extname(file) === '.nfo') {
            nfoFiles.push(filePath);
        }
    });

    return nfoFiles;
}


async function toResData(nfoFilesPath: string[], config: IfilesBasesNofConfig) {
    const p = [];
    for (const pathSrc of nfoFilesPath) {
        const data = await getNfoInfo(pathSrc);
        const videoPath = getVideoPath(pathSrc, config.suffix);
        if (videoPath) {
            p.push(execToRes(videoPath, data, config));
        }
    }
    return p;
}

async function getNfoInfo(_path: string) {
    const data = await parseXml(fs.readFileSync(_path));
    return data;
}

function getVideoPath(nfoPath: string, suffix: string) {
    const filePathNameNoSuffix = nfoPath.slice(0, -4);
    const arr = suffix.split("|");
    for (const suffixName of arr) {
        const p = filePathNameNoSuffix + suffixName.trim();
        if (fs.existsSync(p)) {
            return p;
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function execToRes(videoPath: string, data: any, config: IfilesBasesNofConfig) {
    const root = data[config.root];
    function getBaseData(field: string, isArr = false) {
        const baseArr = field.split("|");
        let baseData = undefined;
        for (const fieldName of baseArr) {
            const _tm_fieldName = fieldName.trim();
            if (root[_tm_fieldName]) {
                baseData = root[_tm_fieldName];
                break
            }
        }
        if (!isArr && Array.isArray(baseData)) {
            return baseData[0];
        }
        return baseData;
    }

    function cto_performer(_data: undefined | Array<any>) {
        if (_data == undefined) {
            return [];
        }
        const __arr: Array<{ name: string, photoUrl: string }> = [];
        _data.forEach((item) => {
            __arr.push({
                name: Array.isArray(item[config.performerName]) ? item[config.performerName][0] : item[config.performerName],
                photoUrl: Array.isArray(item[config.performerThumb]) ? item[config.performerThumb][0] : item[config.performerThumb],
            })
        })
        return __arr;

    }

    const p: InofData = {
        videoPath,
        folder: path.dirname(videoPath),
        title: getBaseData(config.title),
        issueNumber: getBaseData(config.issueNumber),
        year: getBaseData(config.year),
        cover: getBaseData(config.cover),
        coverUrl: getBaseData(config.coverUrl),
        tag: getBaseData(config.tag, true),
        abstract: getBaseData(config.abstract),
        performer: cto_performer(getBaseData(config.performer, true)),
    }
    return p;
}


export interface InofData {
    videoPath: string,
    folder: string,
    title: string,
    issueNumber: string,
    year: string,
    cover: string,
    coverUrl: string,
    tag: Array<string>,
    abstract: string,
    performer: Array<{ name: string, photoUrl: string }>,
}


export const nfoToRes = async (path: string, config: IfilesBasesNofConfig) => {
    const nfoFilesPathData = getAllNfoFiles(path);
    return await toResData(nfoFilesPathData, config);
}


