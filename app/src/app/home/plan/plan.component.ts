import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe, JsonPipe } from '@angular/common';
import { HomeService } from '../home.service';
import { HomeModel } from '../home.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit, OnDestroy {
  planForm!: FormGroup;
  todayDate:any;
  busesArray: HomeModel[] = [];
  showNoBusesMsg: boolean = false;
  busesArraySub!: Subscription;
  fromCities!: string[];
  viewSeatsDisabled: boolean[] = [];

  constructor(private datePipe: DatePipe, private homeService: HomeService,
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.fromCities = ["Bangalore", "Chennai", "Kottayam", "Mumbai"]
    this.planForm = new FormGroup({
      'from': new FormControl(null, [Validators.required]),
      'to': new FormControl(null, [Validators.required]),
      'date': new FormControl(null, [Validators.required])
    })
    this.todayDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    console.log(this.todayDate);
  }

  onSubmitPlan() {
    let dateArr = this.planForm.value.date.split("-");
    dateArr = dateArr.reverse();
    let formatDate = dateArr.join("-");
    this.homeService.fetchBusDetails(this.planForm.value.from, this.planForm.value.to, formatDate);
    this.busesArraySub = this.homeService.getBusesArrayListener()
    .subscribe(resData=> {
      console.log(resData);
      this.busesArray = resData;
      this.busesArray.sort(this.compare) // sort the bus array based on pricing
      if(this.busesArray.length<1) {
        this.showNoBusesMsg = true;
      } else {
        this.viewSeatsDisabled = this.busesArray.map(elt=> {
          return elt.ava === "No"? true: false;

        })
        this.showNoBusesMsg = false;
      }
    })
  }

   compare(a: HomeModel,b: HomeModel) {
    let compare = 0;
    if(a.fare>b.fare) {
      compare =1
    } else if(a.fare<b.fare) {
      compare = -1
    }
    return compare;
  }

  onClearBusArray() {
    this.busesArray = [];
    this.showNoBusesMsg = false;
    this.planForm.reset(); 
  }

  onViewSeats(busDetails: HomeModel) {
    console.log(busDetails);
    this.homeService.bus = busDetails;
    this.router.navigate(['home/seat'])
  }

  ngOnDestroy() {
    if(this.showNoBusesMsg) {
      this.busesArraySub.unsubscribe();
    }
  }
}