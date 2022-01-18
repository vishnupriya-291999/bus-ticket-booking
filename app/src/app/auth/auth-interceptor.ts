import { HttpInterceptor } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable()

export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {}

    intercept(req: import("@angular/common/http").HttpRequest<any>, next: import("@angular/common/http").HttpHandler): import("rxjs").Observable<import("@angular/common/http").HttpEvent<any>> {
        const token = this.authService.getToken();
        const newUrl = req.clone({
            headers: req.headers.set('Authorization', "Bearer "+token)
        })
        return next.handle(newUrl);
    }

}
