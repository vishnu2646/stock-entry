import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IGetSaveData, IStockData } from '../../types/types';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private http = inject<HttpClient>(HttpClient);

    public baseUrl = "http://192.168.1.44:9003/api/Values?User=Admin&databaseKey=sppipe";

    public getStocksData(): Observable<any> {
        return this.http.get(this.baseUrl);
    }

    public addGetSaveData(data: any): Observable<any> {
        console.log(data);
        return this.http.post(this.baseUrl, data);
    }
}
