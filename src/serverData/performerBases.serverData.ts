import { CoreDb } from "@/core/core"
import { IperformerBases } from "@/dataInterface/databases.interface"
import { filesRelatedPerformerBasesServerData } from "@/serverData/filesRelatedPerformerBases.serverData"
const performerBasesServerData = {
    getInfoById: async function (id: string) {
        return await CoreDb().table('performerBases').noWhere().getInfo(id) as IperformerBases | undefined;
    },
    getDataList: async function () {
        return await CoreDb().table('performerBases').noWhere().order('sort').getList() as Array<IperformerBases>;
    },
    getCount: async function () {
        return await CoreDb().table('performerBases').getCount();
    },
    addSimple: async function (id: string, name: string) {
        const performerBasesCount = await this.getCount();
        const addResult = await CoreDb().table('performerBases').create({ id, name, sort: (performerBasesCount + 1) });
        if (addResult == undefined || addResult.status == false) {
            return false;
        }
        return true;
    },
    add: async function (name: string, relatedFilesDatabase: Array<string>) {
        const tID = await CoreDb().beginTrans();
        const performerBasesCount = await this.getCount();
        const addResult = await CoreDb().table('performerBases').createGuid().createTime().create({ name: name, sort: (performerBasesCount + 1) });
        if (addResult == undefined || addResult.status == false) {
            await CoreDb().rollback();
            return false;
        }
        const performerBases_id = addResult.data?.id as string;
        const realtedResult = await filesRelatedPerformerBasesServerData.setPerformerBasesRealted(performerBases_id, relatedFilesDatabase)
        if (!realtedResult) {
            await CoreDb().rollback();
            return false;
        }
        await CoreDb().commit(tID);
        return true;
    },
    edit: async function (id: string, name: string) {
        const editResult = await CoreDb().table('performerBases').update(id, { name });
        if (editResult == undefined || editResult.status == false) {
            return false;
        }
        return true;
    },
    status: async function (id: string, status: boolean) {
        const result = await CoreDb().table('performerBases').update(id, { status: (status ? 1 : 0) });
        if (result == undefined || result.status == false) {
            return false;
        }
        return true;
    },
    sort: async function (id: string, type: string) {
        const data = await CoreDb().table('performerBases').getInfo(id) as IperformerBases;
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
        const exchangeData = await CoreDb().table('performerBases').find({ sort: exchangeSort }) as IperformerBases;
        const tID = await CoreDb().beginTrans();
        const editResult1 = await CoreDb().table('performerBases').update(id, { sort: exchangeSort });
        const editResult2 = await CoreDb().table('performerBases').update(exchangeData.id, { sort: data.sort });
        if (editResult1 == undefined || editResult1.status == false || editResult2 == undefined || editResult2.status == false) {
            await CoreDb().rollback();
            return false;
        }
        await CoreDb().commit(tID);
        return true;
    },
}

export { performerBasesServerData }