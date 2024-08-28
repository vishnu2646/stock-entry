import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss'
})
export class DialogComponent {

    @Input()
    public visible: boolean = false;

    @Input()
    public showActions: boolean = false;

    @Output()
    public visiblityChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    public onNoClick() {
        this.visiblityChanged.emit(false);
    }

    public onYesClick() {
        this.visiblityChanged.emit(true);
    }
}
