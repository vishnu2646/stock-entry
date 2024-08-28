import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
    public baseUrl = environment.domain

    public userName = '';

    public key = '';

    public isLoggedIn$ = new BehaviorSubject<boolean>(false);

    /**
     * Method to login to the server.
     * @param username request.username
     * @param password request.password
     * @returns A message indicating the user is authenticated and user Details.
     */
    public handleUserLogin(username: String, password: String, key:String): Observable<any> {
        return this.http.get(`${this.baseUrl}/GetLoginData?username=${username}&password=${password}&databaseKey=${key}`)
    }

    /**
     * Method to retrieve GetItemList data from the server.
     * @param username authenticated user's username.
     * @param key key for the database.
     * @returns data from the server.
     */
    public getStocksData(username: String, key: String): Observable<any> {
        return this.http.get(`${this.baseUrl}/GetItemList?User=${username}&databaseKey=${key}`);
    }

    /**
     * Method to retrieve SaveItemList data from the server.
     * @param username authenticated user's username.
     * @param key key for the database.
     * @returns data from the server.
     */
    public getStocksDisplayData(username: String, key: String): Observable<any> {
        return this.http.get(`${this.baseUrl}/SaveItemList?User=${username}&databaseKey=${key}`)
    }

    /**
     * Method to post the stock data to the server.
     * @param data stock data to be posted to the server.
     * @returns Success or Failure message
     */
    public addGetSaveData(username: String, key: String, data: any): Observable<any> {
        const url = `${this.baseUrl}/addItemList?User=${username}&databaseKey=${key}`
        return this.http.post(url, data);
    }

    public isLoggedIn(): boolean {
        const user = localStorage.getItem('user');
        if(user) {
            this.userName = JSON.parse(user).username;
            this.key = JSON.parse(user).dataBaseKey;
        }
        return !!localStorage.getItem('user');
    }
}
