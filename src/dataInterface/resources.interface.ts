import { EresDramaSeriesType } from "./common.enum";

interface IresourcesBase {
    id: string;
    filesBases_id: string;
    title: string;
    issueNumber: string;
    mode: EresDramaSeriesType;
    coverPoster: string;
    coverPosterMode: number;
    coverPosterWidth: number;
    coverPosterHeight: number;
    issuingDate: string;
    country: string;
    definition: string;
    stars: number;
    hot: number;
    abstract: string;
    lastPlayTime: string;
    lastPlayFile: string;
    addTime: string;
    status: boolean;
}
interface Iresources extends IresourcesBase {
    directors: Array<IresDirectors>;
    performers: Array<IresPerformers>;
    tags: Array<IresTagsInfo>;
    dramaSeries: Array<IresDramaSeries>;
}
interface IresDramaSeries {
    id: string;
    resources_id: string;
    type: string;
    src: string;
}
interface IresDramaSeriesParhReplaceerInfo extends IresDramaSeries {
    title: string;
    issueNumber: string;
}

interface IresSimpleAnddramaSeries {
    id: string;
    title: string;
    issueNumber: string;
    filesBases_id: string;
    addTime: string;
    coverPoster: string;
    dramaSeries: Array<IresDramaSeries>;
}

interface IresTags {
    id: string;
    resources_id: string;
    tag_id: string;
}
interface IresTagsInfo extends IresTags {
    tagClass_id: string;
}
interface IresPerformers {
    id: string;
    resources_id: string;
    performer_id: string;
}
interface IresDirectors {
    id: string;
    resources_id: string;
    performer_id: string;
}

interface IresWhereObj {
    page: number;
    limit: number;
    sortMode: string;
}

export { IresourcesBase, Iresources, IresDramaSeries, IresSimpleAnddramaSeries, IresDramaSeriesParhReplaceerInfo, IresTags, IresTagsInfo, IresDirectors, IresPerformers, IresWhereObj }