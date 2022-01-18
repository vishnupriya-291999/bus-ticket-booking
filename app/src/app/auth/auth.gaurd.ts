import { Injectable } from '@angular/core';
import { CanActivate, Router, CanActivateChild } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGaurd implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}
    canActivate(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot): boolean | import("@angular/router").UrlTree | import("rxjs").Observable<boolean | import("@angular/router").UrlTree> | Promise<boolean | import("@angular/router").UrlTree> {
        let auth = this.authService.getAuthStatus();
        if(auth) {
            console.log("Auth Guard ==> User is authenticated");
            return true;
        }
        alert('Please login to access this page');
        return this.router.createUrlTree(['auth']);
        
    }

}