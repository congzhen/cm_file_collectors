import { CoreDb } from "@/core/core";
import { IConditions } from "@/core/coreDBS";
import { IresPerformers } from "@/dataInterface/resources.interface";
const resourcesPerformersServerData = {
    getDataListByResources_id: async function (resources_id: string) {
        return await CoreDb().table('resourcesPerformers').where('resources_id', '=', resources_id).getList() as Array<IresPerformers>;
    },
    setResourcesPerformers: async function (resources_id: string, PerformersArr: Array<IresPerformers>) {
        const tID = await CoreDb().beginTrans();
        const delStatus = await this.deletePerformersByResourcesId(resources_id);
        if (!delStatus) {
            await CoreDb().rollback();
            return false;
        }
        for (let i = 0; i < PerformersArr.length; i++) {
            const addStatus = await this.addPerformers(PerformersArr[i]);
            if (!addStatus) {
                await CoreDb().rollback();
                return false;
            }
        }
        await CoreDb().commit(tID);
        return true;
    },
    addPerformers: async function (obj: IresPerformers) {
        const addResult = await CoreDb().table('resourcesPerformers').create(obj as unknown as IConditions);
        return (addResult && addResult.status == true)
    },
    deletePerformersByResourcesId: async function (resources_id: string) {
        const delResult = await CoreDb().table('resourcesPerformers').where('resources_id', '=', resources_id).deleteWhere();
        return (delResult && delResult.status == true) ? true : false;
    },
}
export { resourcesPerformersServerData }