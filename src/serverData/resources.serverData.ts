import { CoreDb } from "@/core/core";
import { IConditions, coreDBS } from "@/core/coreDBS";
import { coreCreateGuid } from "@/core/coreGuid";
import { IresDramaSeries, IresTags, IresDirectors, IresPerformers, Iresources, IresourcesBase, IresWhereObj, IresSimpleAnddramaSeries } from "@/dataInterface/resources.interface";
import { resourcesTagsServerData } from "@/serverData/resourcesTags.serverData"
import { resourcesDirectorsServerData } from "./resourcesDirectors.serverData";
import { resourcesPerformersServerData } from "./resourcesPerformers.serverData";
import { resourcesDramaSeriesServerData } from "./resourcesDramaSeries.serverData";
import { searchStore } from '@/store/search.store';
import { EsearchLogic } from "@/dataInterface/common.enum";
import { IsearchCondition } from "@/dataInterface/common.interface";
enum EnumResExecMode {
    add,
    edit,
}
const resourcesServerData = {
    getBaseInfoById: async function (id: string) {
        return await CoreDb().table('resources').getInfo(id) as Iresources;
    },
    getRecordQuantityByFilesBasesId: async function (filesBases_id: string) {
        return await CoreDb().table('resources').where('filesBases_id', '=', filesBases_id).getCount();
    },
    getInfoById: async function (id: string) {
        const info = await this.getBaseInfoById(id);
        if (!info) {
            return info;
        }
        info.directors = await resourcesDirectorsServerData.getDataListByResources_id(id);
        info.dramaSeries = await resourcesDramaSeriesServerData.getDataListByResources_id(id);
        info.performers = await resourcesPerformersServerData.getDataListByResources_id(id);
        info.tags = await resourcesTagsServerData.getDataListByResources_id(id);
        return info;
    },
    getDataListPagingByFilesBases_id: async function (filesBases_id: string, whereObj: IresWhereObj) {
        let dbsC = resourcesSearchCondition.getDataListPagingByFilesBases_id_Sql(filesBases_id);
        dbsC = resourcesSearchCondition.setOrder(dbsC, whereObj.sortMode);
        const dataList = await dbsC.limit(whereObj.page, whereObj.limit).getList() as Array<IresourcesBase>;
        const dataCount = await resourcesSearchCondition.getDataListPagingByFilesBases_id_Sql(filesBases_id).getCount();
        return { dataList, dataCount, whereObj };
    },
    getDataListPagingBySearchCondition: async function (filesBases_id: string, searchCondition: IsearchCondition, page = 1, limit = 30, sortMode = 'desc') {
        let dbsC = resourcesSearchCondition.getDataListPagingByFilesBases_id_Sql(filesBases_id, searchCondition);
        dbsC = resourcesSearchCondition.setOrder(dbsC, sortMode);
        const dataList = await dbsC.limit(page, limit).order('addTime', 'desc').getList() as Array<IresourcesBase>;
        const dataCount = await resourcesSearchCondition.getDataListPagingByFilesBases_id_Sql(filesBases_id, searchCondition).getCount();
        return { dataList, dataCount };
    },
    getDataListOrderLastPlayTime: async function (filesBases_id: string, limit = 10) {
        const dataList = await CoreDb().table('resources').where('filesBases_id', '=', filesBases_id).order('lastPlayTime', 'desc').limit(1, limit).getList() as Array<IresourcesBase>;
        return await this.IresourcesBaseToIresources(dataList);
    },
    getDataListOrderHot: async function (filesBases_id: string, limit = 10) {
        const dataList = await CoreDb().table('resources').where('filesBases_id', '=', filesBases_id).order('hot', 'desc').limit(1, limit).getList() as Array<IresourcesBase>;
        return await this.IresourcesBaseToIresources(dataList);
    },
    getDataListOrderYouLike: async function (filesBases_id: string, tag_idArr: string[], limit = 10) {
        const cdb = CoreDb().table('resources').where('filesBases_id', '=', filesBases_id);
        const tagSql: Array<string> = tag_idArr.map(tagId => { return '(select count(*) from resourcesTags where  tag_id = "' + tagId + '" and  resources_id = resources.id) > 0' });
        if (tagSql.length > 0) {
            cdb.whereSql(tagSql.join(' and '));
        }
        const dataList = await cdb.limit(1, limit).order('id', 'Rand').getList() as Array<IresourcesBase>;
        return await this.IresourcesBaseToIresources(dataList);
    },
    getDataListAddTimeAndSeries: async function (likeText: string, inFilesBases = [], addTime: null | Array<string> = null) {
        const CDB = CoreDb().table('resources');
        if (inFilesBases.length > 0) {
            CDB.whereIn('filesBases_id', inFilesBases);
        }
        if (addTime != null) {
            CDB.whereDateRange('addTime', 'addTime', addTime[0], addTime[1]);
        }
        const datalist = await CDB.getList() as Array<IresourcesBase>;
        const l: Array<IresSimpleAnddramaSeries> = [];
        for (const data of datalist) {
            let seriesList: Array<IresDramaSeries> = [];
            if (likeText != '') {
                seriesList = await resourcesDramaSeriesServerData.getDataListByLikeSrcAndResources_id(likeText, data.id);
                if (seriesList.length == 0) {
                    continue;
                }
            }
            l.push({
                id: data.id,
                title: data.title,
                filesBases_id: data.filesBases_id,
                issueNumber: data.issueNumber,
                addTime: data.addTime,
                coverPoster: data.coverPoster,
                dramaSeries: seriesList,
            })
        }
        return l;
    },
    IresourcesBaseToIresources: async function (dataList: Array<IresourcesBase>) {
        const dataInfoList: Array<Iresources> = [];
        for (const res of dataList) {
            dataInfoList.push({
                ...res,
                directors: await resourcesDirectorsServerData.getDataListByResources_id(res.id),
                dramaSeries: await resourcesDramaSeriesServerData.getDataListByResources_id(res.id),
                performers: await resourcesPerformersServerData.getDataListByResources_id(res.id),
                tags: await resourcesTagsServerData.getDataListByResources_id(res.id),
            });
        }
        return dataInfoList;
    },
    exec: async function (formdata: IConditions, mode: EnumResExecMode) {
        const tID = await CoreDb().beginTrans();
        const dataObj = resourcesSearchCondition.execFormData(formdata as IConditions, mode);
        let resStatus;
        if (mode == EnumResExecMode.add) {
            resStatus = this.add(dataObj.dataObject);
        } else {
            resStatus = this.update(dataObj.id, dataObj.dataObject);
        }
        if (!resStatus) {
            await CoreDb().rollback();
            return false;
        }
        const tagStatus = await resourcesTagsServerData.setResourcesTags(dataObj.id, dataObj.tags);
        if (!tagStatus) {
            await CoreDb().rollback();
            return false;
        }
        const directorsStatus = await resourcesDirectorsServerData.setResourcesDirectors(dataObj.id, dataObj.directors)
        if (!directorsStatus) {
            await CoreDb().rollback();
            return false;
        }

        const performersStatus = await resourcesPerformersServerData.setResourcesPerformers(dataObj.id, dataObj.performers);
        if (!performersStatus) {
            await CoreDb().rollback();
            return false;
        }

        const dramaSeriesStatus = await resourcesDramaSeriesServerData.setResourcesDramaSeries(dataObj.id, dataObj.dramaSeries);
        if (!dramaSeriesStatus) {
            await CoreDb().rollback();
            return false;
        }
        await CoreDb().commit(tID);
        return true;
    },
    add: async function (formdata: IConditions) {
        const addResult = await CoreDb().table('resources').createTime().create(formdata);
        if (addResult == undefined || addResult.status == false) {
            return false;
        }
        return true;
    },
    update: async function (id: string, obj: IConditions) {
        const editResult = await CoreDb().table('resources').update(id, obj);
        if (editResult == undefined || editResult.status == false) {
            return false;
        }
        return true;
    },
    updatePlay: async function (id: string, lastPlayFile: string) {
        const editResult = await CoreDb().table('resources').upDateTime('lastPlayTime').update(id, {
            lastPlayFile: lastPlayFile,
            hot: [1, 'ass']
        });
        if (editResult == undefined || editResult.status == false) {
            return false;
        }
        return true;
    },
    delete: async function (id: string, _dbs: coreDBS | undefined = undefined) {
        const dbs = _dbs == undefined ? CoreDb() : _dbs;
        const tID = await dbs.beginTrans();
        const delResult = await dbs.table('resources').delete(id);
        if (delResult == undefined || delResult.status == false) {
            await dbs.rollback();
            return false;
        }
        const delDirectorsStatus = resourcesDirectorsServerData.deleteDirectorsByResourcesId(id, dbs);
        if (!delDirectorsStatus) {
            await dbs.rollback();
            return false;
        }
        const delPerformersStatus = resourcesPerformersServerData.deletePerformersByResourcesId(id, dbs);
        if (!delPerformersStatus) {
            await dbs.rollback();
            return false;
        }
        const delTagsStatus = resourcesTagsServerData.deleteTagsByResourcesId(id, dbs);
        if (!delTagsStatus) {
            await dbs.rollback();
            return false;
        }
        const delDramaSeriesStatus = resourcesDramaSeriesServerData.deleteDramaSeriesByResourcesId(id, dbs);
        if (!delDramaSeriesStatus) {
            await dbs.rollback();
            return false;
        }
        await dbs.commit(tID);
        return true;
    },
    deleteByFilesBasesId: async function (filesBases_id: string, _dbs: coreDBS | undefined = undefined) {
        const dbs = _dbs == undefined ? CoreDb() : _dbs;
        const tID = await dbs.beginTrans();
        const filesBasesRecordList = await dbs.table('resources').where('filesBases_id', '=', filesBases_id).getList() as Array<IresourcesBase>;
        for (const resourcesBase of filesBasesRecordList) {
            const rd = await this.delete(resourcesBase.id, dbs);
            if (!rd) {
                await dbs.rollback();
                return false;
            }
        }
        await dbs.commit(tID);
        return true;
    }
}


const resourcesSearchCondition = {
    execFormData: function (formdataObj: IConditions, mode: EnumResExecMode) {
        const subDataKeyArr = ['tags', 'directors', 'performers', 'dramaSeries'];
        const id = formdataObj.id as string;
        if (mode == EnumResExecMode.edit) {
            delete formdataObj.id;
        }
        const tagsObj = formdataObj.tags as { [key: string]: Array<string> };
        const tags: Array<IresTags> = [];
        for (const key in tagsObj) {
            tagsObj[key].forEach(item => {
                tags.push({
                    id: coreCreateGuid(),
                    resources_id: id,
                    tag_id: item,
                })
            })
        }

        const directors: Array<IresDirectors> = [];
        (formdataObj.directors as Array<string>).forEach(item => {
            directors.push({
                id: coreCreateGuid(),
                resources_id: id,
                performer_id: item,
            })
        });

        const performers: Array<IresPerformers> = [];
        (formdataObj.performers as Array<string>).forEach(item => {
            performers.push({
                id: coreCreateGuid(),
                resources_id: id,
                performer_id: item,
            })
        })

        const dramaSeries = formdataObj.dramaSeries as IresDramaSeries[];

        const dataObject: IConditions = {};
        for (const key in formdataObj) {
            if (!subDataKeyArr.includes(key)) {
                dataObject[key] = formdataObj[key];
            }
        }
        return {
            id,
            dataObject,
            tags,
            directors,
            performers,
            dramaSeries,
        }
    },
    getDataListPagingByFilesBases_id_Sql: function (filesBases_id: string, _searchCondition: IsearchCondition | undefined = undefined) {
        const searchCondition = _searchCondition == undefined ? searchStore().searchCondition : _searchCondition;
        let CDB = CoreDb().table('resources').where('filesBases_id', '=', filesBases_id);
        if (searchCondition.text != '') {
            const searchLikeText = '%' + searchCondition.text.replace(/[\s-]/g, "%") + '%';
            CDB.whereSql('((resources.title LIKE @likeText) or (resources.issueNumber  LIKE @likeText ) )', { likeText: searchLikeText });
            //CDB.whereLike('title', searchCondition.text);
        }
        CDB = this.setCDBGroup(CDB, 'mode', searchCondition.resMode.logic, searchCondition.resMode.value);
        CDB = this.setCDBGroup(CDB, 'country', searchCondition.country.logic, searchCondition.country.value);
        CDB = this.setCDBGroup(CDB, 'definition', searchCondition.definition.logic, searchCondition.definition.value);
        CDB = this.setCDBGroupIssuingDate(CDB, 'issuingDate', searchCondition.year.logic, searchCondition.year.value);
        CDB = this.setCDBGroup(CDB, 'stars', searchCondition.starRating.logic, searchCondition.starRating.value);
        CDB = this.setCDBGroupPerformer(CDB, searchCondition.performer.logic, searchCondition.performer.value);
        CDB = this.setCDBGroupCup(CDB, searchCondition.cup.logic, searchCondition.cup.value);
        for (const key in searchCondition.diyTag) {
            CDB = this.setCDBGroupTag(CDB, key, searchCondition.diyTag[key].logic, searchCondition.diyTag[key].value);
        }

        return CDB;
    },
    setCDBGroup: function (_CDB: coreDBS, field: string, logic: EsearchLogic, dataArr: string[]) {
        if (dataArr.length == 0) {
            return _CDB;
        }
        if (logic == EsearchLogic.single) {
            _CDB.where(field, '=', dataArr[0]);
        } else {
            const cFieldArr: Array<{ filed: string, condition: string, value: unknown, link: string }> = [];
            let link = 'and';
            if (logic == EsearchLogic.or) {
                link = 'or';
            }
            dataArr.forEach((v: string) => {
                cFieldArr.push({
                    filed: field,
                    condition: logic == EsearchLogic.not ? '!=' : '=',
                    value: v,
                    link: link,
                });
            })
            _CDB.whereGroup(cFieldArr);
        }
        return _CDB;
    },
    setCDBGroupIssuingDate: function (_CDB: coreDBS, field: string, logic: EsearchLogic, dataArr: string[]) {
        if (dataArr.length == 0) {
            return _CDB;
        }
        if (logic == EsearchLogic.single) {
            _CDB.whereSql("strftime('%Y', " + field + ") = @singleYear", { singleYear: dataArr[0] });
        } else {
            const obj: { [key: string]: string } = {};
            const sqlArray: Array<string> = [];
            dataArr.forEach((v: string, index: number) => {
                const key = 'noSingleYear_' + index;
                obj[key] = v;
                sqlArray.push(" strftime('%Y', " + field + ") = @" + key);
            });
            _CDB.whereSql(' ( ' + sqlArray.join(' ' + (logic == EsearchLogic.or ? 'or' : 'and') + ' ') + ')', obj);
        }
        return _CDB;
    },
    setCDBGroupPerformer: function (_CDB: coreDBS, logic: EsearchLogic, dataArr: string[]) {
        if (dataArr.length == 0) {
            return _CDB;
        }
        if (dataArr[0] == 'noPerformer') {
            _CDB.whereSql("(select count(*) from resourcesPerformers where resources_id = resources.id) = 0");
        } else if (logic == EsearchLogic.single) {
            _CDB.whereSql("id in (select resources_id from resourcesPerformers where performer_id = @resPerformersId)", { resPerformersId: dataArr[0] });
        } else if (logic == EsearchLogic.or) {
            const sqlArr: Array<string> = [];
            const perObj: { [key: string]: string } = {}
            dataArr.forEach((item: string, index: number) => {
                const boxName = "resPerformersId_" + index;
                sqlArr.push("performer_id = @" + boxName)
                perObj[boxName] = item;
            })
            _CDB.whereSql("id in (select resources_id from resourcesPerformers where " + sqlArr.join(' or ') + ")", perObj)
        } else if (logic == EsearchLogic.and) {
            const sqlArr: Array<string> = [];
            const perObj: { [key: string]: string } = {}
            dataArr.forEach((item: string, index: number) => {
                const boxName = "resPerformersId_" + index;
                sqlArr.push(' (select count(*) from resourcesPerformers where  resources_id = resources.id and performer_id = @' + boxName + ') > 0');
                perObj[boxName] = item;
            });
            _CDB.whereSql(sqlArr.join(' and '), perObj);
        }
        return _CDB;
    },
    setCDBGroupCup: function (_CDB: coreDBS, logic: EsearchLogic, dataArr: string[]) {
        if (dataArr.length == 0) {
            return _CDB;
        }
        if (logic == EsearchLogic.single) {
            _CDB.whereSql("id in (select resources_id from resourcesPerformers where performer_id in (select id from performer where cup = @pCup))", { pCup: dataArr[0] });
        } else if (logic == EsearchLogic.or) {
            const sqlArr: Array<string> = [];
            const perObj: { [key: string]: string } = {}
            dataArr.forEach((item: string, index: number) => {
                const boxName = "cup_" + index;
                sqlArr.push("cup = @" + boxName)
                perObj[boxName] = item;
            })
            _CDB.whereSql("id in (select resources_id from resourcesPerformers where performer_id in (select id from performer where " + sqlArr.join(' or ') + "))", perObj);
        } else if (logic == EsearchLogic.and) {
            const sqlArr: Array<string> = [];
            const perObj: { [key: string]: string } = {}
            dataArr.forEach((item: string, index: number) => {
                const boxName = "cupAnd_" + index;
                sqlArr.push(' (select count(*) from resourcesPerformers where  resources_id = resources.id and performer_id in (select id from performer where cup = @' + boxName + ') ) > 0');
                perObj[boxName] = item;
            });
            _CDB.whereSql(sqlArr.join(' and '), perObj);
        }
        return _CDB;
    },
    setCDBGroupTag: function (_CDB: coreDBS, tagClass_id: string, logic: EsearchLogic, dataArr: string[]) {
        if (dataArr.length == 0) {
            return _CDB;
        }
        if (logic == EsearchLogic.single) {
            const boxName = 'tagClassId_' + tagClass_id;
            _CDB.whereSql("id in (select resources_id from resourcesTags where tag_id = @" + boxName + ")", { [boxName]: dataArr[0] });
        } else if (logic == EsearchLogic.or) {
            const sqlArr: Array<string> = [];
            const perObj: { [key: string]: string } = {}
            dataArr.forEach((item: string, index: number) => {
                const boxName = "tag_" + tagClass_id + '_' + index;
                sqlArr.push("tag_id = @" + boxName)
                perObj[boxName] = item;
            })
            _CDB.whereSql("id in (select resources_id from resourcesTags where " + sqlArr.join(' or ') + ")", perObj);
        } else if (logic == EsearchLogic.and) {
            const sqlArr: Array<string> = [];
            const perObj: { [key: string]: string } = {}
            dataArr.forEach((item: string, index: number) => {
                const boxName = "tag_" + tagClass_id + '_' + index;
                sqlArr.push(' (select count(*) from resourcesTags where  tag_id = @' + boxName + ' and  resources_id = resources.id) > 0');
                perObj[boxName] = item;
            });
            _CDB.whereSql(sqlArr.join(' and '), perObj);
        } else if (logic == EsearchLogic.not) {
            const sqlArr: Array<string> = [];
            const perObj: { [key: string]: string } = {}
            dataArr.forEach((item: string, index: number) => {
                const boxName = "tag_" + tagClass_id + '_' + index;
                sqlArr.push(' (select count(*) from resourcesTags where  tag_id = @' + boxName + ' and  resources_id = resources.id) = 0');
                perObj[boxName] = item;
            });
            _CDB.whereSql(sqlArr.join(' and '), perObj);
        }
        return _CDB;
    },
    setOrder: function (_CDB: coreDBS, sortMode: string) {
        switch (sortMode) {
            case 'asc':
                _CDB.order('addTime', 'asc');
                break;
            case 'issuingDateAsc':
                _CDB.order('CASE WHEN issuingDate = "" THEN 1  ELSE 0 END,issuingDate', 'asc');
                break;
            case 'issuingDateDesc':
                _CDB.order('CASE WHEN issuingDate = "" THEN 1  ELSE 0 END,issuingDate', 'desc');
                break;
            case 'titleAsc':
                _CDB.order('title', 'asc');
                break;
            case 'titleDesc':
                _CDB.order('title', 'desc');
                break;
            default:
                _CDB.order('addTime', 'desc');
        }
        return _CDB;
    },

}

export { resourcesServerData, EnumResExecMode }