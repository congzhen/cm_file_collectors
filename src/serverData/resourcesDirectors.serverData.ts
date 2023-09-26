import { CoreDb } from "@/core/core";
import { IConditions, coreDBS } from "@/core/coreDBS";
import { IresDirectors } from "@/dataInterface/resources.interface";
const resourcesDirectorsServerData = {
    getDataListByResources_id: async function (resources_id: string) {
        return await CoreDb().table('resourcesDirectors').where('resources_id', '=', resources_id).getList() as Array<IresDirectors>;
    },
    setResourcesDirectors: async function (resources_id: string, directorsArr: Array<IresDirectors>) {
        const tID = await CoreDb().beginTrans();
        const delStatus = await this.deleteDirectorsByResourcesId(resources_id);
        if (!delStatus) {
            await CoreDb().rollback();
            return false;
        }
        for (let i = 0; i < directorsArr.length; i++) {
            const addStatus = await this.addDirectors(directorsArr[i]);
            if (!addStatus) {
                await CoreDb().rollback();
                return false;
            }
        }
        await CoreDb().commit(tID);
        return true;
    },
    addDirectors: async function (obj: IresDirectors) {
        const addResult = await CoreDb().table('resourcesDirectors').create(obj as unknown as IConditions);
        return (addResult && addResult.status == true)
    },
    deleteDirectorsByResourcesId: async function (resources_id: string, _dbs: coreDBS | undefined = undefined) {
        const dbs = _dbs == undefined ? CoreDb() : _dbs;
        const delResult = await dbs.table('resourcesDirectors').where('resources_id', '=', resources_id).deleteWhere();
        return (delResult && delResult.status == true) ? true : false;
    },
}
export { resourcesDirectorsServerData }