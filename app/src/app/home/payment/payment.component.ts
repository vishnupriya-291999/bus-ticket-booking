import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  payForm!: FormGroup;
  month = "12";
  value: any;
  seatDetails: any;
  monthInvalid: boolean = false;
  backspacePressed!: boolean;
  showPayment: boolean = false;
  constructor(private router: Router, private homeService: HomeService) { }

  ngOnInit(): void {
    this.seatDetails = this.homeService.getSeatDetails();
    this.showPayment = this.seatDetails? true: false
    this.payForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      cardno: new FormControl(null, [Validators.required]),
      cvv: new FormControl(null, [
        Validators.required,
        Validators.maxLength(3),
        Validators.minLength(3)
      ]),
      expiry: new FormControl(null, [
        Validators.required,
        Validators.maxLength(5),
        Validators.minLength(5),
      ]),
    })
  }
  onKeyDown(event:any) {
    console.log(event);
    if (event.key == "Backspace") {
      this.backspacePressed = true;
      console.log(this.value.length, " pressed Backspace")
      if (this.value.length == 3 && this.backspacePressed) {
        console.log("Month: " + this.month);
        this.payForm.get('expiry')?.patchValue(this.month);
      }
    }
  }


  onInputExpiry(event:any) {
    this.backspacePressed = false;
    this.value = event.target.value;
    this.payForm.get('expiry')?.valueChanges
      .subscribe(value => {
        if (value.length == 2 && !this.backspacePressed) {
          this.month = value;
          if (+this.month > 12) {
            this.monthInvalid = true;
          } else {
            this.monthInvalid = false;
          }
          this.payForm.get('expiry')?.patchValue(value + '/');
        }
      })
  }

  onPayFormSubmit() {
    this.homeService.bookBus();
  }
}