
interface Iperformer {
    id: string;
    performerBases_id: string;
    name: string;
    aliasName: string;
    birthday: string;
    nationality: string;
    careerPerformer: boolean;
    careerDirector: boolean;
    photo: string;
    introduction: string;
    cup: string;
    bust: string;
    waist: string;
    hip: string;
    stars: number;
    retreatStatus: boolean;
    addTime: string;
    status: boolean;
}

interface IperformerPaging {
    dataList: Array<Iperformer>;
    count: number;
    page: number;
    limit: number;
}

interface IperformerQueryCondition {
    search: string;
    stars: string,
    cup: string;
    index: string;
}


export { Iperformer, IperformerPaging, IperformerQueryCondition };