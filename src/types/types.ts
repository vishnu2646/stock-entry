

export interface IGenvaluejs {
    Itemid: string;
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
    Item_no: String;
}

export interface IGetSaveData {
    Itemid?: string;
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
    Item_no: String;
}

export interface IStockData {
    Itemid: String;
    Item_desc1: String;
    StockQty: String;
    storeloc: String;
    Mcno: String;
    username: String;
    StockDAte: String;
    Remarks: String;
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