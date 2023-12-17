import { CoreDb } from "@/core/core";
import { IConditions, coreDBS } from "@/core/coreDBS";
import { IresTags, IresTagsInfo } from "@/dataInterface/resources.interface";
const resourcesTagsServerData = {
    getDataListByResources_id: async function (resources_id: string) {
        return await CoreDb().table('resourcesTags').fields(['t.*', 'tag.tagClass_id']).leftJoin('tag', 't.tag_id = tag.id').where('resources_id', '=', resources_id).order('sort', 'asc').getList() as Array<IresTagsInfo>;
    },
    setResourcesTags: async function (resources_id: string, tagsArr: Array<IresTags>) {
        const tID = await CoreDb().beginTrans();
        const delStatus = await this.deleteTagsByResourcesId(resources_id);
        if (!delStatus) {
            await CoreDb().rollback();
            return false;
        }
        for (let i = 0; i < tagsArr.length; i++) {
            const addStatus = await this.addTags(tagsArr[i], i);
            if (!addStatus) {
                await CoreDb().rollback();
                return false;
            }
        }
        await CoreDb().commit(tID);
        return true;
    },
    gerResourcesTagInfo: async function (resources_id: string, tag_id: string) {
        return await CoreDb().table('resourcesTags').where('resources_id', '=', resources_id).where('tag_id', '=', tag_id).getFind();
    },
    addResourcesTags: async function (resources_id: string, tag_id: string) {
        const info = await this.gerResourcesTagInfo(resources_id, tag_id);
        if (info) {
            return;
        }
        const addResult = await CoreDb().table('resourcesTags').createGuid().create({ resources_id, tag_id, sort: 0 });
        return (addResult && addResult.status == true);
    },
    addTags: async function (obj: IresTags, sort = 0) {
        const insterObj: IConditions = { ...obj, sort }
        const addResult = await CoreDb().table('resourcesTags').create(insterObj);
        return (addResult && addResult.status == true)
    },
    deleteTagsByResourcesId: async function (resources_id: string, _dbs: coreDBS | undefined = undefined) {
        const dbs = _dbs == undefined ? CoreDb() : _dbs;
        const delResult = await dbs.table('resourcesTags').where('resources_id', '=', resources_id).deleteWhere();
        return (delResult && delResult.status == true) ? true : false;
    },
}
export { resourcesTagsServerData }