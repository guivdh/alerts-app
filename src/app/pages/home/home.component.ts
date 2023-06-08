import {Component, OnInit} from '@angular/core';
import {SignalService} from "../../services/signal.service";
import {Signal} from "../../models/signal.model";
import {Alert} from "../../models/alert.model";
import {AlertService} from "../../services/alert.service";
import {MatDialogRef} from "@angular/material/dialog";
import {CreateAlertDialogComponent} from "../../components/create-alert-dialog/create-alert-dialog.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  signals: Signal[];
  recentSignals: Signal[];
  alerts: Alert[];

  constructor(
    private signalsService: SignalService,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<CreateAlertDialogComponent>
  ) {
  }

  ngOnInit() {
    this.signals = this.signalsService.getSignals();
    this.recentSignals = this.signals.splice(this.signals.length - 5, this.signals.length);

    this.alertService.alerts$.subscribe(res => {
      this.alerts = res;
    })
  }

}
