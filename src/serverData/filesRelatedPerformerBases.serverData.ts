import { CoreDb } from "@/core/core"
import { coreDBS } from "@/core/coreDBS";
import { IfilesRelatedPerformerBases } from "@/dataInterface/databases.interface"
const filesRelatedPerformerBasesServerData = {
    getDataList: async function () {
        return await CoreDb().table('filesRelatedPerformerBases').getList() as Array<IfilesRelatedPerformerBases>;
    },
    setFilesBasesRealted: async function (filesBases_id: string, mainPerformerId: string, relatedPerformerDatabase: Array<string>): Promise<boolean> {
        if (!relatedPerformerDatabase.includes(mainPerformerId)) {
            relatedPerformerDatabase.push(mainPerformerId);
        }
        const tID = await CoreDb().beginTrans();
        const delResult = await this.delAllByFilesBasesId(filesBases_id);
        if (delResult == undefined || delResult.status == false) {
            await CoreDb().rollback();
            return false;
        }
        for (const key in relatedPerformerDatabase) {
            const addResult = await this.add(filesBases_id, relatedPerformerDatabase[key], (relatedPerformerDatabase[key] == mainPerformerId ? 1 : 0));
            if (addResult == undefined || addResult.status == false) {
                await CoreDb().rollback();
                return false;
            }
        }
        await CoreDb().commit(tID);
        return true;
    },
    /**
     * 此函数只能用于添加演员集，不能用于修改中执行
     * @param performerBases_id 
     * @param relatedFilesDatabase 
     * @returns 
     */
    setPerformerBasesRealted: async function (performerBases_id: string, relatedFilesDatabase: Array<string>) {
        const tID = await CoreDb().beginTrans();
        for (const key in relatedFilesDatabase) {
            const addResult = await this.add(relatedFilesDatabase[key], performerBases_id, 0);
            if (addResult == undefined || addResult.status == false) {
                await CoreDb().rollback();
                return false;
            }
        }
        await CoreDb().commit(tID);
        return true;
    },
    getRealtedInfo: async function (filesBases_id: string, performerBases_id: string) {
        return await CoreDb().table('filesRelatedPerformerBases').where('filesBases_id', '=', filesBases_id).where('performerBases_id', '=', performerBases_id).getFind();
    },
    getRealtedCountByPerformerBases_id: async function (performerBases_id: string) {
        return await CoreDb().table('filesRelatedPerformerBases').where('performerBases_id', '=', performerBases_id).getCount();
    },
    add: async function (filesBases_id: string, performerBases_id: string, main = 0) {
        const o = {
            filesBases_id,
            performerBases_id,
            main,
        }
        return await CoreDb().table('filesRelatedPerformerBases').createGuid().create(o);
    },
    delAllByFilesBasesId: async function (filesBases_id: string, _dbs: coreDBS | undefined = undefined) {
        const dbs = _dbs == undefined ? CoreDb() : _dbs;
        return await dbs.table('filesRelatedPerformerBases').where('filesBases_id', '=', filesBases_id).deleteWhere();
    },
}

export { filesRelatedPerformerBasesServerData }