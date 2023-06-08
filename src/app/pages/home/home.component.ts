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

  signals: Signal[];          // Array to store all signals
  recentSignals: Signal[];    // Array to store recent signals
  alerts: Alert[];            // Array to store alerts

  constructor(
    private signalsService: SignalService,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<CreateAlertDialogComponent>
  ) {
  }

  ngOnInit() {
    // Get all signals and assign them to the signals array
    this.signals = this.signalsService.getSignals();

    // Get the recent signals by selecting the last 5 signals from the signals array
    this.recentSignals = this.signals.splice(this.signals.length - 5, this.signals.length);

    // Subscribe to alerts changes and update the alerts array
    this.alertService.alerts$.subscribe(res => {
      this.alerts = res;
    })
  }
}
