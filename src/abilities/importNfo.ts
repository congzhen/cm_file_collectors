import { IfilesBasesNofConfig } from '@/dataInterface/filesBasesSetting.interface';
import { IvideoAttributeInfo, ffprobeTool } from '@/webServer/m3u8FFmpeg';
import fs from 'fs';
import path from 'path';
import { parseStringPromise } from 'xml2js';


async function getAllNfoFiles(directory: string) {
    const files = await fs.promises.readdir(directory, { withFileTypes: true });
    const nfoFiles: string[] = [];

    for (const file of files) {
        const filePath = path.join(directory, file.name);

        if (file.isDirectory()) {
            nfoFiles.push(...await getAllNfoFiles(filePath));
        } else if (path.extname(file.name) === '.nfo') {
            nfoFiles.push(filePath);
        }
    }

    return nfoFiles;
}


async function toResData(nfoFilesPath: string[], config: IfilesBasesNofConfig) {
    const p = [];
    for (const pathSrc of nfoFilesPath) {
        const data = await getNfoInfo(pathSrc);
        const videoPath = getVideoPath(pathSrc, config.suffix);
        if (videoPath) {
            const nofData: InofData = {
                videoPath: videoPath,
                folder: path.dirname(videoPath),
                videoAttributeInfo: await ffprobeTool.getVideoInfo(videoPath),
                ...execToRes(data, config)
            }
            p.push(nofData);
        }
    }
    return p;
}

async function getNfoInfo(_path: string) {
    const data = await parseStringPromise(fs.readFileSync(_path));
    return data;
}

function getVideoPath(nfoPath: string, suffix: string) {
    const filePathNameNoSuffix = nfoPath.slice(0, -4);
    const arr = suffix.split("|");
    const possiblePaths = arr.map(suffixName => filePathNameNoSuffix + suffixName.trim());
    return possiblePaths.find(p => fs.existsSync(p));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function execToRes(data: any, config: IfilesBasesNofConfig) {
    const root = config.root == '' ? data : data[config.root];
    function getBaseData(field: string, isArr = false) {
        const baseArr = field.split("|");
        let baseData = '';
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
        return _data.map(item => ({
            name: Array.isArray(item[config.performerName]) ? item[config.performerName][0].trim() : item[config.performerName].trim(),
            photoUrl: Array.isArray(item[config.performerThumb]) ? item[config.performerThumb][0].trim() : item[config.performerThumb].trim(),
        }));
    }



    const p: InofBaseData = {
        title: getBaseData(config.title),
        issueNumber: getBaseData(config.issueNumber),
        year: getBaseData(config.year),
        cover: getBaseData(config.cover),
        coverUrl: getBaseData(config.coverUrl),
        tag: getBaseData(config.tag, true),
        abstract: getBaseData(config.abstract),
        country: getBaseData(config.country),
        star: getBaseData(config.star),
        performer: cto_performer(getBaseData(config.performer, true)),
    }
    return p;
}

export interface InofBaseData {
    title: string,
    issueNumber: string,
    year: string,
    cover: string,
    coverUrl: string,
    tag: Array<string>,
    abstract: string,
    country: string,
    star: string,
    performer: Array<{ name: string, photoUrl: string }>,
}


export interface InofData extends InofBaseData {
    videoPath: string,
    folder: string,
    videoAttributeInfo: IvideoAttributeInfo,

}


export const nfoToRes = async (path: string, config: IfilesBasesNofConfig) => {
    const nfoFilesPathData = await getAllNfoFiles(path);
    return await toResData(nfoFilesPathData, config);
}


