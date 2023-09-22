import { EsearchLogic } from "./common.enum";

export interface ItagBlockItem {
    name: string,
    value: string,
}

export interface IsearchConditionItem {
    logic: EsearchLogic,
    value: Array<string>,
}

export interface IsearchCondition {
    text: string,
    country: IsearchConditionItem,
    definition: IsearchConditionItem,
    year: IsearchConditionItem,
    starRating: IsearchConditionItem,
    performer: IsearchConditionItem,
    cup: IsearchConditionItem,
    diyTag: { [key: string]: IsearchConditionItem },
}

export interface IresUpdateDetailsView {
    id: string | undefined,

}