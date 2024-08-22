import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { IGenvaluejs, IGetSaveData, Ioptions, IStockData, IStocks } from '../types/types';
import { ApiService } from './service/api.service';
import moment from 'moment';
import { lastValueFrom } from 'rxjs';
import { ExportService } from './service/export.service';
import { Message, MessageService } from 'primeng/api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    /**
     * Service instance to get the api data.
     */
    private apiService = inject(ApiService);

    /**
     * Service instance to export the data.
     */
    private exportService = inject(ExportService);

    private messageService = inject(MessageService);

    /**
     * Title to display.
     */
    public title = 'Stock Entry';

    /**
     * Columns title for the export data.
     */
    public columns: any[] = [];

    /**
     * Loading state for the Api data in table.
     */
    public loading: boolean = false;

    /**
     * Seleted Stock item id / name
     */
    public selectedItemId: String = "";

    /**
     * Initial state for the stock item.
     */
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

    /**
     * Data to be populated for the form.
     */
    public extractData: Ioptions[] = [];

    /**
     * Columns to be exported.
     */
    public exportColumns: IExport[] = [];

    /**
     * List of option for the AutoComplete field.
     */
    public filteredOptions: String[] = [];

    public message: Message[] = [];

    /**
     * GenValueJs data.
     * Used for the data population process in form fields.
     */
    public data: IGenvaluejs[] = [];

    /**
     * List of GetSaveData to be displayed for the user in table/grid.
     */
    public displayData: IGetSaveData[] = [];

    /**
     * A callback method that is invoked immediately after the default 
     * change detector has checked the directive's data-bound properties for the first time,
     * and before any of the view or content children have been checked.
     */
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

    /**
     * Method to fetch data from the database/server
     * Using apiService.
     */
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

    /**
     * Method to get the option in autocomplete dropdown based on the text typed. 
     * @param event Text typed in the autocomplete field.
     */
    public getFilterOptions(event: AutoCompleteCompleteEvent) {
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

    /**
     * Method to populate value for the part desctiption (i.e) stockData.Item_desc1.
     * @param event Selected option/data item in AutoComplete field or item_no field.
     */
    public getPartDesc(event: AtoCompleteSelectEvent) {
        const selectedItem = event.value;

        this.selectedItemId = selectedItem;

        this.data.forEach(obj => {
            if(obj.Item_no === selectedItem) {
                this.stockData.Item_desc1 = obj.Item_desc1;
                this.stockData.Itemid = obj.Itemid.toString();
            }
        });
    }

    /**
     * Method that validates the fields value in form and 
     * Adds the stock data to the server using the apiService.
     */
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
                if(response.toString() === "Stock entry inserted successfully.") { 
                    alert(response);
                } else {
                    alert("something went wrong");
                }
                this.resetStockData();
            } catch (error) {
                console.log("something went wrong",error);
                this.message.push({ severity: 'error', summary: 'Error', detail: 'something went wrong' })
            }
        }
    }

    /**
     * Reset the stock data to the default state or initial state.
     */
    private resetStockData() {
        this.stockData = {
            Itemid: '',
            Item_desc1: '',
            StockQty: '',
            storeloc: '',
            Mcno: '',
            User: '',
            StockDAte: new Date().toDateString(),
            Remarks: '',
        }
        this.selectedItemId = '';
    }

    /**
     * Method to export the data in the gird or table,
     * Using exportService Method.
     */
    public exportData() {
        this.exportService.exportExcel(this.displayData, "products");
    }
}

/**
 * Type for the autocomplete complete event.
 */
interface AutoCompleteCompleteEvent {
    originalEvent: Event;
    query: string;
}

/**
 * Type for the autoComplete Select event.
 */
interface AtoCompleteSelectEvent { 
    originalEvent: PointerEvent;
    value: String;
}

/**
 * Type for columns.
 */
interface IExport {
    title: String, 
    dataKey: String
}