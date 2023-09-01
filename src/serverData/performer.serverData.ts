import { CoreDb } from "@/core/core"
import { IConditions } from "@/core/coreDBS";
import { Iperformer } from "@/dataInterface/performer.interface";

const performerServerData = {
    getDataList: async function () {
        return await CoreDb().table('performer').noWhere().order('addTime', 'desc').getList() as Array<Iperformer>;
    },
    getInfoById: async function (id: string) {
        return await CoreDb().table('performer').getInfo(id) as Iperformer;
    },
    getInfoByName: async function (name: string) {
        return await CoreDb().table('performer').where('name', '=', name).getFind() as Iperformer | undefined;
    },
    existPhoto: async function (photo: string) {
        return await CoreDb().table('performer').where('photo', '=', photo).getFind() === undefined ? false : true;
    },
    SQL_DataListByPerformerBases_id: function (performerBases_id: string) {
        return CoreDb().table('performer').where('performerBases_id', '=', performerBases_id).where('status', '=', '1')
    },
    getDataListByPerformerBases_id: async function (performerBases_id: string) {
        return await this.SQL_DataListByPerformerBases_id(performerBases_id).order('addTime', 'desc').getList() as Array<Iperformer>;
    },
    getDataCountByPerformerBases_id: async function (performerBases_id: string) {
        return await this.SQL_DataListByPerformerBases_id(performerBases_id).getCount();
    },
    execFormData: function (formdataObj: IConditions) {
        formdataObj.careerPerformer = (formdataObj.career as Array<string>).includes('performer');
        formdataObj.careerDirector = (formdataObj.career as Array<string>).includes('director');
        delete formdataObj.career;
        return formdataObj;
    },
    addPerformerDataList: async function (dataList: Array<Iperformer>, sameNameNoImport = true) {
        let performerCount = 0;
        const tID = await CoreDb().beginTrans();
        for (const performer of dataList) {
            const pS = await performerServerData.getInfoById(performer.id) as Iperformer | undefined;

            if (pS == undefined) {
                if (sameNameNoImport) {
                    const pSName = await performerServerData.getInfoByName(performer.name) as Iperformer | undefined;
                    if (pSName != undefined) {
                        continue;
                    }
                }
                const addResult = await performerServerData.addSimple(performer);
                if (addResult) {
                    performerCount++;
                }
            }
        }
        await CoreDb().commit(tID);
        return performerCount;
    },
    addSimple: async function (perInfo: Iperformer) {
        const addResult = await CoreDb().table('performer').create(perInfo as unknown as IConditions);
        if (addResult == undefined || addResult.status == false) {
            return false;
        }
        return true;
    },
    add: async function (formdata: object) {
        const formdataObj = this.execFormData({ ...formdata } as IConditions);
        const addResult = await CoreDb().table('performer').createGuid().createTime().create(formdataObj);
        if (addResult == undefined || addResult.status == false) {
            return false;
        }
        return true;
    },
    update: async function (id: string, obj: IConditions) {
        const editResult = await CoreDb().table('performer').update(id, obj);
        if (editResult == undefined || editResult.status == false) {
            return false;
        }
        return true;
    },
    edit: async function (id: string, formdata: object) {
        const formdataObj = this.execFormData({ ...formdata } as IConditions);
        return await this.update(id, formdataObj);
    },

    setStatus: async function (id: string, value: boolean) {
        return this.update(id, { status: value });
    },
}

export { performerServerData };
