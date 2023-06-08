import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {AlertService} from "../../services/alert.service";
import {Alert} from "../../models/alert.model";
import {MatDialog} from "@angular/material/dialog";
import {CreateAlertDialogComponent} from "../../components/create-alert-dialog/create-alert-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SignalService} from "../../services/signal.service";
import {Signal} from "../../models/signal.model";
import {FormBuilder} from "@angular/forms";
import {saveAs} from "file-saver";

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {

  @ViewChild(MatTable) table: MatTable<any>

  alerts: Alert[] = [];
  filteredAlerts: Alert[] = [];
  signals: Signal[] = [];

  displayedColumns: string[] = ['signal', 'min', 'max', 'actions'];
  dataSource: MatTableDataSource<Alert>;

  alertsFilterGroup = this._formBuilder.group({
    component: [''],
    system: [''],
    subSystem: [''],
    element: [''],
    min: [''],
    max: [''],
  });

  components: string[] = [];
  system: string[] = [];
  subSystem: string[] = [];
  element: string[] = [];

  constructor(
    private alertService: AlertService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private signalService: SignalService,
    private _formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.alertService.alerts$.subscribe(res => {
      this.alerts = res;
      this.filteredAlerts = this.alerts;
      this.dataSource = new MatTableDataSource<Alert>(this.alerts);
      if (this.table) {
        this.table.renderRows();
      }
    });

    this.signals = this.signalService.getSignals();
    this.setSelectElements();
  }

  setSelectElements() {
    this.signals.forEach(x => {
      if (!this.components.includes(x.component)) {
        this.components.push(x.component)
      }
    });
    this.signals.forEach(x => {
      if (!this.system.includes(x.system)) {
        this.system.push(x.system)
      }
    });
    this.signals.forEach(x => {
      if (!this.subSystem.includes(x.subSystem)) {
        this.subSystem.push(x.subSystem)
      }
    });
    this.signals.forEach(x => {
      if (!this.element.includes(x.element)) {
        this.element.push(x.element)
      }
    });

    this.components.sort((a, b) => this._removeNoneNumberFromString(a) < this._removeNoneNumberFromString(b) ? -1 : 1);
    this.system.sort((a, b) => this._removeNoneNumberFromString(a) < this._removeNoneNumberFromString(b) ? -1 : 1);
    this.subSystem.sort((a, b) => this._removeNoneNumberFromString(a) < this._removeNoneNumberFromString(b) ? -1 : 1);
    this.element.sort((a, b) => this._removeNoneNumberFromString(a) < this._removeNoneNumberFromString(b) ? -1 : 1);
  }

  edit(row: Alert) {
    this.dialog.open(CreateAlertDialogComponent, {
      data: {
        edit: true,
        alert: row
      }
    })
  }

  delete(row: Alert) {
    const res = this.alertService.delete(row.id)
    if (res) {
      this.snackBar.open('Alerte supprimée avec succès !', undefined, {
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        duration: 4000
      });
    }

  }

  applyFilter() {
    this.filteredAlerts = this.alerts;
    if (this.alertsFilterGroup.value.component) {
      this.filteredAlerts = this.filteredAlerts.filter(x => x.signal.component === this.alertsFilterGroup.value.component);
    }
    if (this.alertsFilterGroup.value.system) {
      this.filteredAlerts = this.filteredAlerts.filter(x => x.signal.system === this.alertsFilterGroup.value.system);
    }
    if (this.alertsFilterGroup.value.subSystem) {
      this.filteredAlerts = this.filteredAlerts.filter(x => x.signal.subSystem === this.alertsFilterGroup.value.subSystem);
    }
    if (this.alertsFilterGroup.value.element) {
      this.filteredAlerts = this.filteredAlerts.filter(x => x.signal.element === this.alertsFilterGroup.value.element);
    }
    if (this.alertsFilterGroup.value.min) {
      // @ts-ignore
      this.filteredAlerts = this.filteredAlerts.filter(x => x.lowerThreshold >= this.alertsFilterGroup.value.min);
    }
    if (this.alertsFilterGroup.value.max) {
      // @ts-ignore
      this.filteredAlerts = this.filteredAlerts.filter(x => x.upperThreshold <= this.alertsFilterGroup.value.max);
    }
    this.dataSource.data = this.filteredAlerts
    if (this.table) {
      this.table.renderRows();
    }
  }

  resetFilter() {
    this.alertsFilterGroup.reset();
    this.dataSource.data = this.alerts;
    this.filteredAlerts = this.alerts;
  }

  downloadFile() {
    const header = Object.keys(this.filteredAlerts[0]);
    const csvRows = [];

    csvRows.push(header.join(';'));

    this.filteredAlerts.forEach((row: any) => {
      const values = header.map((fieldName: any) => row[fieldName]);
      csvRows.push(values.join(';'));
    });

    const csvString = csvRows.join('\r\n');
    const blob = new Blob([csvString], {type: 'text/csv;charset=utf-8,'});
    saveAs(blob, 'signals.csv');
  }

  createOne() {
    this.dialog.open(CreateAlertDialogComponent);
  }

  private _removeNoneNumberFromString(element: string): number {
    return parseInt(element.replace(/^\D+/g, ''));
  }
}
