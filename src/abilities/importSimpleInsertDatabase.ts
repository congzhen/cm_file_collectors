import path from "path"
import fs from "fs"
import { filesBasesStore } from "@/store/filesBases.store";
import { filesBasesSettingStore } from "@/store/filesBasesSetting.store";
import { ISimpleData } from "./importSimple";
import setupConfig from "@/setup/config"

const dbs = CoreDb();
import { CoreDb } from '@/core/core';
import { coreCreateGuid } from "@/core/coreGuid";
import { IresDramaSeries, IresourcesBase } from "@/dataInterface/resources.interface";
import { EresDramaSeriesType } from "@/dataInterface/common.enum";
import timer from "@/assets/timer";
import { fileCopy, fileMove } from "@/assets/file";
import sharp from "sharp";
import { IConditions } from "@/core/coreDBS";
import { IcoverPosterData, IfilesBasesSimpleConfig } from "@/dataInterface/filesBasesSetting.interface";
import { calculateResizedDimensions } from "@/assets/math";
export interface IimportSimpleInsertDatabase {
    count: {
        already: number,
        success: number,
        fail: number,
    },
    data: Array<{
        data: ISimpleData,
        msg: string,
    }>,
}

export const dataCopyDatabase = async function (dataList: Array<ISimpleData>, coverPosterMode = 0, config: IfilesBasesSimpleConfig) {
    const resultData: IimportSimpleInsertDatabase = {
        count: {
            already: 0,
            success: 0,
            fail: 0
        },
        data: []
    };
    const store = {
        filesBasesStore: filesBasesStore(),
        filesBasesSettingStore: filesBasesSettingStore(),
    }
    const filesBases_id = store.filesBasesStore.currentFilesBases.id;
    const coverPosterDataConfig: IcoverPosterData | undefined = config.coverPosterUsesPreSetDimensions ? store.filesBasesSettingStore.config.coverPosterData[coverPosterMode] : undefined;

    const tID = await dbs.beginTrans();
    for (const smData of dataList) {
        if (config.importCheckTitleAlready && await checkResExist(filesBases_id, smData.title) > 0) {
            resultData.data.push({
                data: smData,
                msg: 'Already',
            });
            resultData.count.already++;
            continue;
        }
        try {
            //资源
            const resourcesObj = await createResourceData(smData, filesBases_id, coverPosterMode, coverPosterDataConfig);
            await dbs.table('resources').createTime().create(resourcesObj as unknown as IConditions);
            resultData.data.push({
                data: smData,
                msg: 'Success',
            });
            //剧集
            const dramaSeriesObj = createDramaSeriesData(smData, resourcesObj.id);
            for (const ds of dramaSeriesObj) {
                await dbs.table('resourcesDramaSeries').create(ds as unknown as IConditions);
            }
            resultData.count.success++;
        } catch (err) {
            resultData.data.push({
                data: smData,
                msg: 'Fail',
            });
            resultData.count.fail++;
        }
    }
    await CoreDb().commit(tID);
    return resultData;
}

async function checkResExist(filesBases_id: string, title: string) {
    return await dbs.table('resources').where('filesBases_id', '=', filesBases_id).whereSql('title = @title', {
        title
    }).getCount() as number;
}

async function createResourceData(smData: ISimpleData, filesBases_id: string, coverPosterMode = 0, coverPosterDataConfig: IcoverPosterData | undefined) {

    const coverPosterInfo = await createCoverPoster(smData, filesBases_id, coverPosterDataConfig);
    const data: IresourcesBase = {
        id: coreCreateGuid(),
        filesBases_id: filesBases_id,
        title: smData.title,
        issueNumber: "",
        mode: EresDramaSeriesType.movies,
        coverPoster: coverPosterInfo ? coverPosterInfo.name : '',
        coverPosterMode: coverPosterMode,
        coverPosterWidth: coverPosterInfo && coverPosterInfo.width ? coverPosterInfo.width : 300,
        coverPosterHeight: coverPosterInfo && coverPosterInfo.height ? coverPosterInfo.height : 420,
        issuingDate: "",
        country: "",
        definition: definitionConvert(smData.videoAttributeInfo.height),
        stars: 0,
        addTime: timer.getTodayFormat(),
        status: true,
        hot: 0,
        abstract: "",
        lastPlayTime: '',
        lastPlayFile: ''
    };
    return data;
}

async function createCoverPoster(smData: ISimpleData, filesBases_id: string, coverPosterDataConfig: IcoverPosterData | undefined) {
    const coverPath = smData.cover;
    const coverPosterName = coreCreateGuid() + '.jpg';
    const coverPosterPath = path.join(setupConfig.resCoverPosterPath, '/', filesBases_id, '/', coverPosterName);
    if (coverPath != '' && fs.existsSync(coverPath)) {
        fileCopy(coverPath, coverPosterPath);
    } else {
        return undefined;
    }
    const metadata = await sharp(coverPosterPath).metadata();
    if (coverPosterDataConfig == undefined || !metadata.width || !metadata.height || coverPosterDataConfig.width == 0 || coverPosterDataConfig.height == 0) {
        return {
            name: coverPosterName,
            width: metadata.width,
            height: metadata.height,
        }
    } else {
        const newDimensionsObj = calculateResizedDimensions(metadata.width, metadata.height, coverPosterDataConfig.width, coverPosterDataConfig.height);
        try {
            const tmpCoverPosterPath = coverPosterPath + 'tmp';
            await sharp(coverPosterPath).resize(newDimensionsObj.width, newDimensionsObj.height).toFile(tmpCoverPosterPath);
            fileMove(tmpCoverPosterPath, coverPosterPath)
        } catch (e: unknown) {
            console.log(e);
        }
        return {
            name: coverPosterName,
            width: newDimensionsObj.width,
            height: newDimensionsObj.height,
        }
    }

}

function definitionConvert(videoHeight: string) {
    if (videoHeight == "") {
        return '';
    }
    const h = parseInt(videoHeight);
    if (h < 480) {
        return 'StandardDefinition';
    } else if (h >= 480 && h < 720) {
        return 'HighDefinition';
    } else if (h >= 720 && h < 1080) {
        return '720P';
    } else if (h >= 1080 && h < 1440) {
        return '1080P';
    } else if (h >= 1440 && h < 2160) {
        return '2K';
    } else if (h >= 2160 && h < 4220) {
        return '4K';
    } else {
        return '8K';
    }
}

function createDramaSeriesData(SimpleData: ISimpleData, resources_id: string) {
    const list: Array<IresDramaSeries> = [{
        id: coreCreateGuid(),
        resources_id,
        src: SimpleData.file,
        type: EresDramaSeriesType.movies
    }];
    return list;
}