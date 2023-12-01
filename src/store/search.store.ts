import { defineStore } from "pinia";
import { EsearchLogic } from "@/dataInterface/common.enum"
import { IsearchCondition } from "@/dataInterface/common.interface";

export const searchStore = defineStore('search', {
    state: () => ({
        searchCondition: {
            text: '',
            country: {
                logic: EsearchLogic.single,
                value: [],
            },
            definition: {
                logic: EsearchLogic.single,
                value: [],
            },
            year: {
                logic: EsearchLogic.single,
                value: [],
            },
            starRating: {
                logic: EsearchLogic.single,
                value: [],
            },
            performer: {
                logic: EsearchLogic.single,
                value: [],
            },
            cup: {
                logic: EsearchLogic.single,
                value: [],
            },
            resMode: {
                logic: EsearchLogic.single,
                value: [],
            },
            diyTag: {

            },
        } as IsearchCondition,
    }),
    getters: {},
    actions: {
        searchConditionInit: function () {
            this.searchCondition.text = '';
            this.searchCondition.country.value.splice(0);
            this.searchCondition.definition.value.splice(0);
            this.searchCondition.year.value.splice(0);
            this.searchCondition.starRating.value.splice(0);
            this.searchCondition.performer.value.splice(0);
            this.searchCondition.cup.value.splice(0);
            this.searchCondition.resMode.value.splice(0);
            for (const key in this.searchCondition.diyTag) {
                this.searchCondition.diyTag[key].value.splice(0);
            }
        },
        setSearchText: function (str: string) {
            this.searchCondition.text = str;
        },
        setSearchData: function (mode: string, logic: EsearchLogic, dataVal: string[]) {
            switch (mode) {
                case 'country':
                    this.searchCondition.country.logic = logic;
                    this.searchCondition.country.value = dataVal;
                    break;
                case 'definition':
                    this.searchCondition.definition.logic = logic;
                    this.searchCondition.definition.value = dataVal;
                    break;
                case 'year':
                    this.searchCondition.year.logic = logic;
                    this.searchCondition.year.value = dataVal;
                    break;
                case 'starRating':
                    this.searchCondition.starRating.logic = logic;
                    this.searchCondition.starRating.value = dataVal;
                    break;
                case 'cup':
                    this.searchCondition.cup.logic = logic;
                    this.searchCondition.cup.value = dataVal;
                    break;
                case 'resMode':
                    this.searchCondition.resMode.logic = logic;
                    this.searchCondition.resMode.value = dataVal;
                    break;
                case 'performer':
                    this.searchCondition.performer.logic = logic;
                    this.searchCondition.performer.value = dataVal;
                    break;
                default:
                    if (mode != '') {
                        this.searchCondition.diyTag[mode] = {
                            logic: logic,
                            value: dataVal,
                        }
                    }
            }
        },
    },
});