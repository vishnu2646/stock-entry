import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DialogService {

    /**
     * Used to toggle the dialog visibility.
     */
    public visible: boolean = false;

    /**
     * Method to toggle the dialog visibility.
     * @param value Boolean value to toggle the dialog visibility.
     * @returns Boolean value for visibility of the dialog.
     */
    public toggleDialog(value: boolean): boolean {
        this.visible = value;
        return this.visible;
    }
}
