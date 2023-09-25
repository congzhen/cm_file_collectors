import { defineStore } from "pinia";
import dataset from "@/assets/dataset";
import { stringSearch, stringIndexChar } from "@/assets/stringSearch";
import { Iperformer, IperformerPaging, IperformerQueryCondition } from "@/dataInterface/performer.interface";
import { performerServerData } from "@/serverData/performer.serverData"
import { filesBasesStore } from "@/store/filesBases.store";
import { filesRelatedPerformerBasesStore } from "@/store/filesRelatedPerformerBases.store";


export const performerStore = defineStore('performer', {
    state: () => ({
        currentAdminPerformerBases_id: undefined as string | undefined,
        performerList: [] as Array<Iperformer>
    }),
    getters: {
        getPerformerListPaging: function (state) {
            return (performerBases_id: string, page = 1, limit = 30, queryCondition: IperformerQueryCondition | undefined = undefined): IperformerPaging => {
                const dataList: Array<Iperformer> = [];
                let count = 0;
                const start = (page - 1) * limit;
                const end = start + limit;
                for (let i = 0; i < state.performerList.length; i++) {
                    if (state.performerList[i].performerBases_id == performerBases_id && state.performerList[i].status) {
                        let addStatus = true;
                        if (queryCondition) {
                            if (addStatus && queryCondition.index != 'ALL') {
                                if (stringIndexChar(state.performerList[i].name) != queryCondition.index.toLowerCase()) {
                                    addStatus = false;
                                }
                            }
                            if (addStatus && queryCondition.search != '') {
                                if (!stringSearch(queryCondition.search, state.performerList[i].name + state.performerList[i].aliasName)) {
                                    addStatus = false;
                                }
                            }
                            if (addStatus && queryCondition.stars != '' && queryCondition.stars != 'ALL') {
                                let stars;
                                if (queryCondition.stars == 'noStars') {
                                    stars = 0;
                                } else {
                                    stars = parseInt(queryCondition.stars);
                                }
                                if (state.performerList[i].stars != stars) {
                                    addStatus = false;
                                }
                            }
                            if (addStatus && queryCondition.cup != '' && queryCondition.cup != 'ALL') {
                                if (queryCondition.cup == 'noCup' && state.performerList[i].cup != '') {
                                    addStatus = false;
                                } else if (queryCondition.cup != state.performerList[i].cup) {
                                    addStatus = false;
                                }
                            }
                        }
                        if (addStatus) {
                            if (count >= start && count < end) {
                                dataList.push(state.performerList[i]);
                            }
                            count++;
                        }
                    }

                }
                return {
                    dataList,
                    count,
                    page,
                    limit,
                    queryCondition,
                } as IperformerPaging
            }
        },
        getPerformerInfoById: function (state) {
            return (id: string): Iperformer | undefined => {
                for (let i = 0; i < state.performerList.length; i++) {
                    if (state.performerList[i].id == id) {
                        return state.performerList[i];
                    }
                }
                return undefined;
            };
        },
        getPerformerListyPerformerBasesId: function (state) {
            return (performerBasesId: string): Array<Iperformer> => {
                return state.performerList.filter(per => per.performerBases_id == performerBasesId && per.status);
            };
        },
        getPerformerCountByPerformerBasesId: function () {
            return (performerBasesId: string): number => {
                return this.getPerformerListyPerformerBasesId(performerBasesId).length;
            };
        },
        getPerformerListByFilesBasesId: function (state) {
            const store = {
                filesBasesStore: filesBasesStore(),
                filesRelatedPerformerBasesStore: filesRelatedPerformerBasesStore(),
            }
            const performerBases_arr = store.filesRelatedPerformerBasesStore.getFilesPerformerBasesRelatedPerformerIdArr(store.filesBasesStore.currentFilesBases.id);
            return state.performerList.filter(item => item.status && performerBases_arr.includes(item.performerBases_id))
        },
        getPerformerCupNumObject: function (state) {
            const obj: { [key: string]: number } = {};
            dataset.cup.forEach((val: string) => {
                obj[val] = 0;
            })
            for (let i = 0; i < state.performerList.length; i++) {
                if (state.performerList[i].status && state.currentAdminPerformerBases_id == state.performerList[i].performerBases_id) {
                    const cup = state.performerList[i].cup;
                    if (obj[cup] !== undefined) {
                        obj[cup]++;
                    }
                }

            }
            return obj;
        },
        performerExist: function (state) {
            return (id: string) => {
                for (let i = 0; i < state.performerList.length; i++) {
                    if (state.performerList[i].status && state.performerList[i].id == id) {
                        return true;
                    }
                }
                return false;
            }
        }
    },
    actions: {
        init: async function () {
            this.performerList = await performerServerData.getDataList();
        },
        setStatus: function (id: string, value: boolean) {
            const performerObj = this.getPerformerInfoById(id);
            if (performerObj) {
                performerObj.status = value;
            }
        },
        delete: function (id: string) {
            this.performerList = this.performerList.filter(obj => obj.id !== id);
        }
    },
});