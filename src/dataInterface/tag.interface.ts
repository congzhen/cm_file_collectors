interface Itag {
    id: string;
    tagClass_id: string;
    name: string;
    status: boolean;
}

interface ItagInfo extends Itag {
    hot: string;
    sort: number;
    addTime: string;
}

interface ItagClass {
    id: string;
    filesBases_id: string;
    name: string;
    leftShow: boolean;
    status: boolean;
}
interface ItagClassInfo extends ItagClass {
    hot: string;
    sort: number;
    addTime: string;
}


export { Itag, ItagInfo, ItagClass, ItagClassInfo };