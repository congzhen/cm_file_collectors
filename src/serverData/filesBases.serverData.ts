import { CoreDb } from "@/core/core"
import { IfilesBases } from "@/dataInterface/databases.interface"
import { filesRelatedPerformerBasesServerData } from "@/serverData/filesRelatedPerformerBases.serverData"
import { resourcesServerData } from "@/serverData/resources.serverData"
import { tagClassServerData } from "./tagClass.serverData"
import { filesBasesSettingServerData } from "./filesBasesSetting.serverData"
const filesBasesServerData = {
    getDataList: async function () {
        return await CoreDb().table('filesBases').noWhere().order('sort').getList() as Array<IfilesBases>;
    },
    getCount: async function () {
        return await CoreDb().table('filesBases').getCount();
    },
    getStatusCount: async function (status: number) {
        return await CoreDb().table('filesBases').where('status', '=', status.toString()).getCount();
    },
    add: async function (name: string, mainPerformerId: string, relatedPerformerDatabase: Array<string>): Promise<boolean> {
        const tID = await CoreDb().beginTrans();
        const filesBasesCount = await this.getCount();
        const addResult = await CoreDb().table('filesBases').createGuid().createTime().create({ name: name, sort: (filesBasesCount + 1) });
        if (addResult == undefined || addResult.status == false) {
            await CoreDb().rollback();
            return false;
        }
        const filesBases_id = addResult.data?.id as string;
        const realtedResult = await filesRelatedPerformerBasesServerData.setFilesBasesRealted(filesBases_id, mainPerformerId, relatedPerformerDatabase)
        if (!realtedResult) {
            await CoreDb().rollback();
            return false;
        }
        await CoreDb().commit(tID);
        return true;
    },
    edit: async function (id: string, name: string, mainPerformerId: string, relatedPerformerDatabase: Array<string>) {
        const tID = await CoreDb().beginTrans();
        const editResult = await CoreDb().table('filesBases').update(id, { name });
        if (editResult == undefined || editResult.status == false) {
            await CoreDb().rollback();
            return false;
        }
        const realtedResult = await filesRelatedPerformerBasesServerData.setFilesBasesRealted(id, mainPerformerId, relatedPerformerDatabase)
        if (!realtedResult) {
            await CoreDb().rollback();
            return false;
        }
        await CoreDb().commit(tID);
        return true;
    },
    status: async function (id: string, status: boolean) {
        const result = await CoreDb().table('filesBases').update(id, { status: (status ? 1 : 0) });
        if (result == undefined || result.status == false) {
            return false;
        }
        return true;
    },
    sort: async function (id: string, type: string) {
        const data = await CoreDb().table('filesBases').getInfo(id) as IfilesBases;
        const count = await this.getCount();
        let exchangeSort: number;
        if (type == 'down') {
            exchangeSort = data.sort + 1;
        } else {
            exchangeSort = data.sort - 1;
        }
        if (exchangeSort < 1 || exchangeSort > count) {
            return false;
        }
        const exchangeData = await CoreDb().table('filesBases').find({ sort: exchangeSort }) as IfilesBases;
        const tID = await CoreDb().beginTrans();
        const editResult1 = await CoreDb().table('filesBases').update(id, { sort: exchangeSort });
        const editResult2 = await CoreDb().table('filesBases').update(exchangeData.id, { sort: data.sort });
        if (editResult1 == undefined || editResult1.status == false || editResult2 == undefined || editResult2.status == false) {
            await CoreDb().rollback();
            return false;
        }
        await CoreDb().commit(tID);
        return true;
    },
    delete: async function (id: string) {
        const databaseNum = await this.getCount();
        if (databaseNum <= 1) {
            return false;
        }
        const dbs = await CoreDb();
        const tID = await dbs.beginTrans();
        try {
            const rd = await dbs.table('filesBases').delete(id);
            if (rd == undefined || rd.status == false || rd.aAffectedRows == 0) {
                await dbs.rollback();
                return false;
            }
            const rdBasesSetting = filesBasesSettingServerData.delete(id, dbs);
            if (!rdBasesSetting) {
                await dbs.rollback();
                return false;
            }

            const rdRelated = filesRelatedPerformerBasesServerData.delAllByFilesBasesId(id, dbs);
            if (!rdRelated) {
                await dbs.rollback();
                return false;
            }
            const rdDelResources = await resourcesServerData.deleteByFilesBasesId(id, dbs);
            if (!rdDelResources) {
                await dbs.rollback();
                return false;
            }
            const rdDelTag = await tagClassServerData.deleteByFilesBasesId(id, dbs);
            if (!rdDelTag) {
                await dbs.rollback();
                return false;
            }
            await dbs.commit(tID);
            return true;
        } catch (e: unknown) {
            await dbs.rollback();
            return false;
        }



    },
}

export { filesBasesServerData }