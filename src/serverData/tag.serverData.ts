import { CoreDb } from "@/core/core"
import { IConditions, coreDBS, linkMode } from "@/core/coreDBS";
import { Itag, ItagInfo } from "@/dataInterface/tag.interface"
const tagServerData = {
    getDataList: async function () {
        return await CoreDb().table('tag').fields(['id', 'tagClass_id', 'name', 'status']).noWhere().order('sort').getList() as Array<Itag>;
    },
    getInfo: async function (id: string) {
        return await CoreDb().table('tag').getInfo(id) as ItagInfo;
    },
    getYouLikeTag: async function (filesBases_id: string, number: number, tagClass_idArr: Array<string> = []) {
        const cdb = CoreDb().table('tag').leftJoin('tagClass', 't.tagClass_id = tagClass.id').where('filesBases_id', '=', filesBases_id, linkMode.and, 'tagClass');
        if (tagClass_idArr.length > 0) {
            cdb.whereIn('id', tagClass_idArr, linkMode.and, 'tagClass');
        }
        return await cdb.order('hot', 'desc').limit(1, number).getList() as Array<Itag>;
    },
    getCount: async function (tagClass_id: string | undefined = undefined) {
        if (tagClass_id == undefined) {
            return await CoreDb().table('tag').getCount();
        }
        return await CoreDb().table('tag').where('tagClass_id', '=', tagClass_id).getCount();
    },
    getMaxSortByTagClassId: async function (tagClass_id: string) {
        const maxSort = await CoreDb().table('tag').fields('sort').where('tagClass_id', '=', tagClass_id).order('sort', 'desc').getFindField();
        if (maxSort) {
            return parseInt(maxSort as string);
        }
        return 0;
    },
    add: async function (tagClass_id: string, name: string) {
        const tagCount = await this.getMaxSortByTagClassId(tagClass_id);
        const addResult = await CoreDb().table('tag').createGuid().createTime().create({ tagClass_id, name, sort: (tagCount + 1) });
        if (addResult == undefined || addResult.status == false) {
            return false;
        }
        return true;
    },
    update: async function (id: string, obj: IConditions) {
        const editResult = await CoreDb().table('tag').update(id, obj);
        if (editResult == undefined || editResult.status == false) {
            return false;
        }
        return true;
    },
    updatePlayHot: async function (idArr: Array<string>) {
        const editResult = await CoreDb().table('tag').whereIn('id', idArr).updeteWhere({ hot: [1, 'ass'] });
        if (editResult == undefined || editResult.status == false) {
            return false;
        }
        return true;
    },
    edit: async function (id: string, name: string, tagClass_id: string) {
        const tagData = await this.getInfo(id);
        const o: IConditions = { name };
        if (tagData.tagClass_id != tagClass_id) {
            const tagCount = await this.getMaxSortByTagClassId(tagClass_id);
            o.tagClass_id = tagClass_id;
            o.sort = (tagCount + 1);
        }
        return this.update(id, o);
    },
    setStatus: async function (id: string, value: boolean) {
        return this.update(id, { status: value });
    },
    setSort: async function (id: string, sort: number) {
        return this.update(id, { sort });
    },
    sort: async function (tagListByTagClassArr: Array<Itag>) {
        const tID = await CoreDb().beginTrans();
        for (let i = 0; i < tagListByTagClassArr.length; i++) {
            const editStatus = await this.setSort(tagListByTagClassArr[i].id, i + 1);
            if (!editStatus) {
                await CoreDb().rollback();
                return false;
            }
        }
        await CoreDb().commit(tID);
    },
    delete: async function (id: string, _dbs: coreDBS | undefined = undefined) {
        const dbs = _dbs == undefined ? CoreDb() : _dbs;
        const rd = await dbs.table('tag').delete(id);
        if (rd == undefined || rd.status == false || rd.aAffectedRows == 0) {
            return false;
        }
        return true;
    },
    deleteByTagClassId: async function (tagClass_id: string, _dbs: coreDBS | undefined = undefined) {
        const dbs = _dbs == undefined ? CoreDb() : _dbs;
        const rd = await dbs.table('tag').where('tagClass_id', '=', tagClass_id).deleteWhere();
        if (rd == undefined || rd.status == false) {
            return false;
        }
        return true;
    }
}


export { tagServerData }