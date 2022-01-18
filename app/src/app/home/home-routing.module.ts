import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { PlanComponent } from './plan/plan.component';
import { SeatComponent } from './seat/seat.component';
import { PaymentComponent } from './payment/payment.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { AuthGaurd } from '../auth/auth.gaurd';

const homeRoutes: Routes = [{
    path: '', component: HomeComponent ,canActivate: [AuthGaurd],
    children: [
        { path: 'plan', component: PlanComponent},
        { path: 'seat', component: SeatComponent},
        { path: 'payment', component: PaymentComponent },
        { path: 'confirm', component: ConfirmComponent }
    ]
}]

@NgModule({
    imports: [RouterModule.forChild(homeRoutes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }