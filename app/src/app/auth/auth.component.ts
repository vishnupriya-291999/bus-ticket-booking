import { Component, OnInit } from '@angular/core';
import { AuthSignupModel } from './auth-signup.model';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  showPass: boolean = false;
  passInput: string = '';
  repassInput: string = '';
  emailInput: string = '';
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }
  onShowPass(event:any) {
    this.showPass = event.target.checked;
    console.log("showPass: ", this.showPass);

  }
  onCreateUser(form:any) {
    let dateString = form.value.dob;
    var dateParts = dateString.split('/');
    var dob = new Date(+dateParts[2], +dateParts[1]-1, +dateParts[0]);
    let age = (new Date((Date.now() - dob.getTime())).getUTCFullYear() -1970);
    console.log(age);
    this.authService.signup(form.value, age);
    form.reset();

  }
  onLoginUser(form:any) {
    this.authService.login(form.value);
  }
}