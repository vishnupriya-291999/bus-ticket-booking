import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
  busTickets!: any[];
  busTicketsArray: any[] = [];
  ticketsLen!: number;
  showMore: boolean = false;
  showMoreBtn: string = "Show";
  // seatDetails: any;
  constructor(private homeService: HomeService, private router: Router) { }

  ngOnInit() {
    this.homeService.getBusTicket()
      .subscribe(resData => {
        this.ticketsLen = resData.result[0].tickets.length;
        console.log(this.ticketsLen);
        this.busTickets = resData.result[0].tickets;
        this.busTickets = this.busTickets.reverse();
        console.log(this.busTickets);
        this.ticketsNumber(1);
      });
    // this.seatDetails = this.busTicket.seatForm.seatDetails;
  }

  onShowMore() {
    this.showMore = !this.showMore;
    if(this.showMore) {
      this.ticketsNumber(this.ticketsLen);
      this.showMoreBtn = "Hide";
    } else {
      this.ticketsNumber(1);
      this.showMoreBtn = "Show";
    }
  }

  private ticketsNumber(number: number) {
    this.busTicketsArray = [];
    for(let i=0;i<number;i++) {
      this.busTicketsArray.push(this.busTickets[i]);
    }
  }

  onBookAgain() {
    this.router.navigateByUrl('home/plan');
  }

}