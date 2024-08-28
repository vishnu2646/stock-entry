import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ApiService } from './service/api.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

    private router = inject(Router);

    private cd = inject(ChangeDetectorRef);

    private apiService = inject(ApiService);

    /**
     * Title to display.
     */
    public title = 'Stock Entry';

    public loginData = {};

    public isLoggedIn: boolean = false;

    public userName: String = '';

    public navItems: MenuItem[] = [];

    public ngOnInit(): void {
        this.apiService.isLoggedIn$.subscribe(result => {
            this.isLoggedIn = this.apiService.isLoggedIn();
            this.userName = this.apiService.userName;
        });

        if(!this.isLoggedIn) {
            this.router.navigate(['/login']);
        }
    }

    public handleLogut() {
        console.log("clicked");
        localStorage.removeItem('user');
        this.apiService.isLoggedIn$.next(false);
        this.router.navigate(['/login']);
    }
}