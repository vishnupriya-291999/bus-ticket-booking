import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { UrlService } from '../url.service';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }]

})
export class HeaderComponent implements OnInit, OnDestroy {
  isLinkDisbaled: boolean = false;
  disbaleBackBtn: boolean = true;
  url: string = '';
  urlChangedSub!: Subscription;

  constructor(private location: Location, private urlService: UrlService) {
  }

  ngOnInit() {
  
    this.url = this.urlService.getUrlChanged();
    console.log("URL: ", this.url);
    this.checkUrlPath();
    this.urlChangedSub = this.urlService.getUrlChangedListener()
      .subscribe(resData => {
        console.log(resData);
        this.url = resData;
        console.log("Header", this.url);
        this.checkUrlPath();
      });

  }

  private checkUrlPath() {
    if (this.url.includes('payment') || this.url.includes('seat')) {
      console.log("Not in plan route, hence back button is enabled");
      this.disbaleBackBtn = false;
    }
    else {
      console.log("In plan route, hence button is disabled")
      this.disbaleBackBtn = true;
    }
  }

  onGoBack() {
    this.location.back()
  }

  ngOnDestroy() {
    this.urlChangedSub.unsubscribe();
  }

}