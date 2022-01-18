import { Injectable } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UrlService {
    private urlChanged = new Subject<string>()
    private url!: string;
    constructor(private router: Router) {
        router.events.subscribe(route=> {
            if(route instanceof NavigationEnd) {
              console.log("URL Service ==> ",route.url)
              this.urlChanged.next(route.url);
              this.url = route.url;
            }
          })
    }

    getUrlChanged() {
        return this.url;
    }

    getUrlChangedListener() {
        return this.urlChanged.asObservable();
    }

}