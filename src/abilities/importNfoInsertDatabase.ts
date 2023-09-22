
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import setupConfig from "@/setup/config"
import { CoreDb } from '@/core/core';
import { coreCreateGuid } from "@/core/coreGuid";
import { InofData } from "./importNfo";
import { filesBasesStore } from "@/store/filesBases.store";
import { IresDramaSeries, IresPerformers, IresTags, IresourcesBase } from "@/dataInterface/resources.interface";
import { EresDramaSeriesType } from "@/dataInterface/common.enum";
import { Iperformer } from '@/dataInterface/performer.interface';
import { IConditions } from '@/core/coreDBS';
import { ItagClass, ItagInfo } from '@/dataInterface/tag.interface';
import timer from '@/assets/timer';
import downloadFile from '@/assets/downloadFile';
import { fileCopy } from "@/assets/file"
import { tagServerData } from '@/serverData/tag.serverData';
import { IfilesBasesNofConfig } from '@/dataInterface/filesBasesSetting.interface';


const dbs = CoreDb();

export interface IimportNfoInsertDatabase {
    count: {
        already: number,
        success: number,
        fail: number,
    },
    data: Array<{
        data: InofData,
        msg: string,
    }>,
}


export const dataCopyDatabase = async function (dataList: Array<InofData>, coverPosterMode = 0, config: IfilesBasesNofConfig) {
    const resultData: IimportNfoInsertDatabase = {
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
    const performerBases_id = store.filesBasesStore.getCurrentFilesMainPerformerBasesId;
    if (performerBases_id == undefined) {
        throw new Error('No default performerBases found');
        return;
    }
    const tagClass_id = await getDefaultTagClassId(filesBases_id);
    const tID = await dbs.beginTrans();
    for (const nofData of dataList) {
        if (config.importCheckTitleAlready && await checkResExist(filesBases_id, nofData.title, nofData.issueNumber) > 0) {
            resultData.data.push({
                data: nofData,
                msg: 'Already',
            });
            resultData.count.already++;
            continue;
        }
        try {
            //资源
            const resourcesObj = await createResourceData(nofData, filesBases_id, coverPosterMode);
            await dbs.table('resources').createTime().create(resourcesObj as unknown as IConditions);
            //演员
            const performerObj = await craetePerformerData(nofData, performerBases_id, resourcesObj.id);
            for (const resPerformers of performerObj) {
                await dbs.table('resourcesPerformers').create(resPerformers as unknown as IConditions);
            }
            //标签
            const tagObj = await createTagData(nofData, filesBases_id, resourcesObj.id, tagClass_id);
            for (const resTags of tagObj) {
                await dbs.table('resourcesTags').create(resTags as unknown as IConditions);
            }
            //剧集
            const dramaSeriesObj = createDramaSeriesData(nofData, resourcesObj.id);
            for (const ds of dramaSeriesObj) {
                await dbs.table('resourcesDramaSeries').create(ds as unknown as IConditions);
            }
            resultData.data.push({
                data: nofData,
                msg: 'Success',
            });
            resultData.count.success++;
            //console.log(resourcesObj, performerObj, tagObj, dramaSeriesObj);
        } catch (err) {
            console.log(err);
            resultData.data.push({
                data: nofData,
                msg: 'Fail',
            });
            resultData.count.fail++;
        }
    }
    await CoreDb().commit(tID);
    return resultData;
}

async function getDefaultTagClassId(filesBases_id: string) {
    const info = await dbs.table('tagClass').where('filesBases_id', '=', filesBases_id).getFind();
    if (info) {
        return (info as ItagClass).id;
    }
    const tagClassObj = {
        id: coreCreateGuid(),
        filesBases_id,
        name: 'default',
        sort: 1,
    }
    const addResult = await dbs.table('tagClass').createTime().create(tagClassObj);
    if (addResult == undefined || addResult.status == false) {
        throw new Error('Create defatult tagClass error');
    }
    return tagClassObj.id;
}


async function checkResExist(filesBases_id: string, title: string, issueNumber: string) {
    const _dbs = dbs.table('resources').where('filesBases_id', '=', filesBases_id);
    if (issueNumber != '') {
        _dbs.whereSql('title = @title or issueNumber = @issueNumber ', {
            title, issueNumber
        })
    } else {
        _dbs.where('title', '=', title);
    }
    return await _dbs.getCount() as number;
}

async function createResourceData(nofData: InofData, filesBases_id: string, coverPosterMode = 0) {

    const coverPosterInfo = await createCoverPoster(nofData, filesBases_id);
    const data: IresourcesBase = {
        id: coreCreateGuid(),
        filesBases_id: filesBases_id,
        title: nofData.title,
        issueNumber: nofData.issueNumber,
        mode: EresDramaSeriesType.movies,
        coverPoster: coverPosterInfo ? coverPosterInfo.name : '',
        coverPosterMode: coverPosterMode,
        coverPosterWidth: coverPosterInfo && coverPosterInfo.width ? coverPosterInfo.width : 300,
        coverPosterHeight: coverPosterInfo && coverPosterInfo.height ? coverPosterInfo.height : 420,
        issuingDate: nofData.year,
        country: countryConvert(nofData.country),
        definition: definitionConvert(nofData.videoAttributeInfo.height),
        stars: 0,
        addTime: timer.getTodayFormat(),
        status: true,
        hot: 0,
        abstract: nofData.abstract,
        lastPlayTime: '',
        lastPlayFile: ''
    };
    return data;
}

async function createCoverPoster(nofData: InofData, filesBases_id: string) {
    const coverPath = path.join(nofData.folder, '/', nofData.cover);
    const coverPosterName = coreCreateGuid() + '.jpg';
    const coverPosterPath = path.join(setupConfig.resCoverPosterPath, '/', filesBases_id, '/', coverPosterName);
    if (nofData.cover != '' && fs.existsSync(coverPath)) {
        fileCopy(coverPath, coverPosterPath);
        /*    
        } else if (nofData.coverUrl != '') {
            try {
                const imageInfo = await downloadFile.image(nofData.coverUrl, coverPosterPath);
                console.log(imageInfo);
            } catch (err) {
                return undefined;
            }
            */
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

/**未处理 */
function countryConvert(country: string) {
    if (country == '') {
        return '';
    }
    return '';
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


async function craetePerformerData(nofData: InofData, performerBases_id: string, resources_id: string) {
    const perList: Array<IresPerformers> = [];
    for (const per of nofData.performer) {
        const info = await getPerformerInfo(performerBases_id, per.name);
        let performer_id;
        if (info) {
            performer_id = (info as Iperformer).id;

        } else {
            const photoName = '';
            if (per.photoUrl != '') {
                /*
                try {
                    photoName = coreCreateGuid() + '.jpg';
                    const photoPath = path.join(setupConfig.performerFacePath, '/', performerBases_id, '/', photoName);
                    const imageInfo = await downloadFile.image(per.photoUrl, photoPath);
                    console.log('imageInfo', imageInfo);
                } catch (err) {
                    console.log(err);
                }
                */
            }
            const perInfo: Iperformer = {
                id: coreCreateGuid(),
                name: per.name,
                performerBases_id,
                photo: photoName,
                aliasName: '',
                birthday: '',
                nationality: '',
                careerPerformer: true,
                careerDirector: false,
                introduction: '',
                cup: '',
                bust: '',
                waist: '',
                hip: '',
                stars: 0,
                addTime: timer.getTodayFormat(),
                status: true
            }
            await createPerformer(perInfo);
            performer_id = perInfo.id;
        }
        perList.push({
            id: coreCreateGuid(),
            resources_id,
            performer_id: performer_id,
        });
    }
    return perList;
}

async function createPerformer(formdataObj: Iperformer) {
    const addResult = await dbs.table('performer').create(formdataObj as unknown as IConditions);
    if (addResult == undefined || addResult.status == false) {
        return false;
    }
    return true;
}

async function getPerformerInfo(performerBases_id: string, name: string) {
    return await dbs.table('performer').debug().where('performerBases_id', '=', performerBases_id).whereSql(' ( name like @likeName or aliasName like @likeName) ', {
        likeName: '%' + name + '%'
    }).getFind();
}


async function createTagData(nofData: InofData, filesBases_id: string, resources_id: string, tagClass_id: string) {
    const tagList: Array<IresTags> = [];
    console.log(nofData.tag);
    const tagNameArr = nofData.tag.map(item => item.trim());
    for (const tagName of tagNameArr) {
        const tagInfo = await getTagInfo(tagName);
        let tag_id;
        if (!tagInfo) {
            tag_id = coreCreateGuid();
            const info: ItagInfo = {
                id: tag_id,
                name: tagName,
                tagClass_id: tagClass_id,
                hot: '0',
                sort: (await tagServerData.getMaxSortByTagClassId(tagClass_id) + 1),
                addTime: timer.getTodayFormat(),
                status: true
            }
            await createTag(info);

        } else {
            tag_id = (tagInfo as IresTags).id;
        }
        tagList.push({
            id: coreCreateGuid(),
            resources_id,
            tag_id,
        });
    }
    return tagList;
}

async function createTag(formdataObj: ItagInfo) {
    const addResult = await dbs.table('tag').createTime().create(formdataObj as unknown as IConditions);
    if (addResult == undefined || addResult.status == false) {
        return false;
    }
    return true;
}

async function getTagInfo(tagName: string) {
    return await dbs.table('tag').where('name', '=', tagName).getFind();
}


function createDramaSeriesData(nofData: InofData, resources_id: string) {
    const list: Array<IresDramaSeries> = [{
        id: coreCreateGuid(),
        resources_id,
        src: nofData.videoPath,
        type: EresDramaSeriesType.movies
    }];
    for (const series of nofData.series) {
        list.push({
            id: coreCreateGuid(),
            resources_id,
            src: series,
            type: EresDramaSeriesType.movies
        });
    }
    return list;
}