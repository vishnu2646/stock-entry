import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { IGenvaluejs, Ioptions, IStockData, IStocks } from '../types/types';
import { ApiService } from './service/api.service';
import moment from 'moment';
import { lastValueFrom } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    private apiService = inject(ApiService);

    public title = 'stockentry';

    public date: any = "";

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

    public filteredOptions: String[] = [];

    public selectedItem: any = {};

    public data: IGenvaluejs[] = [];

    @ViewChild('partDesc', { static: false })
    public partDesc: ElementRef | undefined;

    @ViewChild('stockId', { static: false })
    public stockId: ElementRef | undefined;

    public ngOnInit(): void {
        this.getStocksData();
    }

    public async getStocksData() {
        try {
            this.loading = true;
            await this.apiService.getStocksData().subscribe(data => {
                if (data) {
                    this.data = data['Genvaluejs'];
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

    public lostFocus(event: any): void {
        console.log(event.target.value);
    }

    public getItemId(event: AtoCompleteSelectEvent) {
        const selectedItem = event.value;

        this.selectedItemId = selectedItem;

        const partDescElement = this.partDesc?.nativeElement;

        this.data.forEach(obj => {
            if(obj.Item_no === selectedItem) {
                partDescElement.value = obj.Item_desc1;
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
}

interface AutoCompleteCompleteEvent {
    originalEvent: Event;
    query: string;
}

interface AtoCompleteSelectEvent { 
    originalEvent: PointerEvent;
    value: String;
}