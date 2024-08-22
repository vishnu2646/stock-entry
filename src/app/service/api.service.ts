import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IGetSaveData, IStockData } from '../../types/types';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    /**
     * Injects the HttpClient.
     */
    private http = inject<HttpClient>(HttpClient);

    /**
     * Base URL for the server.
     */
    public baseUrl = "http://192.168.1.44:9003/api/Values?User=Admin&databaseKey=sppipe";

    /**
     * Method to retrieve data from the server.
     * @returns data from the server.
     */
    public getStocksData(): Observable<any> {
        return this.http.get(this.baseUrl);
    }

    /**
     * Method to post the stock data to the server.
     * @param data stock data to be posted to the server.
     * @returns Success or Failure message
     */
    public addGetSaveData(data: any): Observable<any> {
        return this.http.post(this.baseUrl, data);
    }
}
