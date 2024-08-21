import { Component, inject, OnInit } from '@angular/core';
import { IGenvaluejs, Ioptions, IStocks } from '../types/types';
import { ApiService } from './service/api.service';
import moment from 'moment';

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

    public stockData: IGenvaluejs = {
        Item_desc1: '',
        Item_no: '',
        Itemid: 0,
        Mcno: 0,
        Rate: 0,
        Remarks: '',
        StockDAte: new Date().toDateString(),
        StockQty: 0,
        StoreLoc: '',
        Uom: '',
        User: '',
        materialtype: '',
    }

    public extractData: Ioptions[] = [];

    public filteredOptions: String[] = [];

    public selectedItem: any = {};

    public selectedItemId: String = "";

    public data: IGenvaluejs[] = [];

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

    public getItemId(event: any) {
        const selectedItem = event; // This holds the selected item
        console.log(selectedItem);
    }

    public async saveStocks() {
        if (!this.stockData['Item_desc1'] || 
            !this.stockData['Item_no'] ||
            !this.stockData['Mcno'] ||
            !this.stockData['Remarks'] || 
            !this.stockData['StockDAte'] || 
            !this.stockData['StockQty']
        ) {
            alert("Please all the fields to save the stock");
        } else {
            this.stockData['StockDAte'] = moment(new Date(this.stockData['StockDAte'].toString())).format("YYYY-MM-DD");
            console.log(this.stockData);
            try {
                await this.apiService.addGetSaveData(this.stockData);
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