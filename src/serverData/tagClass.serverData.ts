import { CoreDb } from "@/core/core"
import { IConditions } from "@/core/coreDBS";
import { ItagClass, ItagClassInfo } from "@/dataInterface/tag.interface"
const tagClassServerData = {
    getDataList: async function () {
        return await CoreDb().table('tagClass').fields(['id', 'filesBases_id', 'name', 'leftShow', 'status']).noWhere().order('sort').getList() as Array<ItagClass>;
    },
    getInfo: async function (id: string) {
        return await CoreDb().table('tagClass').getInfo(id) as ItagClassInfo;
    },
    getCount: async function (filesBases_id: string | undefined = undefined) {
        if (filesBases_id == undefined) {
            return await CoreDb().table('tagClass').getCount();
        }
        return await CoreDb().table('tagClass').where('filesBases_id', '=', filesBases_id).getCount();
    },
    add: async function (filesBases_id: string, name: string) {
        const filesBasesCount = await this.getCount(filesBases_id);
        const addResult = await CoreDb().table('tagClass').createGuid().createTime().create({ filesBases_id, name, sort: (filesBasesCount + 1) });
        if (addResult == undefined || addResult.status == false) {
            return false;
        }
        return true;
    },
    update: async function (id: string, obj: IConditions) {
        const editResult = await CoreDb().table('tagClass').update(id, obj);
        if (editResult == undefined || editResult.status == false) {
            return false;
        }
        return true;
    },
    updatePlayHot: async function (idArr: Array<string>) {
        const editResult = await CoreDb().table('tagClass').whereIn('id', idArr).updeteWhere({ hot: [1, 'ass'] });
        if (editResult == undefined || editResult.status == false) {
            return false;
        }
        return true;
    },
    edit: async function (id: string, name: string) {
        return this.update(id, { name });
    },
    setLeftShow: async function (id: string, value: boolean) {
        return this.update(id, { leftShow: value });
    },
    setStatus: async function (id: string, value: boolean) {
        return this.update(id, { status: value });
    },
    sort: async function (filesBases_id: string, id: string, type: string) {
        const data = await this.getInfo(id);
        const count = await this.getCount(filesBases_id);
        let exchangeData: ItagClassInfo;
        let exchangeDataId: string | undefined = undefined;
        let exchangeSort = data.sort;
        let status = false;

        while (!status) {
            if (type == 'down') {
                exchangeSort = exchangeSort + 1;
            } else {
                exchangeSort = exchangeSort - 1;
            }
            if (exchangeSort < 1 || exchangeSort > count) {
                return false;
            }
            exchangeData = await CoreDb().table('tagClass').find({ sort: exchangeSort, status: 1 }) as ItagClassInfo;
            if (exchangeData) {
                exchangeDataId = exchangeData.id;
                status = true;
            }
        }
        if (exchangeDataId) {
            const tID = await CoreDb().beginTrans();
            const editResult1 = await CoreDb().table('tagClass').update(id, { sort: exchangeSort });
            const editResult2 = await CoreDb().table('tagClass').update(exchangeDataId, { sort: data.sort });
            if (editResult1 == undefined || editResult1.status == false || editResult2 == undefined || editResult2.status == false) {
                await CoreDb().rollback();
                return false;
            }
            await CoreDb().commit(tID);

            return true;
        }
        return false;
    },
}


export { tagClassServerData }