import fs from 'fs';
import path from 'path'
import timer from "@/assets/timer"
import setupConfig from "@/setup/config"
import { fileCopy } from "@/assets/file"
import { CoreDb } from "@/core/core"
import { coreCreateGuid } from "@/core/coreGuid"
import { ipcRendererSend } from '@/electronCommon'
import { ItagClassInfo, ItagInfo } from '@/dataInterface/tag.interface';
import { Iperformer } from '@/dataInterface/performer.interface';
import { IresDramaSeries, IresTagsInfo, Iresources } from '@/dataInterface/resources.interface';
import { EresDramaSeriesType } from '@/dataInterface/common.enum';
const basePath = path.resolve('./');
const convertFolderPath = path.join(basePath, '/db_convert/');


const ZH_nationality: { [key: string]: string } = { '日本': 'Japan', '中国': 'China', '印度': 'India', '韩国': 'SouthKorea', '朝鲜': 'NorthKorea', '美国': 'America', '其他': 'OtherCountry' };

interface IdbFiles {
    id: string;
    performerBases_id: string;
    databaseName: string;
    dbcPath: string;
    performerFaceDataPath: string;
    resDataPath: string;
    dbPerformerDataPath: string;
    dbResDataPath: string;
    dbTagClassDataPath: string;
    dbTagDataPath: string;
}

const existsSync = (path: string) => {
    return fs.existsSync(path);
}

const getDbConvertFolderLists = () => {
    return fs.readdirSync(convertFolderPath, { withFileTypes: true });
}

const checkDbFolderTheFielsExist = (dbFloderName: string) => {
    const dbcPath = path.join(convertFolderPath, dbFloderName);
    const objDbFiles: IdbFiles = {
        id: coreCreateGuid(),
        performerBases_id: coreCreateGuid(),
        databaseName: dbFloderName,
        dbcPath,
        performerFaceDataPath: path.join(dbcPath, '/performerFaceData/'),
        resDataPath: path.join(dbcPath, '/resData/'),
        dbPerformerDataPath: path.join(dbcPath, '/dbPerformerData.db'),
        dbResDataPath: path.join(dbcPath, '/dbResData.db'),
        dbTagClassDataPath: path.join(dbcPath, '/dbTagClassData.db'),
        dbTagDataPath: path.join(dbcPath, '/dbTagData.db'),
    }
    if (
        existsSync(objDbFiles.performerFaceDataPath)
        &&
        existsSync(objDbFiles.resDataPath)
        &&
        existsSync(objDbFiles.dbPerformerDataPath)
        &&
        existsSync(objDbFiles.dbResDataPath)
        &&
        existsSync(objDbFiles.dbTagClassDataPath)
        &&
        existsSync(objDbFiles.dbTagDataPath)
    ) {
        return objDbFiles;
    }
    return false;
}

const convertDb = async (objDb: IdbFiles) => {
    const tID = await CoreDb().beginTrans();

    const filesBasesCount = await CoreDb().table('filesBases').getCount();
    const addFilesBasesResult = await CoreDb().table('filesBases').createTime().create({ id: objDb.id, name: objDb.databaseName, sort: (filesBasesCount + 1) });
    if (addFilesBasesResult == undefined || addFilesBasesResult.status == false) {
        await CoreDb().rollback();
        return false;
    }

    const performerBasesCount = await CoreDb().table('performerBases').getCount();
    const addPerformerBasesResult = await CoreDb().table('performerBases').createTime().create({ id: objDb.performerBases_id, name: objDb.databaseName, sort: (performerBasesCount + 1) });
    if (addPerformerBasesResult == undefined || addPerformerBasesResult.status == false) {
        await CoreDb().rollback();
        return false;
    }

    const addFilesRelatedPerformerBasesResult = await CoreDb().table('filesRelatedPerformerBases').create({ id: coreCreateGuid(), filesBases_id: objDb.id, performerBases_id: objDb.performerBases_id, main: 1 });
    if (addFilesRelatedPerformerBasesResult == undefined || addFilesRelatedPerformerBasesResult.status == false) {
        await CoreDb().rollback();
        return false;
    }

    const tagClassArr = getTagClassData(objDb);
    for (const tagClass of tagClassArr) {
        const result = await CoreDb().table('tagClass').create({ ...tagClass });
        if (result == undefined || result.status == false) {
            await CoreDb().rollback();
            return false;
        }
    }

    const tagObjArr = getTagData(objDb);
    for (const key in tagObjArr) {
        for (const tag of tagObjArr[key]) {
            const result = await CoreDb().table('tag').create({ ...tag });
            if (result == undefined || result.status == false) {
                await CoreDb().rollback();
                return false;
            }
        }
    }

    const performerArr = getPerformerData(objDb);
    for (const performer of performerArr) {
        const result = await CoreDb().table('performer').create({ ...performer });
        if (result == undefined || result.status == false) {
            await CoreDb().rollback();
            return false;
        }
    }

    const resArr = getResData(objDb);
    for (const res of resArr) {
        const data: { [key: string]: unknown } = { ...res };
        delete data.directors;
        delete data.performers;
        delete data.tags;
        delete data.dramaSeries;
        const resResult = await CoreDb().table('resources').create({ ...data });
        if (resResult == undefined || resResult.status == false) {
            await CoreDb().rollback();
            return false;
        }
        for (const performer of res.performers) {
            const resPerformerResult = await CoreDb().table('resourcesPerformers').create({ ...performer });
            if (resPerformerResult == undefined || resPerformerResult.status == false) {
                await CoreDb().rollback();
                return false;
            }
        }
        for (const tag of res.tags) {
            const resTagResult = await CoreDb().table('resourcesTags').create({ id: tag.id, resources_id: tag.resources_id, tag_id: tag.tag_id });
            if (resTagResult == undefined || resTagResult.status == false) {
                await CoreDb().rollback();
                return false;
            }
        }
        for (const dramaSeries of res.dramaSeries) {
            const resDramaSeriesResult = await CoreDb().table('resourcesDramaSeries').create({ ...dramaSeries });
            if (resDramaSeriesResult == undefined || resDramaSeriesResult.status == false) {
                await CoreDb().rollback();
                return false;
            }
        }
        //copy image 
        fileCopy(objDb.resDataPath + res.id + '.jpg', setupConfig.resCoverPosterPath + objDb.id + '/' + res.id + '.jpg');
    }

    for (const performer of performerArr) {
        //copy image 
        fileCopy(objDb.performerFaceDataPath + performer.id + '.jpg', setupConfig.performerFacePath + performer.performerBases_id + '/' + performer.id + '.jpg');
    }


    console.log('ele nedb', tagClassArr);
    console.log('ele nedb', tagObjArr);
    console.log('ele nedb', performerArr);
    console.log('ele nedb', resArr);

    await CoreDb().commit(tID);
    return true;
}



const getResData = (objDb: IdbFiles) => {
    const resAddData: Array<Iresources> = [];
    const resData = ipcRendererSend.nedbFindAll(objDb.dbResDataPath);
    //console.log(resData);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resData.forEach((item: any) => {
        const tagArr: Array<IresTagsInfo> = [];
        if (item.tagClass) {
            for (const tagClass in item.tagClass) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                item.tagClass[tagClass].forEach((tag: any) => {
                    tagArr.push({
                        id: coreCreateGuid(),
                        resources_id: item._id,
                        tag_id: tag,
                        tagClass_id: '',
                    });
                })
            }
        }
        const dramaSeries: Array<IresDramaSeries> = [];
        if (item.dramaSeries) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            item.dramaSeries.forEach((ds: any) => {
                dramaSeries.push({
                    id: coreCreateGuid(),
                    resources_id: item._id,
                    type: 'movies',
                    src: ds.src,
                });
            });
        }
        resAddData.push({
            id: item._id,
            filesBases_id: objDb.id,
            title: item.name,
            issueNumber: item.issueNumber,
            mode: EresDramaSeriesType.movies,
            coverPoster: item._id + '.jpg',
            coverPosterMode: item.photoMode == undefined ? 0 : item.photoMode,
            coverPosterWidth: item.photoWidth != null ? item.photoWidth : '300',
            coverPosterHeight: item.photoHeight != null ? item.photoHeight : '420',
            issuingDate: item.year == '' || item.year == null || item.year == undefined ? '' : item.year + '-01-01',
            country: ZH_nationality[item.nationality] ? ZH_nationality[item.nationality] : '',
            definition: item.definition == '标清' ? 'StandardDefinition' : item.definition,
            stars: item.score,
            hot: item.hot == undefined ? 0 : item.hot,
            abstract: item.notes,
            addTime: timer.dateFormat(item.addTime, 'Y-m-d H:i:s'),
            status: true,
            directors: [],
            performers: item.performers.map((p: string) => {
                return {
                    id: coreCreateGuid(),
                    resources_id: item._id,
                    performer_id: p
                }
            }),
            tags: tagArr,
            dramaSeries: dramaSeries,
            lastPlayTime: '',
            lastPlayFile: '',
        })
    })
    return resAddData;
}

const getPerformerData = (objDb: IdbFiles) => {
    const performerAddData: Array<Iperformer> = [];
    const performerData = ipcRendererSend.nedbFindAll(objDb.dbPerformerDataPath);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    performerData.forEach((item: any) => {
        performerAddData.push({
            id: item._id,
            performerBases_id: objDb.performerBases_id,
            name: item.name,
            aliasName: item.alias,
            birthday: item.birthday,
            nationality: ZH_nationality[item.nationality] ? ZH_nationality[item.nationality] : '',
            careerPerformer: true,
            careerDirector: false,
            photo: item._id + '.jpg',
            introduction: item.profiles,
            cup: item.cup ? item.cup[0].toUpperCase() : '',
            bust: '',
            waist: '',
            hip: '',
            stars: item.stars == undefined ? 0 : item.stars,
            addTime: timer.dateFormat(item.addTime, 'Y-m-d H:i:s'),
            status: true
        });
    })
    return performerAddData;
}

const getTagData = (objDb: IdbFiles) => {
    const tagAddData: { [key: string]: Array<ItagInfo> } = {};
    const tagData = ipcRendererSend.nedbFindAll(objDb.dbTagDataPath);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tagData.forEach((item: any) => {
        if (!tagAddData[item.f_id]) {
            tagAddData[item.f_id] = [];
        }
        tagAddData[item.f_id].push({
            id: item._id,
            tagClass_id: item.f_id,
            name: item.tagName,
            status: true,
            hot: item.hot == undefined ? 0 : item.hot,
            sort: tagAddData[item.f_id].length + 1,
            addTime: timer.dateFormat(item.addTime, 'Y-m-d H:i:s'),
        });
    });
    return tagAddData;
}

const getTagClassData = (objDb: IdbFiles) => {
    const tagClassAddData: Array<ItagClassInfo> = [];
    const tagsClassData = ipcRendererSend.nedbFindAll(objDb.dbTagClassDataPath);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tagsClassData.forEach((item: any) => {
        tagClassAddData.push({
            id: item._id,
            filesBases_id: objDb.id,
            name: item.name,
            leftShow: item.leftShow,
            status: true,
            hot: '0',
            sort: tagClassAddData.length + 1,
            addTime: timer.dateFormat(item.addTime, 'Y-m-d H:i:s'),
        });
    });
    return tagClassAddData;
}

const dbConvertExec = async () => {
    if (existsSync(convertFolderPath)) {
        const folders = getDbConvertFolderLists();
        for (const folder of folders) {
            const objDb = checkDbFolderTheFielsExist(folder.name);
            if (objDb === false) {
                console.log('\x1b[31m%s\x1b[0m', 'Convert Database ' + folder.name + ' missing file')
                continue;
            } else {
                const rd = await convertDb(objDb);
                if (rd) {
                    console.log('\x1b[32m%s\x1b[0m', 'Convert Database ' + folder.name + ' success');
                } else {
                    console.log('\x1b[31m%s\x1b[0m', 'Convert Database ' + folder.name + ' fail');
                }
            }
        }
    }
}

export { dbConvertExec };