import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from '../../service/api.service';

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

    public selectedKey: { [ x:string ]: String } = {}

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
            await this.apiService.handleUserLogin(this.loginDetails.username, this.loginDetails.password, this.selectedKey['key']).subscribe(data => {
                if(data) {
                    const credientials = {
                        username: data.GetPrintData.Table[0].Username,
                        dataBaseKey: this.selectedKey['key'],
                    }
                    localStorage.setItem('user', JSON.stringify(credientials));
                    this.apiService.isLoggedIn$.next(true);
                    this.router.navigate(["/home"]);
                } else {
                    this.router.navigate(["/login"])
                }
            })
        } catch (err) {
            console.log(err);
            this.router.navigate(["/login"])
        }
    }
}
