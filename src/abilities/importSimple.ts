import path from "path"
import { readDir, readDirDeep } from "@/assets/file";
import { IfilesBasesSimpleConfig } from "@/dataInterface/filesBasesSetting.interface";
import { IvideoAttributeInfo, ffprobeTool } from "@/webServer/m3u8FFmpeg";



export const simpleToRes = async (path: string, config: IfilesBasesSimpleConfig) => {
    return await toResData(path, config);
}


interface ISimpleBaseData {
    file: string;
    title: string;
    cover: string;
}

export interface ISimpleData extends ISimpleBaseData {
    videoAttributeInfo: IvideoAttributeInfo,
}

async function toResData(path: string, config: IfilesBasesSimpleConfig) {
    const suffixArr = config.suffix.split("|");
    const readfilesData = await readDirDeep(path, suffixArr);
    const fileData: Array<ISimpleData> = [];
    for (const file of readfilesData) {
        fileData.push({
            file,
            title: getTitle(file, config),
            cover: getCover(file, config),
            videoAttributeInfo: await ffprobeTool.getVideoInfo(file),
        });
    }
    return fileData;
}

function getTitle(filePath: string, config: IfilesBasesSimpleConfig) {
    let titleMode = 'file';
    if (config.title != '') {
        titleMode = config.title.split("|")[0];
    }
    if (titleMode == 'folder') {
        return path.dirname(filePath);
    } else {
        return path.basename(filePath, path.extname(filePath));
    }
}

function getCover(filePath: string, config: IfilesBasesSimpleConfig) {
    const coverSuffixArr = config.coverSuffix.split("|");
    const coverArr = config.cover.split("|");
    const regex = new RegExp(".*(" + coverArr.join('|') + ").*(" + coverSuffixArr.join('|') + ")", "i");
    const folderName = path.dirname(filePath);
    const fuzzyData = readDir(folderName, coverSuffixArr);
    for (const fd of fuzzyData) {
        if (regex.test(fd)) {
            return path.join(folderName, '/', fd);
        }
    }
    return fuzzyData?.length > 0 ? path.join(folderName, '/', fuzzyData[0]) : '';
}