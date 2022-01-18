import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthSignupModel } from './auth-signup.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from '../error/error.component';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    url: string = '';
    private token: any;
    private isAuthenticated: boolean = false;
    private logoutTimer:any;
    private authStateListener = new Subject<boolean>()
    private loggedInUser = {name: '',gender: '',age: ''};
    private homeStatus = {plan: true, seat: false, confirm: false, payment: false};   

    constructor(private http: HttpClient, private router: Router, private dialog: MatDialog) { }

    getToken() {
        return this.token;
    }

    getUrl() {
        return this.url;
    }

    getLoggedInUser() { //returns name, age and gender
        return this.loggedInUser;
    }

    getHomeStatus() { //returns status of plan, seat, paymet and confirm
        return this.homeStatus;
    }

    getAuthStatus() {
        return this.isAuthenticated;
    }

    getAuthStateListener() {
        return this.authStateListener.asObservable();
    }

    signup(signupObj:any, age: number) {
        let signupUser: AuthSignupModel = {
            fname: signupObj.fname,
            lname: signupObj.lname,
            phone: signupObj.phone,
            gender: signupObj.gender,
            email: signupObj.emailSignup,
            pass: signupObj.passSignup,
            age: age
        }
        console.log(signupUser);
        this.http.post<{message: string}>('http://localhost:3000/auth/signup', signupUser)
            .subscribe(resData => {
                console.log(resData);
                this.dialog.open(ErrorComponent, {
                    data: {title: resData.message, message: 'Now Login With Your Credentials'}
                });
            });
    }

    login(loginObj:any) {
        let loginUser = {
            email: loginObj.email,
            pass: loginObj.pass
        };
        this.http.post<{
            message: string,
            token: string,
            expiresIn: number,
            name: string,
            gender: string,
            age: string
        }>('http://localhost:3000/auth/login', loginUser)
            .subscribe((resData) => {
                console.log(resData);
                this.loggedInUser.name = resData.name;
                this.loggedInUser.gender = resData.gender;
                this.loggedInUser.age = resData.age;
                this.token = resData.token;
                const expiresIn = resData.expiresIn;
                if (this.token) {
                    this.isAuthenticated = true;
                    this.authStateListener.next(true);
                    this.autoLogout(expiresIn * 1000);
                    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
                    this.saveAuthData(this.token, expirationDate, this.loggedInUser.name, this.loggedInUser.gender,this.loggedInUser.age);
                    this.router.navigate(['home/plan'])
                }
            }, err => {
                this.authStateListener.next(false);
                console.log(err);
            })
    }


    autoLogin() {
        const user = this.getAuthData();
        if(!user) {
            console.log("user is NOT in localstorage");
            return;
        }
        console.log("user is still in localstorage");
        console.log(user);
        const expiresIn = user.expirationDate.getTime() - new Date().getTime();
        console.log("New expiry time in minutes", expiresIn/60000);
        this.autoLogout(expiresIn);
        this.token = user.token;
      /*  this.loggedInUser.name = user.name;
        this.loggedInUser.gender! = user.gender;
        this.loggedInUser.age = user.age;
        this.isAuthenticated = true;*/
        this.authStateListener.next(true);

    }

    autoLogout(expiresIn: number) {
        this.logoutTimer = setTimeout(()=> {
            this.logout();
        }, expiresIn)
    }

    logout() {
        this.router.navigate(['auth']);
        console.log("logout called");
        alert("Logged Out")
        this.authStateListener.next(false);
        this.isAuthenticated = false;
        this.token = null;
        clearTimeout(this.logoutTimer);
        this.deleteAuthData();
    }

    saveAuthData(token: string, expirationDate: Date, name: string, gender: string, age: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expirationDate', expirationDate.toISOString());
        localStorage.setItem('name', name);
        localStorage.setItem('gender', gender);
        localStorage.setItem('age', age);
    }

    deleteAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expirationDate');
        localStorage.removeItem('userId');
        localStorage.removeItem('name');
        localStorage.removeItem('gender');
        localStorage.removeItem('age');
    }

    getAuthData() {
        let authUser;
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem('expirationDate');
        const name = localStorage.getItem("name");
        const gender = localStorage.getItem("gender");
        const age = localStorage.getItem("age");
        if(!token || !expirationDate) {
            return;
        }
        authUser = {token: token, expirationDate: new Date(expirationDate), name: name, gender: gender, age: age}
        return authUser;
    }
}