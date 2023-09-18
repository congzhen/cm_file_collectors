interface IfilesBasesSetting {
    filesBases_id: string;
    config_json_data: string;
    nfo_json_data: string;
    simple_json_data: string;
}

interface IcoverPosterData {
    name: string;
    width: number;
    height: number;
    type: string;
}

interface IrouteConversion {
    from: string;
    to: string;
}

interface IfilesBasesConfig {
    leftDisplay: Array<string>;
    country: Array<string>;
    definition: Array<string>;
    tagMode: string;
    performerPhoto: boolean;
    shieldNoPerformerPhoto: boolean;
    performerShowNum: number;
    performerPreferred: Array<string>;
    pageLimit: number;
    sortMode: string;
    resourcesShowMode: string;
    detailsDramaSeriesMode: string;
    historyModule: boolean;
    hotModule: boolean;
    youLikeModule: boolean;
    historyNumber: number;
    hotNumber: number;
    youLikeNumber: number;
    youLikeWordNumber: number;
    youLikeTagClass: Array<string>;
    resourceDetailsShowMode: string;
    showPreviewImage: boolean;
    previewImageFolder: string;
    plugInUnit_Cup: boolean;
    plugInUnit_Cup_Text: string;
    coverPosterData: Array<IcoverPosterData>;
    coverPosterDataDefaultSelect: number;
    coverPosterWidthStatus: boolean;
    coverPosterHeightStatus: boolean;
    coverPosterWidthBase: number;
    coverPosterHeightBase: number;
    playAtlasImageWidth: number;
    playAtlasMode: string;
    playAtlasPageLimit: number;
    playComicMode: string;
    routeConversion: Array<IrouteConversion>;
}

interface IfilesBasesNofConfig {
    suffix: string,
    root: string,
    title: string,
    issueNumber: string,
    year: string,
    cover: string,
    coverSuffix: string,
    coverUrl: string,
    tag: string,
    abstract: string,
    country: string,
    star: string,
    performer: string,
    performerName: string,
    performerThumb: string,
}

interface IfilesBasesSimpleConfig {
    suffix: string,
    title: string,
    cover: string,
    coverSuffix: string,
}

export { IfilesBasesSetting, IfilesBasesConfig, IfilesBasesNofConfig, IfilesBasesSimpleConfig };