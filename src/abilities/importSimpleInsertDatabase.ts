import path from "path"
import fs from "fs"
import { filesBasesStore } from "@/store/filesBases.store";
import { ISimpleData } from "./importSimple";
import setupConfig from "@/setup/config"

const dbs = CoreDb();
import { CoreDb } from '@/core/core';
import { coreCreateGuid } from "@/core/coreGuid";
import { IresDramaSeries, IresourcesBase } from "@/dataInterface/resources.interface";
import { EresDramaSeriesType } from "@/dataInterface/common.enum";
import timer from "@/assets/timer";
import { fileCopy } from "@/assets/file";
import sharp from "sharp";
import { IConditions } from "@/core/coreDBS";
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

export const dataCopyDatabase = async function (dataList: Array<ISimpleData>, coverPosterMode = 0) {
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
    }
    const filesBases_id = store.filesBasesStore.currentFilesBases.id;

    const tID = await dbs.beginTrans();
    for (const smData of dataList) {
        if (await checkResExist(filesBases_id, smData.title) > 0) {
            resultData.data.push({
                data: smData,
                msg: 'Already',
            });
            resultData.count.already++;
            continue;
        }
        try {
            //资源
            const resourcesObj = await createResourceData(smData, filesBases_id, coverPosterMode);
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

async function createResourceData(smData: ISimpleData, filesBases_id: string, coverPosterMode = 0) {

    const coverPosterInfo = await createCoverPoster(smData, filesBases_id);
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

async function createCoverPoster(smData: ISimpleData, filesBases_id: string) {
    const coverPath = smData.cover;
    const coverPosterName = coreCreateGuid() + '.jpg';
    const coverPosterPath = path.join(setupConfig.resCoverPosterPath, '/', filesBases_id, '/', coverPosterName);
    if (coverPath != '' && fs.existsSync(coverPath)) {
        fileCopy(coverPath, coverPosterPath);
    } else {
        return undefined;
    }
    const metadata = await sharp(coverPosterPath).metadata();
    return {
        name: coverPosterName,
        width: metadata.width,
        height: metadata.height,

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