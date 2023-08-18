import { defineStore } from "pinia";
import { filesBasesSettingServerData } from "@/serverData/filesBasesSetting.serverData"
import { IfilesBasesConfig } from "@/dataInterface/filesBasesSetting.interface"

const defaultConfig = {
    leftDisplay: ['country', 'definition', 'year', 'starRating', 'performer', 'diyTag'],
    country: ['China', 'Japan', 'SouthKorea', 'America', 'England', 'France', 'OtherCountry'],
    definition: ['8K', '4K', '2K', '1080P', '720P', 'HighDefinition', 'StandardDefinition'],
    tagMode: 'fixed',
    performerPhoto: true,
    shieldNoPerformerPhoto: true,
    performerShowNum: 12,
    performerPreferred: [],
    pageLimit: 32,
    sortMode: 'desc',
    resourcesShowMode: 'coverPoster',
    detailsDramaSeriesMode: 'fileName',
    historyModule: true,
    hotModule: true,
    youLikeModule: true,
    historyNumber: 10,
    hotNumber: 10,
    youLikeNumber: 10,
    youLikeWordNumber: 3,
    youLikeTagClass: [],
    resourceDetailsShowMode: 'right',
    plugInUnit_Cup: false,
    plugInUnit_Cup_Text: 'Cup',
    coverPosterData: [
        { name: 'Default 1', width: 300, height: 420, type: 'default' },
        { name: 'Default 2', width: 400, height: 275, type: 'default' },
        { name: 'Default 3', width: 524, height: 270, type: 'default' },
        { name: 'Default 4', width: 480, height: 270, type: 'default' },
    ],
    coverPosterDataDefaultSelect: 0,
    coverPosterHeightStatus: true,
    coverPosterHeightBase: 218,
    playAtlasImageWidth: 150,
    playAtlasMode: 'waterfall',
    playComicMode: 'fullScreen',
} as IfilesBasesConfig

export const filesBasesSettingStore = defineStore('filesBasesSetting', {
    state: () => ({
        config: { ...defaultConfig }
    }),
    getters: {
        getPlugInUnit_Cup_Text: function (state) {
            if (state.config.plugInUnit_Cup_Text == '') {
                return 'Cup';
            }
            return state.config.plugInUnit_Cup_Text;
        }
    },
    actions: {
        init: async function (filesBases_id: string) {
            const configData = await filesBasesSettingServerData.getConfigByfilesBasesId(filesBases_id);
            this.config = { ...defaultConfig, ...configData };
        },
        save: async function (filesBases_id: string) {
            await filesBasesSettingServerData.saveConfig(filesBases_id, this.config);
        },
    }
});