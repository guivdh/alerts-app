import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {SignalService} from "../../services/signal.service";
import {Signal} from "../../models/signal.model";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AlertService} from "../../services/alert.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-alert-dialog',
  templateUrl: './create-alert-dialog.component.html',
  styleUrls: ['./create-alert-dialog.component.scss']
})
export class CreateAlertDialogComponent implements OnInit {

  signals: Signal[] = [];
  filteredSignals: Signal[] = [];
  components: string[] = [];
  system: string[] = [];
  subSystem: string[] = [];
  element: string[] = [];
  isLinear = false;
  currentSignal: Signal;

  createAlertFormGroup = this._formBuilder.group({
    component: ['', Validators.required],
    system: ['', Validators.required],
    subSystem: ['', Validators.required],
    element: ['', Validators.required],
    min: [0, Validators.required],
    max: [0, Validators.required]
  });
  isEdit: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private signalService: SignalService,
    private alertService: AlertService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateAlertDialogComponent>
  ) {
  }

  ngOnInit() {
    this.signals = this.signalService.getSignals();
    this.filteredSignals = this.signals;

    this.setSelectElements();

    if (this.data && this.data.edit) {
      this.isEdit = true;
      this.currentSignal = this.data.alert.signal;
      this.createAlertFormGroup.controls.element.setValue(this.currentSignal.element);
      this.createAlertFormGroup.controls.component.setValue(this.currentSignal.component);
      this.createAlertFormGroup.controls.system.setValue(this.currentSignal.system);
      this.createAlertFormGroup.controls.subSystem.setValue(this.currentSignal.subSystem);
      this.createAlertFormGroup.controls.min.setValue(this.data.alert.lowerThreshold);
      this.createAlertFormGroup.controls.max.setValue(this.data.alert.upperThreshold);
    }
  }

  setSelectElements() {
    this.filteredSignals.forEach(x => {
      if (!this.components.includes(x.component)) {
        this.components.push(x.component)
      }
    });

    this.components.sort((a, b) => this._removeNoneNumberFromString(a) < this._removeNoneNumberFromString(b) ? -1 : 1);
  }


  onComponentSelected() {
    this.system = [];
    this.subSystem = [];
    this.element = [];

    this.createAlertFormGroup.controls.system.setValue('');
    this.createAlertFormGroup.controls.subSystem.setValue('');
    this.createAlertFormGroup.controls.element.setValue('');

    this.signals.filter(x => x.component === this.createAlertFormGroup.value.component).forEach(y => {
      if (!this.system.includes(y.system)) {
        this.system.push(y.system);
      }
    })
    this.system.sort((a, b) => this._removeNoneNumberFromString(a) < this._removeNoneNumberFromString(b) ? -1 : 1);
  }

  onSystemSelected() {
    this.subSystem = [];
    this.element = [];

    this.createAlertFormGroup.controls.subSystem.setValue('');
    this.createAlertFormGroup.controls.element.setValue('');

    this.signals.filter(x => x.system === this.createAlertFormGroup.value.system).forEach(y => {
      if (!this.subSystem.includes(y.subSystem)) {
        this.subSystem.push(y.subSystem);
      }
    })
    this.subSystem.sort((a, b) => this._removeNoneNumberFromString(a) < this._removeNoneNumberFromString(b) ? -1 : 1);
  }

  onSubSystemSelected() {
    this.element = [];

    this.createAlertFormGroup.controls.element.setValue('');

    this.signals.filter(x => x.subSystem === this.createAlertFormGroup.value.subSystem).forEach(y => {
      if (!this.element.includes(y.element)) {
        this.element.push(y.element);
      }
    })
    this.element.sort((a, b) => this._removeNoneNumberFromString(a) < this._removeNoneNumberFromString(b) ? -1 : 1);
  }

  createAlert() {
    if (this.createAlertFormGroup.valid && this._testFormValidation()) {
      const signal = this._findSignal();
      if (signal) {
        this._createAlert(signal);
      }
    }
  }

  updateAlert() {
    if (this._testFormValidation()) {

      const res = this.alertService.updateAlert(this.data.alert, this.createAlertFormGroup.value);
      if (res) {
        this.dialogRef.close();
        this.snackBar.open('Alerte modifiée avec succès !', undefined, {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 4000
        });
      }

    }

  }

  private _createAlert(signal: Signal) {
    const res = this.alertService.createAlert(signal, this.createAlertFormGroup.value);
    if (res) {
      this.dialogRef.close();
      const snackBarRef = this.snackBar.open('Alerte créée avec succès !', 'voir', {
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        duration: 4000
      });
      snackBarRef.onAction().subscribe(() => {
        this.router.navigate(['/alerts'])
      });
    }
  }

  private _testFormValidation(): Boolean {
    if (!this.createAlertFormGroup.valid) {
      return false;
    }

    if (this.createAlertFormGroup.value.min && this.createAlertFormGroup.value.max && this.createAlertFormGroup.value.min > this.createAlertFormGroup.value.max) {
      this.createAlertFormGroup.controls.max.setErrors({minGreaterThanMax: true});
      return false;
    }

    if (!this._findSignal()) {
      return false;
    }

    return true;
  }

  private _findSignal(): Signal | undefined {
    return this.signals.find(x => {
      if (x.component !== this.createAlertFormGroup.controls.component.value) {
        return false;
      }
      if (x.system !== this.createAlertFormGroup.controls.system.value) {
        return false;
      }
      if (x.subSystem !== this.createAlertFormGroup.controls.subSystem.value) {
        return false;
      }
      if (x.element !== this.createAlertFormGroup.controls.element.value) {
        return false;
      }
      return true;
    });
  }

  private _removeNoneNumberFromString(element: string): number {
    return parseInt(element.replace(/^\D+/g, ''));
  }
}
