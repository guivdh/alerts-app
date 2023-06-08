import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./pages/home/home.component";
import {AlertsComponent} from "./pages/alerts/alerts.component";
import {SignalsComponent} from "./pages/signals/signals.component";

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'alerts', component: AlertsComponent},
  {path: 'signals', component: SignalsComponent},
  {path: '**', redirectTo: '/home', pathMatch: 'full'},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
