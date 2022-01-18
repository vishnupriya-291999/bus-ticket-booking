import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  loggedInUser:any;
  constructor(private authService: AuthService) { 
  
  }

  ngOnInit(): void {
    this.loggedInUser = this.authService.getLoggedInUser();
    console.log(this.loggedInUser);
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
  }

}