import { Component, inject, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';

import moment from 'moment';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';

import { IStockData, Ioptions, IGenvaluejs, IGetSaveData } from '../../../types/types';
import { ApiService } from '../../service/api.service';
import { DialogService } from '../../service/dialog.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    /**
     * Service instance to get the api data.
     */
    private apiService = inject(ApiService);

    /**
     * Injects the router Instance.
     */
    private router = inject(Router);

    /**
     * Service instance to toggle the Dialog.
     */
    private dialogService = inject(DialogService);

    public userName: String = '';

    public key: String = '';

    public isLoggedIn: boolean = false;

    /**
     * Loading state for the Api data in table.
     */
    public loading: boolean = false;

    /**
     * Seleted Stock itemid / itemname
     */
    public selectedItemId: String = "";

    /**
     * Selected Stock item description / part description.
     */
    public selectedPartDesc: String = "";

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
        Item_no: '',
    }

    /**
     * Data to be populated for the form.
     */
    public extractData: Ioptions[] = [];

    /**
     * List of option for the AutoComplete field of Item Number.
     */
    public filteredOptions: String[] = [];

    /**
     * List of option for the AutoComplete field of Part Description.
     */
    public filteredItemDescription: String[] = [];

    /**
     * Property to visualize the warning dialog.
     */
    public visible: boolean = false;

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
     * User data from the local storage.
     */
    public loginData: any = [];

    /**
     * List of GetSaveData to be displayed for the user in table/grid.
     */
    public avalileStocks: any[] = [];

    /**
     * A callback method that is invoked immediately after the default 
     * change detector has checked the directive's data-bound properties for the first time,
     * and before any of the view or content children have been checked.
     */
    public ngOnInit(): void {

        this.apiService.isLoggedIn$.subscribe(_result => {
            this.isLoggedIn = this.apiService.isLoggedIn();
            this.userName = this.apiService.userName;
            this.key = this.apiService.key;
        });

        if(!this.isLoggedIn) {
            this.router.navigate(['/login']);
        }

        this.getStocksData();
    }

    /**
     * Method to fetch data from the database/server
     * Using apiService.
     */
    public async getStocksData() {
        try {
            this.loading = true;
            
            const data = await lastValueFrom(this.apiService.getStocksData(this.userName, this.key))

            if (data) {
                this.data = data['Genvaluejs']['Table'];
                this.extractData = this.data.map(item => ({
                    Itemid: item.Itemid,
                    Item_desc1: item.Item_desc1,
                    Item_no: item.Item_no
                }));
                this.loading = false;
            } else {
                console.log("Error on Fetching");
                this.loading = false;
            }

            const displayData =  await lastValueFrom(this.apiService.getStocksDisplayData(this.userName, this.key));

            if(displayData) {
                this.displayData = displayData.SaveGenData.Table;
            } else {
                console.log("Error on Fetching");
                this.loading = false;
            }
        } catch(error) {
            console.error("Error on Fetching",error);
            this.loading = false;
        }
    }

    /**
     * Method to get the option in autocomplete dropdown, 
     * based on the text typed in Item number typed.
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
     * Method to get the option in autocomplete dropdown,
     * based on the text typed in Part description.
     * @param event 
     */
    public getFilterPartDescOptions(event: AutoCompleteCompleteEvent) {
        let query = event.query;
        let result: String[] = [];

        for(let i=0; i < this.extractData.length; i++) {
            let item = this.extractData[i];
            if (item['Item_desc1'].toString().toLowerCase().indexOf(query.toLowerCase()) === 0) {
                result.push(item['Item_desc1'].toString()); 
            }
        }

        this.filteredItemDescription = result;
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

        this.checkStockAvailability();

    }

    /**
     * Method to populate value for the part desctiption and item id field.
     * Also updates the selected Part Desctiption.
     * @param event Selected option/data item in AutoComplete field of Part Description field.
     */
    public getItemId(event: AtoCompleteSelectEvent) {
        const selectedItemDesc = event.value;

        this.selectedPartDesc = selectedItemDesc;

        this.data.forEach(obj => {
            if(obj.Item_desc1 === selectedItemDesc) {
                this.stockData.Item_desc1 = obj.Item_desc1;
                this.stockData.Itemid = obj.Itemid.toString();
                this.stockData.Item_no = obj.Item_no;
            }
        });

        this.checkStockAvailability();
    }

    /**
     * Method to check if the selected stock is already in SaveItemList.
     * (i.e) Data in the Grid.
     */
    public checkStockAvailability() {
        if(this.stockData.Item_no || this.stockData.Item_desc1) {
            this.displayData.forEach(stock => {
                if(stock.Item_desc1 === this.stockData.Item_desc1 || this.stockData.Item_no === stock.Item_no) {
                    this.avalileStocks.push(stock);
                    this.visible = this.dialogService.toggleDialog(true);
                }
            })
        }
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
                const response = await lastValueFrom(this.apiService.addGetSaveData(this.userName, this.key, filteredObj));
                if(response.toString() === "Stock Entry Inserted Successfully.") { 
                    alert(response);
                } else {
                    alert("something went wrong");
                }
                this.resetStockData();
            } catch (error) {
                console.log("something went wrong",error);
            }
        }
    }

    /**
     * Reset the stock data to the default state or initial state.
     */
    public resetStockData() {
        this.stockData = {
            Itemid: '',
            Item_desc1: '',
            StockQty: '',
            storeloc: '',
            Mcno: '',
            User: '',
            StockDAte: new Date().toDateString(),
            Remarks: '',
            Item_no: '',
        }
        this.selectedItemId = '';
    }

    /**
     * Method to toggle the dialog and reset the stock data to the default state.
     * @param enable Boolean to reset the stock data form to the default state.
     */
    public toggleDialog(enable?: boolean): void {
        this.visible = this.dialogService.toggleDialog(false);;
        
        if(!enable) {
            this.resetStockData();
        }

    }
}

/**
 * Type for the autoComplete Select event.
 */
interface AtoCompleteSelectEvent { 
    originalEvent: PointerEvent;
    value: String;
}