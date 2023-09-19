import { IfilesBasesNofConfig } from '@/dataInterface/filesBasesSetting.interface';
import { IvideoAttributeInfo, ffprobeTool } from '@/webServer/m3u8FFmpeg';
import fs from 'fs';
import path from 'path';
import { parseStringPromise } from 'xml2js';
import { readDir, readDirDeep } from '@/assets/file'


async function getAllNfoFiles(directory: string) {
    return await readDirDeep(directory, ['.nfo']);
}


interface InfoBaseData {
    folderName: string,
    nfoFileName: string,
}

function getNfoBaseInfo(nfoPath: string) {
    const folderName = path.dirname(nfoPath);
    const nfoFileName = path.basename(nfoPath, path.extname(nfoPath));
    const data: InfoBaseData = { folderName, nfoFileName }
    return data;
}

async function toResData(nfoFilesPath: string[], config: IfilesBasesNofConfig) {
    const p = [];
    for (const pathSrc of nfoFilesPath) {
        const data = await getNfoInfo(pathSrc);
        const nfoBaseInfo = getNfoBaseInfo(pathSrc);
        const videoPath = getVideoPath(nfoBaseInfo, config.suffix);
        if (videoPath) {
            const folder = path.dirname(videoPath);
            const nofData: InofData = {
                videoPath: videoPath,
                folder,
                videoAttributeInfo: await ffprobeTool.getVideoInfo(videoPath),
                ...execToRes(data, config, nfoBaseInfo)
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

function getVideoPath(_nfoBaseInfo: InfoBaseData, suffix: string) {
    const filePathNameNoSuffix = path.join(_nfoBaseInfo.folderName, '/', _nfoBaseInfo.nfoFileName);
    const suffixArr = suffix.split("|");
    const possiblePaths = suffixArr.map(suffixName => filePathNameNoSuffix + suffixName.trim());
    const result = possiblePaths.find(p => fs.existsSync(p));
    if (result) {
        return result;
    }
    //无法找到nfo同名的视频文件，进行模糊搜索
    const fuzzyData = readDir(_nfoBaseInfo.folderName, suffixArr);
    const regex = new RegExp(_nfoBaseInfo.nfoFileName, "i");
    for (const fd of fuzzyData) {
        if (regex.test(fd)) {
            return path.join(_nfoBaseInfo.folderName, '/', fd);
        }
    }
    return fuzzyData?.length > 0 ? path.join(_nfoBaseInfo.folderName, '/', fuzzyData[0]) : undefined;
}



// eslint-disable-next-line @typescript-eslint/no-explicit-any
function execToRes(data: any, config: IfilesBasesNofConfig, _nfoBaseInfo: InfoBaseData) {
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
        if (_data == undefined || !Array.isArray(_data)) {
            return [];
        }
        const p = _data.map((item) => {
            const _name = item[config.performerName];
            const _photoUrl = item[config.performerThumb];
            return {
                name: !_name ? '' : Array.isArray(_name) ? _name[0].trim() : _name,
                photoUrl: !_photoUrl ? '' : Array.isArray(_photoUrl) ? _photoUrl[0].trim() : _photoUrl,
            }
        })
        return p;
    }
    function cto_tag(_data: undefined | Array<any>) {
        if (_data == undefined || !Array.isArray(_data)) {
            return [];
        }
        if (config.removedTag != '') {
            const removedTagArr = config.removedTag.split("|");
            _data = _data.filter((item) => {
                for (const remTag of removedTagArr) {
                    if (item.indexOf(remTag) !== -1) {
                        return false;
                    }
                }
                return true;
            });
        }
        return _data;
    }
    function cto_cover(coverName: string) {

        if (coverName != '') {
            return coverName;
        }
        if (config.coverSuffix == '') {
            return '';
        }
        const coverArr = config.cover.split("|");
        const coverSuffixArr = config.coverSuffix.split("|");
        const fuzzyData = readDir(_nfoBaseInfo.folderName, coverSuffixArr);
        const regex = new RegExp(".*" + _nfoBaseInfo.nfoFileName + ".*(" + coverArr.join('|') + ").*(" + coverSuffixArr.join('|') + ")", "i");
        for (const fd of fuzzyData) {
            if (regex.test(fd)) {
                return fd;
            }
        }
        const regex1 = new RegExp(".*(" + coverArr.join('|') + ").*(" + coverSuffixArr.join('|') + ")", "i");
        for (const fd of fuzzyData) {
            if (regex1.test(fd)) {
                return fd;
            }
        }
        return fuzzyData?.length > 0 ? fuzzyData[0] : '';
    }


    const p: InofBaseData = {
        title: getBaseData(config.title),
        issueNumber: getBaseData(config.issueNumber),
        year: getBaseData(config.year),
        cover: cto_cover(getBaseData(config.cover)),
        coverUrl: getBaseData(config.coverUrl),
        tag: cto_tag(getBaseData(config.tag, true)),
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


