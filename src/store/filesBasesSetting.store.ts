import { defineStore } from "pinia";
import { filesBasesSettingServerData } from "@/serverData/filesBasesSetting.serverData"
import { IfilesBasesConfig } from "@/dataInterface/filesBasesSetting.interface"
import i18n from "@/setup/language"
import emptyPhoto from "@/assets/emptyPhoto.jpg"

const defaultConfig = {
    leftDisplay: ['country', 'definition', 'year', 'starRating', 'performer', 'diyTag'],
    leftColumnWidth: 319,
    leftColumnMode: 'fixed',
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
    showPreviewImage: false,
    previewImageFolder: '/',
    plugInUnit_Cup: false,
    plugInUnit_Cup_Text: 'Cup',
    coverPosterData: [
        { name: 'Default 1', width: 300, height: 420, type: 'default' },
        { name: 'Default 2', width: 400, height: 275, type: 'default' },
        { name: 'Default 3', width: 524, height: 270, type: 'default' },
        { name: 'Default 4', width: 480, height: 270, type: 'default' },
    ],
    coverPosterDataDefaultSelect: 0,
    coverPosterWidthStatus: false,
    coverPosterWidthBase: 316,
    coverPosterHeightStatus: true,
    coverPosterHeightBase: 218,
    playAtlasImageWidth: 150,
    playAtlasMode: 'waterfall',
    playAtlasPageLimit: 100,
    playComicMode: 'fullScreen',
    routeConversion: [],
    definitionRgba: 'rgba(155, 88, 182,0.5)',
    definitionFontColor: '#F3F3F3',
    coverDisplayTag: [],
    coverDisplayTagRgba: 'rgba(230, 162, 60,0.7)',
    coverDisplayTagColor: '#F3F3F3',
    randomPosterStatus: false,
    randomPosterPath: '',
    randomPosterAutoSize: false,
    randomPosterWidth: 156,
    randomPosterHeight: 218,
    performer_Text: '',
    director_Text: '',
    performer_photo: '',

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
        },
        getPerformerText: function (state) {
            const t = i18n.global.t;
            if (state.config.performer_Text == '') {
                return t('performer.careerMode.performer');
            }
            return state.config.performer_Text;
        },
        getDirectorText: function (state) {
            const t = i18n.global.t;
            if (state.config.director_Text == '') {
                return t('performer.careerMode.director');
            }
            return state.config.director_Text;
        },
        getAvatar: function (state) {
            if (state.config.performer_photo == '') {
                return emptyPhoto;
            }
            return state.config.performer_photo;
        },
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