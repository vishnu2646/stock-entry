import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { IGenvaluejs, IGetSaveData, Ioptions, IStockData, IStocks } from '../types/types';
import { ApiService } from './service/api.service';
import moment from 'moment';
import { lastValueFrom } from 'rxjs';
import { ExportService } from './service/export.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    private apiService = inject(ApiService);

    private exportService = inject(ExportService);

    public title = 'stockentry';

    public columns: any[] = [];

    public loading: boolean = false;

    public selectedItemId: String = "";

    public stockData: IStockData = {
        Itemid: '',
        Item_desc1: '',
        StockQty: '',
        storeloc: '',
        Mcno: '',
        User: '',
        StockDAte: new Date().toDateString(),
        Remarks: '',
    }

    public extractData: Ioptions[] = [];

    public exportColumns: any[] = [];

    public filteredOptions: String[] = [];

    public selectedItem: any = {};

    public data: IGenvaluejs[] = [];

    public displayData: IGetSaveData[] = [];

    public ngOnInit(): void {

        this.getStocksData();

        this.columns = [
            { field: 'Item_no', header: 'Item No', customExportHeader: 'Item No' }, 
            { field: 'Item_desc1', header: 'Part Desc', customExportHeader: 'Part Desc' }, 
            { field: 'Mcno', header: 'Mcno', customExportHeader: 'Mcno' }, 
            { field: 'StockDAte', header: 'Stock Date', customExportHeader: 'Stock Date' }, 
            { field: 'StockQty', header: 'Stock Quantity', customExportHeader: 'Stock Quantity' }, 
            { field: 'Remarks', header: 'Remarks', customExportHeader: 'Remarks' }, 
        ]

        this.exportColumns = this.columns.map(col => ({
            title: col.header,
            dataKey: col.field
        }));
    }

    public async getStocksData() {
        try {
            this.loading = true;
            await this.apiService.getStocksData().subscribe(data => {
                if (data) {
                    this.data = data['Genvaluejs'];
                    this.displayData = data['GetSaveData'];
                    this.extractData = this.data.map(item => ({
                        Itemid: item.Itemid,
                        Item_desc1: item.Item_desc1,
                        Item_no: item.Item_no
                    }));
                    this.loading = false;
                } else {
                    console.log("Error on Fetching");
                }
            });
        } catch(error) {
            console.error("Error on Fetching",error);
        }
    }

    public searchItemId(event: AutoCompleteCompleteEvent) {
        let query = event.query;
        let result: String[] = [];

        for(let i=0; i < this.extractData.length; i++) {
            let item = this.extractData[i];
            if (item['Item_no'].toString().toLowerCase().indexOf(query.toLowerCase()) === 0) {
                result.push(item['Item_no'].toString()); 
            }
        }
        this.filteredOptions = result;
    }

    public getItemId(event: AtoCompleteSelectEvent) {
        const selectedItem = event.value;

        this.selectedItemId = selectedItem;

        this.data.forEach(obj => {
            if(obj.Item_no === selectedItem) {
                this.stockData.Item_desc1 = obj.Item_desc1;
                this.stockData.Itemid = obj.Itemid.toString();
                console.log(this.stockData);
            }
        });
    }

    public async saveStocks() {
        if (!this.stockData['Item_desc1'] || 
            !this.stockData['Itemid'] ||
            !this.stockData['Mcno'] ||
            !this.stockData['Remarks'] || 
            !this.stockData['StockDAte'] || 
            !this.stockData['StockQty']
        ) {
            alert("Please all the fields to save the stock");
        } else {
            this.stockData['StockDAte'] = moment(new Date(this.stockData['StockDAte'].toString())).format("YYYY-MM-DD");
            this.stockData['User'] = "Raja";
            const { Item_desc1, ...filteredObj } = this.stockData;
            try {
                const response = await lastValueFrom(this.apiService.addGetSaveData(filteredObj));
                console.log(response);
            } catch (error) {
                console.log("something went wrong",error);
            }
        }
    }

    public exportData() {
        this.exportService.exportExcel(this.displayData, "products");
    }
}

interface AutoCompleteCompleteEvent {
    originalEvent: Event;
    query: string;
}

interface AtoCompleteSelectEvent { 
    originalEvent: PointerEvent;
    value: String;
}