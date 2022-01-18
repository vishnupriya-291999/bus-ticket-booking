import { HttpErrorResponse, HttpInterceptor } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from './error.component';
import { Injectable } from '@angular/core';

@Injectable()

export class ErrorInterceptor implements HttpInterceptor {
    constructor(private dialog: MatDialog) {}
    intercept(req: import("@angular/common/http").HttpRequest<any>, next: import("@angular/common/http").HttpHandler): import("rxjs").Observable<import("@angular/common/http").HttpEvent<any>> {
        return next.handle(req)
        .pipe(
            catchError((error: HttpErrorResponse)=> {
                let errorMsg = "An Unknown Error Occured";
                if(error.error.message) {
                    errorMsg = error.error.message;
                }
                console.log(errorMsg);
                this.dialog.open(ErrorComponent, {
                    data: {title:'An Error Occured', message: errorMsg}
                });
                throw new Error("Method not implemented.");
            })
        )
    }
}