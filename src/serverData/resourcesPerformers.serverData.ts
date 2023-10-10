import { CoreDb } from "@/core/core";
import { IConditions, coreDBS } from "@/core/coreDBS";
import { IresPerformers } from "@/dataInterface/resources.interface";
const resourcesPerformersServerData = {
    getDataListByResources_id: async function (resources_id: string) {
        return await CoreDb().table('resourcesPerformers').where('resources_id', '=', resources_id).order('sort', 'asc').getList() as Array<IresPerformers>;
    },
    setResourcesPerformers: async function (resources_id: string, PerformersArr: Array<IresPerformers>) {
        const tID = await CoreDb().beginTrans();
        const delStatus = await this.deletePerformersByResourcesId(resources_id);
        if (!delStatus) {
            await CoreDb().rollback();
            return false;
        }
        for (let i = 0; i < PerformersArr.length; i++) {
            const addStatus = await this.addPerformers(PerformersArr[i], i);
            if (!addStatus) {
                await CoreDb().rollback();
                return false;
            }
        }
        await CoreDb().commit(tID);
        return true;
    },
    addPerformers: async function (obj: IresPerformers, sort = 0) {
        const insterObj: IConditions = { ...obj, sort }
        const addResult = await CoreDb().table('resourcesPerformers').create(insterObj);
        return (addResult && addResult.status == true)
    },
    deletePerformersByResourcesId: async function (resources_id: string, _dbs: coreDBS | undefined = undefined) {
        const dbs = _dbs == undefined ? CoreDb() : _dbs;
        const delResult = await dbs.table('resourcesPerformers').where('resources_id', '=', resources_id).deleteWhere();
        return (delResult && delResult.status == true) ? true : false;
    },
}
export { resourcesPerformersServerData }