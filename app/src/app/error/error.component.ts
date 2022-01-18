import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject, Component } from '@angular/core';

@Component({
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.css']
})

export class ErrorComponent {
    constructor(public dialogRef: MatDialogRef<ErrorComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {title: string, message: string }) { }

    onClose() {
        this.dialogRef.close();
    }
}
