interface IfilesBases {
    id: string;
    name: string;
    sort: number;
    addTime: string;
    status: boolean;
}

interface IperformerBases {
    id: string;
    name: string;
    sort: number;
    addTime: string;
    status: boolean;
}

interface IfilesRelatedPerformerBases {
    id: string;
    filesBases_id: string;
    performerBases_id: string;
    main: boolean
}

export { IfilesBases, IperformerBases, IfilesRelatedPerformerBases };