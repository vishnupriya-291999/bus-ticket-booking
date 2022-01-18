import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { HomeModel } from '../home.model';
import { HomeService } from '../home.service';
import { FormArray, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-seat',
  templateUrl: './seat.component.html',
  styleUrls: ['./seat.component.css']
})
export class SeatComponent implements OnInit {
  @HostListener("window: beforeunload")
  onRefresh() {
    alert("Refreshing");
  }
  // public seatArray= [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40];
  public seatArray = [
    { value: 1, clicked: false, booked: false },
    { value: 2, clicked: false, booked: false },
    { value: 3, clicked: false, booked: false },
    { value: 4, clicked: false, booked: false },
    { value: 5, clicked: false, booked: false },
    { value: 6, clicked: false, booked: false },
    { value: 7, clicked: false, booked: false },
    { value: 8, clicked: false, booked: false },
    { value: 9, clicked: false, booked: false },
    { value: 10, clicked: false, booked: false },
    { value: 11, clicked: false, booked: false },
    { value: 12, clicked: false, booked: false },
    { value: 13, clicked: false, booked: false },
    { value: 14, clicked: false, booked: false },
    { value: 15, clicked: false, booked: false },
    { value: 16, clicked: false, booked: false },
    { value: 17, clicked: false, booked: false },
    { value: 18, clicked: false, booked: false },
    { value: 19, clicked: false, booked: false },
    { value: 20, clicked: false, booked: false },
    { value: 21, clicked: false, booked: false },
    { value: 22, clicked: false, booked: false },
    { value: 23, clicked: false, booked: false },
    { value: 24, clicked: false, booked: false },
    { value: 25, clicked: false, booked: false },
    { value: 26, clicked: false, booked: false },
    { value: 27, clicked: false, booked: false },
    { value: 28, clicked: false, booked: false },
    { value: 29, clicked: false, booked: false },
    { value: 30, clicked: false, booked: false },
    { value: 31, clicked: false, booked: false },
    { value: 32, clicked: false, booked: false },
    { value: 33, clicked: false, booked: false },
    { value: 34, clicked: false, booked: false },
    { value: 35, clicked: false, booked: false },
    { value: 36, clicked: false, booked: false },
    { value: 37, clicked: false, booked: false },
    { value: 38, clicked: false, booked: false },
    { value: 39, clicked: false, booked: false },
    { value: 40, clicked: false, booked: false }

  ];
  bus!: HomeModel ;
  noBusDetails!: boolean;
  totalFare: any = 0;
  tax:any;
  selectedSeatNos: any[] = [];
  seatForm!: FormGroup;
  showSeat: boolean = false;
  viewSeatsDisabled: boolean = false;
  driverSeat:any[] = [1,2,3,4];
  seatsObj:any;

  get seatDetails() {
    return this.seatForm.get('seatDetails') as FormArray;
  }

  constructor(private router: Router, private homeService: HomeService,
    private formBuilder: FormBuilder, private authService: AuthService,
    private  snackBar: MatSnackBar) {
     
  }

  ngOnInit() {
    this.seatForm = this.formBuilder.group({
      seatDetails: this.formBuilder.array([])
    })
    this.selectedSeatNos = [];
    this.seatsObj = this.homeService.getViewSeats();
    this.bus = this.seatsObj.bus;
    if(!this.bus) {
      console.log("No Bus details")
      this.noBusDetails = true;
    } else {
      console.log(this.bus);
      this.noBusDetails = false;
      this.totalFare = this.bus.fare + 180;
      if (this.bus.bookedSeats.length > 0) {
        this.seatArray.forEach((elt, i) => {
          this.bus.bookedSeats.map(no => {
            if (elt.value == no) {
              this.seatArray[i].booked = true;
            }
          })
        })
      }
    }
    
    console.log(this.seatArray);
  }

  onSelfClicked(event:any) {
    console.log(event.target.checked);
    console.log(this.seatForm.controls['seatDetails'].value[0]);
    if(event.target.checked) {
      let loggedInUser = this.authService.getLoggedInUser()
     this.seatDetails.patchValue([
       {name: loggedInUser.name, age: loggedInUser.age, gender: loggedInUser.gender}
     ]);
    } else {
      this.seatDetails.patchValue([
        {name: '', age: '', gender: ''}
      ])
    }
  }

  onSeatSelect(seatIndex:any) {
    if(this.seatArray[seatIndex-1].booked) {
      console.log("this seat is Booked !!")
      return;
    }
    this.seatArray[seatIndex - 1].clicked = !this.seatArray[seatIndex - 1].clicked; //toggle
    if( this.selectedSeatNos.length>4 && this.seatArray[seatIndex - 1].clicked) {
      this.snackBar.open("Not Allowed To Book More Than 5 Seats","OK", {
        duration: 3000
      });
      this.seatArray[seatIndex - 1].clicked = !this.seatArray[seatIndex - 1].clicked; //toggle
      return;
    }
    console.log("Selected: "+this.seatArray[seatIndex - 1].clicked);
    if (this.seatArray[seatIndex - 1].clicked) { //push to array;
      this.selectedSeatNos.push(seatIndex);
      this.seatDetails.push(this.formBuilder.group({
        name: this.formBuilder.control('', Validators.required),
        age: this.formBuilder.control('', Validators.required),
        gender: this.formBuilder.control('', Validators.required),
        seatNo: this.formBuilder.control(seatIndex)
      }));
      console.log(this.seatForm.controls['seatDetails'].value);
    } else { //remove from array and Form Array
      console.log("Remove seat, ",seatIndex);
      let control =<FormArray> this.seatForm.controls['seatDetails'];
      for(let i=0; i<=this.selectedSeatNos.length; i++) {
        console.log(control.value[i])
        if(control.value[i].seatNo == seatIndex) {
          console.log("Match Found : ",this.seatForm.controls['seatDetails'].value[i]);
          control.removeAt(i);
          break;
        }
      }
      console.log(control.value);
      this.selectedSeatNos = this.selectedSeatNos.filter(val => {
        return val !== seatIndex;
       })
       console.log(this.selectedSeatNos);
    }
    if(this.selectedSeatNos.length > 0) {
      this.showSeat = true;
    } else{
      this.showSeat = false;
    }
    this.totalFare = ((this.bus.fare*this.selectedSeatNos.length)+(this.selectedSeatNos.length * 180));
    console.log(this.bus.fare)
    this.tax=this.selectedSeatNos.length*180;
  }

  onConfirm() {
    console.log("Confirm: ", this.bus);
    this.homeService.saveSeatDetails(this.bus._id, this.selectedSeatNos, this.seatForm.value,this.totalFare);
    console.log(this.seatForm.value);
    this.router.navigate(['home/payment']);
  }

}