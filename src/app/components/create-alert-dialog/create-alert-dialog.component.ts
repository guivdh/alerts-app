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

  signals: Signal[] = []; // List of signals
  filteredSignals: Signal[] = []; // Filtered list of signals
  currentSignal: Signal; // Currently selected signal

  components: string[] = []; // List of components
  system: string[] = []; // List of systems
  subSystem: string[] = []; // List of subsystems
  element: string[] = []; // List of elements

  createAlertFormGroup = this._formBuilder.group({
    component: ['', Validators.required], // Component form control
    system: ['', Validators.required], // System form control
    subSystem: ['', Validators.required], // Subsystem form control
    element: ['', Validators.required], // Element form control
    min: [0, Validators.required], // Minimum threshold form control
    max: [0, Validators.required] // Maximum threshold form control
  });

  isEdit: boolean = false; // Indicates if the form is in edit mode

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
    this.signals = this.signalService.getSignals(); // Retrieve the list of signals
    this.filteredSignals = this.signals;

    this.setSelectElements(); // Set the select elements

    if (this.data && this.data.edit) {
      this.isEdit = true;
      this.currentSignal = this.data.alert.signal; // Set the current signal
      this.createAlertFormGroup.controls.element.setValue(this.currentSignal.element);
      this.createAlertFormGroup.controls.component.setValue(this.currentSignal.component);
      this.createAlertFormGroup.controls.system.setValue(this.currentSignal.system);
      this.createAlertFormGroup.controls.subSystem.setValue(this.currentSignal.subSystem);
      this.createAlertFormGroup.controls.min.setValue(this.data.alert.lowerThreshold);
      this.createAlertFormGroup.controls.max.setValue(this.data.alert.upperThreshold);
    }
  }

  /**
   * Sets the select elements based on the filtered signals.
   */
  setSelectElements() {
    this.filteredSignals.forEach(x => {
      if (!this.components.includes(x.component)) {
        this.components.push(x.component);
      }
    });

    this.components.sort((a, b) => this._removeNoneNumberFromString(a) < this._removeNoneNumberFromString(b) ? -1 : 1);
  }

  /**
   * Event handler when the component select value changes.
   */
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
    });
    this.system.sort((a, b) => this._removeNoneNumberFromString(a) < this._removeNoneNumberFromString(b) ? -1 : 1);
  }

  /**
   * Event handler when the system select value changes.
   */
  onSystemSelected() {
    this.subSystem = [];
    this.element = [];

    this.createAlertFormGroup.controls.subSystem.setValue('');
    this.createAlertFormGroup.controls.element.setValue('');

    this.signals.filter(x => x.system === this.createAlertFormGroup.value.system).forEach(y => {
      if (!this.subSystem.includes(y.subSystem)) {
        this.subSystem.push(y.subSystem);
      }
    });
    this.subSystem.sort((a, b) => this._removeNoneNumberFromString(a) < this._removeNoneNumberFromString(b) ? -1 : 1);
  }

  /**
   * Event handler when the subsystem select value changes.
   */
  onSubSystemSelected() {
    this.element = [];

    this.createAlertFormGroup.controls.element.setValue('');

    this.signals.filter(x => x.subSystem === this.createAlertFormGroup.value.subSystem).forEach(y => {
      if (!this.element.includes(y.element)) {
        this.element.push(y.element);
      }
    });
    this.element.sort((a, b) => this._removeNoneNumberFromString(a) < this._removeNoneNumberFromString(b) ? -1 : 1);
  }

  /**
   * Creates an alert based on the form data.
   */
  createAlert() {
    if (this.createAlertFormGroup.valid && this._testFormValidation()) {
      const signal = this._findSignal();
      if (signal) {
        this._createAlert(signal);
      }
    }
  }

  /**
   * Updates an existing alert based on the form data.
   */
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

  /**
   * Creates an alert with the specified signal and form data.
   * @param signal The signal to create the alert for.
   */
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
        this.router.navigate(['/alerts']);
      });
    }
  }

  /**
   * Tests the form validation and returns a boolean indicating whether the form is valid or not.
   * @returns A boolean indicating whether the form is valid or not.
   */
  private _testFormValidation(): boolean {
    if (!this.createAlertFormGroup.valid) {
      return false;
    }

    const minValue = this.createAlertFormGroup.value.min ?? 0;
    const maxValue = this.createAlertFormGroup.value.max ?? 0;

    if (minValue > maxValue) {
      this.createAlertFormGroup.controls.max.setErrors({ minGreaterThanMax: true });
      return false;
    }

    if(minValue === 0 && maxValue === 0) {
      this.createAlertFormGroup.controls.max.setErrors({ minGreaterThanMax: true });
      return false;
    }

    if (!this._findSignal()) {
      return false;
    }

    return true;
  }


  /**
   * Finds and returns the signal that matches the form data.
   * @returns The matching signal or undefined if not found.
   */
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

  /**
   * Removes non-numeric characters from a string and returns the resulting number.
   * @param element The string element to process.
   * @returns The resulting number after removing non-numeric characters.
   */
  private _removeNoneNumberFromString(element: string): number {
    return parseInt(element.replace(/^\D+/g, ''));
  }
}
