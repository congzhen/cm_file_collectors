import { CoreDb } from "@/core/core";
import { IConditions, coreDBS, linkMode } from "@/core/coreDBS";
import { IresDramaSeries, IresDramaSeriesM3u8Builder, IresDramaSeriesParhReplaceerInfo } from "@/dataInterface/resources.interface";
const resourcesDramaSeriesServerData = {
    getDramaSeriesInfoById: async function (id: string) {
        return await CoreDb().table('resourcesDramaSeries').getInfo(id) as IresDramaSeries;
    },
    getDataListByResources_id: async function (resources_id: string) {
        return await CoreDb().table('resourcesDramaSeries').where('resources_id', '=', resources_id).order('sort', 'asc').getList() as Array<IresDramaSeries>;
    },
    getDataListByLikeSrcAndResources_id: async function (likeText: string, resources_id: string) {
        return await CoreDb().table('resourcesDramaSeries').where('resources_id', '=', resources_id).whereLike('src', likeText).getList() as Array<IresDramaSeries>;
    },
    getDataListByLikeSrc: async function (likeText: string, inFilesBases = []) {
        const CDB = CoreDb().table('resourcesDramaSeries').fields(['*', 'r.title', 'r.issueNumber']).leftJoin('resources as r', 't.resources_id = r.id');
        if (inFilesBases.length > 0) {
            CDB.whereIn('filesBases_id', inFilesBases, linkMode.and, 'r');
        }
        return await CDB.whereLike('src', likeText).getList() as Array<IresDramaSeriesParhReplaceerInfo>;
    },
    setResourcesDramaSeries: async function (resources_id: string, DramaSeriesArr: Array<IresDramaSeries>) {
        const tID = await CoreDb().beginTrans();
        const delStatus = await this.deleteDramaSeriesByResourcesId(resources_id);
        if (!delStatus) {
            await CoreDb().rollback();
            return false;
        }
        for (let i = 0; i < DramaSeriesArr.length; i++) {
            const addStatus = await this.addDramaSeries(DramaSeriesArr[i], i);
            if (!addStatus) {
                await CoreDb().rollback();
                return false;
            }
        }
        await CoreDb().commit(tID);
        return true;
    },
    addDramaSeries: async function (obj: IresDramaSeries, sort = 0) {
        const insterObj: IConditions = { ...obj, sort, m3u8BuilderTime: null }
        const addResult = await CoreDb().table('resourcesDramaSeries').create(insterObj);
        return (addResult && addResult.status == true)
    },
    deleteDramaSeriesByResourcesId: async function (resources_id: string, _dbs: coreDBS | undefined = undefined) {
        const dbs = _dbs == undefined ? CoreDb() : _dbs;
        const delResult = await dbs.table('resourcesDramaSeries').where('resources_id', '=', resources_id).deleteWhere();
        return (delResult && delResult.status == true) ? true : false;
    },
    replaceSrc: async function (_search: string, _replace: string, _idList: Array<string>) {
        const result = await CoreDb().table('resourcesDramaSeries').whereIn('id', _idList).updeteWhere({
            'src': [`REPLACE(src, '${_search}', '${_replace}')`, 'sql']
        });
        return (result && result.status == true)
    },
    getDramaSeriesNeedM3u8BuilderInfo: async function () {
        return await CoreDb().table('resourcesDramaSeries').fields(['t.*', 'r.title as resources_name']).leftJoin('resources as r', 't.resources_id = r.id').where('type', '=', 'movies').where('m3u8BuilderStatus', '=', '0').order('m3u8BuilderTime', 'ASC').order('addTime', 'DESC', 'r').order('m3u8BuilderTime', 'NULLS FIRST').getFind() as IresDramaSeriesM3u8Builder;
    },
    updateM3u8BuilderInfo: async function (id: string, builderTime: string, builderStatus: number) {
        await CoreDb().table('resourcesDramaSeries').update(id, { m3u8BuilderTime: builderTime, m3u8BuilderStatus: builderStatus });
    },
}

export { resourcesDramaSeriesServerData }