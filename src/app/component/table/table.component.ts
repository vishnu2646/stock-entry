import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { IStockData, Ioptions, IGenvaluejs, IGetSaveData } from '../../../types/types';
import { ApiService } from '../../service/api.service';
import { ExportService } from '../../service/export.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrl: './table.component.scss'
})
export class TableComponent {
    /**
     * Injects the Router instance to navigate.
     */
    private location = inject(Location);

    /**
     * Service instance to get the api data.
     */
    private apiService = inject(ApiService);

    /**
     * Service instance to export the data.
     */
    private exportService = inject(ExportService);

    /**
     * Injects the Router instance.
     */
    private router = inject(Router);

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
     * Selected Part Description.
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
     * Columns to be exported.
     */
    public exportColumns: IExport[] = [];

    /**
     * List of option for the AutoComplete field of Item number.
     */
    public filteredOptions: String[] = [];

    /**
     * List of option for the AutoComplete field of Part Description.
     */
    public filteredItemDescription: String[] = [];

    /**
     * GenValueJs data.
     * Used for the data population process in form fields.
     */
    public data: IGenvaluejs[] = [];

    /**
     * List of GetSaveData to be displayed for the user in table/grid.
     */
    public displayData: IGetSaveData[] = [];

    public isLoggedIn: boolean = false;

    public userName: String = "";

    public key: String = "";

    /**
     * A callback method that is invoked immediately after the default 
     * change detector has checked the directive's data-bound properties for the first time,
     * and before any of the view or content children have been checked.
     */
    public ngOnInit(): void {

        this.apiService.isLoggedIn$.subscribe(result => {
            this.isLoggedIn = this.apiService.isLoggedIn();
            this.userName = this.apiService.userName;
            this.key = this.apiService.key;
        });

        if(!this.isLoggedIn) {
            this.router.navigate(['/login']);
        }

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
        const loginData: any = localStorage.getItem('user');
        try {
            this.loading = true;
            if(loginData) {
                
                await this.apiService.getStocksDisplayData(this.userName, this.key).subscribe(data => {
                    if (data) {
                        this.displayData = data['SaveGenData']['Table'];
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
                });
                
            }
        } catch(error) {
            console.error("Error on Fetching",error);
            this.loading = false;
        } finally {
            this.loading = false;
        }
    }

    /**
     * Method to delete the stock item from the database/server.
     * @param stock Stock item to be deleted.
     */
    public onRowDelete(stock: IStockData) {
        console.log(stock);
    }

    /**
     * Method to export the data in the gird or table,
     * Using exportService Method.
     */
    public exportData() {
        this.exportService.exportExcel(this.displayData, "products");
    }

    public navigateBack() {
        this.location.back();
    }
}

/**
* Type for columns.
*/
interface IExport {
    title: String, 
    dataKey: String
}