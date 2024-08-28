import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from '../../service/api.service';
import { lastValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
    
    private apiService = inject(ApiService);

    private router = inject(Router);

    public loginData = {};

    public isLoggedIn: boolean = false;

    public selectedKey: { [ x:string ]: String } = {};

    public loginErrorMessage: string = '';

    public visible: boolean = false;

    public keys = [
        { key:'sppipe' },
        { key: 'spfl' },
    ];

    public loginDetails = {
        username: '',
        key: '',
        password: '',
    }

    public ngOnInit(): void {
        this.apiService.isLoggedIn$.subscribe(result => {
            this.isLoggedIn = this.apiService.isLoggedIn();
        });

        if(this.isLoggedIn) {
            this.router.navigate(['/home']);
        }
    }

    public async handleLogin() {

        try {
            const response = await lastValueFrom(this.apiService.handleUserLogin(this.loginDetails.username, this.loginDetails.password, this.selectedKey['key']));
            if(response) {
                const credientials = {
                    username: response.GetPrintData.Table[0].Username,
                    dataBaseKey: this.selectedKey['key'],
                }
                localStorage.setItem('user', JSON.stringify(credientials));
                this.apiService.isLoggedIn$.next(true);
                this.router.navigate(["/home"]);
            } else {
                this.router.navigate(["/login"])
            }
            
        } catch (err: any) {
            if(!this.loginDetails.username || !this.loginDetails.password || !this.selectedKey['key']) {
                this.visible = true;
                this.loginErrorMessage = "All the fields are required"
            } else {
                this.loginErrorMessage = err.error.message;
                this.visible = true;
                this.router.navigate(["/login"])
            }
        }
    }
}
