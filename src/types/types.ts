

export interface IGenvaluejs {
    Itemid?: number;
    Item_desc1: String;
    Rate: number;
    StoreLoc: String;
    Uom: String;
    materialtype: String;
    StockQty: number;
    Mcno: number | String;
    User: String;
    StockDAte: String;
    Remarks: String;
    Item_no: number | String;
}

export interface IGetSaveData {
    Itemid?: number;
    Item_desc1: String;
    Rate: number;
    StoreLoc: String;
    Uom: String;
    materialtype: String;
    StockQty: number;
    Mcno: number | String;
    User: String;
    StockDAte: String;
    Remarks: String;
    Item_no: number | String;
}

export interface IStocks {
    genvaluejs: IGenvaluejs[];
    getSaveData: IGetSaveData[];
}

export interface Ioptions {
    Itemid: any
    Item_desc1: any
    Item_no: any
}