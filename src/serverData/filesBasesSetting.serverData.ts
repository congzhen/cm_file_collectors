import { CoreDb } from "@/core/core"
import { coreDBS } from "@/core/coreDBS";
import { sqlResult } from "@/core/coreSqlite";
import { IfilesBasesSetting, IfilesBasesConfig, IfilesBasesNofConfig, IfilesBasesSimpleConfig } from "@/dataInterface/filesBasesSetting.interface"
interface filesBaseConfig {
    [key: string]: unknown
}
const filesBasesSettingServerData = {
    getInfoById: async function (filesBases_id: string) {
        return await CoreDb().table('filesBasesSetting').where('filesBases_id', '=', filesBases_id).getFind();
    },
    getConfigByfilesBasesId: async function (filesBases_id: string) {
        const dataInfo = await this.getInfoById(filesBases_id) as IfilesBasesSetting;
        if (dataInfo && dataInfo.config_json_data != '') {
            return JSON.parse(dataInfo.config_json_data) as filesBaseConfig;
        }
        return {} as filesBaseConfig;
    },
    getNfoConfigByfilesBasesId: async function (filesBases_id: string) {
        const dataInfo = await this.getInfoById(filesBases_id) as IfilesBasesSetting;
        if (dataInfo && dataInfo.nfo_json_data != '') {
            return JSON.parse(dataInfo.nfo_json_data) as IfilesBasesNofConfig;
        }
        return {} as IfilesBasesNofConfig;
    },
    getSimpleConfigByfilesBasesId: async function (filesBases_id: string) {
        const dataInfo = await this.getInfoById(filesBases_id) as IfilesBasesSetting;
        if (dataInfo && dataInfo.simple_json_data != '') {
            return JSON.parse(dataInfo.simple_json_data) as IfilesBasesSimpleConfig;
        }
        return {} as IfilesBasesSimpleConfig;
    },
    saveNfoConfigByfilesBasesId: async function (filesBases_id: string, config: IfilesBasesNofConfig) {
        return await CoreDb().table('filesBasesSetting').update(filesBases_id, { nfo_json_data: JSON.stringify(config) }, 'filesBases_id');
    },
    saveSimpleConfigByfilesBasesId: async function (filesBases_id: string, config: IfilesBasesSimpleConfig) {
        return await CoreDb().table('filesBasesSetting').update(filesBases_id, { simple_json_data: JSON.stringify(config) }, 'filesBases_id');
    },
    saveConfig: async function (filesBases_id: string, config: IfilesBasesConfig) {
        const dataInfo = await this.getInfoById(filesBases_id);
        let result: sqlResult | undefined;
        if (!dataInfo) {
            result = await this.add(filesBases_id, config);
        } else {
            result = await this.edit(filesBases_id, config);
        }
        if (result && result.status) {
            return true;
        }
        return false;
    },
    add: async function (filesBases_id: string, config: IfilesBasesConfig) {
        return await CoreDb().table('filesBasesSetting').create({ filesBases_id, config_json_data: JSON.stringify(config) });
    },
    edit: async function (filesBases_id: string, config: IfilesBasesConfig) {
        return await CoreDb().table('filesBasesSetting').update(filesBases_id, { config_json_data: JSON.stringify(config) }, 'filesBases_id');
    },
    delete: async function (filesBases_id: string, _dbs: coreDBS | undefined = undefined) {
        const dbs = _dbs == undefined ? CoreDb() : _dbs;
        const rd = await dbs.table('filesBasesSetting').where('filesBases_id', '=', filesBases_id).deleteWhere();
        if (rd == undefined || rd.status == false) {
            return false;
        }
        return true;
    }
}


export { filesBasesSettingServerData, filesBaseConfig }