import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CreateAlertDialogComponent} from "./create-alert-dialog.component";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatStepperModule} from "@angular/material/stepper";
import {MatSelectModule} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatInputModule} from "@angular/material/input";
import {Signal} from "../../models/signal.model";
import {MatIconModule} from "@angular/material/icon";


describe('CreateAlertDialogComponent', () => {
  let component: CreateAlertDialogComponent;
  let fixture: ComponentFixture<CreateAlertDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, MatSnackBarModule, MatFormFieldModule, MatStepperModule, MatSelectModule, ReactiveFormsModule, BrowserAnimationsModule, MatInputModule, MatIconModule],
      declarations: [CreateAlertDialogComponent],
      providers: [
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: {}},
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CreateAlertDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return false when the form is invalid', () => {

    component.createAlertFormGroup.controls.component.setValue('Component 1');
    component.createAlertFormGroup.controls.system.setValue('');
    component.createAlertFormGroup.controls.subSystem.setValue('Sub System 1');
    component.createAlertFormGroup.controls.element.setValue('Element 1');
    component.createAlertFormGroup.controls.min.setValue(10);
    component.createAlertFormGroup.controls.max.setValue(5);

    const result = component['_testFormValidation']();

    expect(result).toBe(false);
  });

  it('should return false when the thresholds are invalid', () => {
    // Arrange
    component.createAlertFormGroup.controls.component.setValue('Component4 1');
    component.createAlertFormGroup.controls.system.setValue('System10');
    component.createAlertFormGroup.controls.subSystem.setValue('SubSystem22');
    component.createAlertFormGroup.controls.element.setValue('Element55');
    component.createAlertFormGroup.controls.min.setValue(20);
    component.createAlertFormGroup.controls.max.setValue(10); // Invalid, min > max

    const result = component['_testFormValidation']();

    expect(result).toBe(false);
  });

  it('should return false when the matching signal is not found', () => {
    // Arrange
    component.signals = [
      {component: 'Component1', system: 'System1', subSystem: 'SubSystem1', element: 'Element1', signalName: '', description: ''},
      {component: 'Component2', system: 'System2', subSystem: 'SubSystem2', element: 'Element2', signalName: '', description: ''}
    ];
    component.createAlertFormGroup.controls.component.setValue('Component3'); // Signal not found
    component.createAlertFormGroup.controls.system.setValue('System1');
    component.createAlertFormGroup.controls.subSystem.setValue('SubSystem1');
    component.createAlertFormGroup.controls.element.setValue('Element1');
    component.createAlertFormGroup.controls.min.setValue(10);
    component.createAlertFormGroup.controls.max.setValue(20);

    // Act
    const result = component['_testFormValidation']();

    // Assert
    expect(result).toBe(false);
  });

  it('should return true when all conditions are met', () => {

    component.signals = [
      {
        "signalName": "SignalElement55",
        "description": "Description Element55",
        "component": "Component4",
        "system": "System10",
        "subSystem": "SubSystem22",
        "element": "Element55"
      },
      {
        "signalName": "SignalElement18",
        "description": "Description Element18",
        "component": "Component1",
        "system": "System3",
        "subSystem": "SubSystem8",
        "element": "Element18"
      }
    ];
    component.createAlertFormGroup.controls.component.setValue('Component4');
    component.createAlertFormGroup.controls.system.setValue('System10');
    component.createAlertFormGroup.controls.subSystem.setValue('SubSystem22');
    component.createAlertFormGroup.controls.element.setValue('Element55');
    component.createAlertFormGroup.controls.min.setValue(10);
    component.createAlertFormGroup.controls.max.setValue(20);

    const result = component['_testFormValidation']();

    expect(result).toBe(true);
  });

  it('should find the correct signal when all properties match', () => {
    // Arrange
    const signals: Signal[] = [
      {
        signalName: 'SignalElement18',
        description: 'Description Element18',
        component: 'Component1',
        system: 'System3',
        subSystem: 'SubSystem8',
        element: 'Element18',
      },
      {
        signalName: 'SignalElement19',
        description: 'Description Element19',
        component: 'Component2',
        system: 'System4',
        subSystem: 'SubSystem9',
        element: 'Element19',
      },
    ];
    component.signals = signals;
    component.createAlertFormGroup.controls.component.setValue('Component1');
    component.createAlertFormGroup.controls.system.setValue('System3');
    component.createAlertFormGroup.controls.subSystem.setValue('SubSystem8');
    component.createAlertFormGroup.controls.element.setValue('Element18');

    // Act
    const result = component['_findSignal']();

    // Assert
    expect(result).toEqual(signals[0]);
  });

  it('should return undefined if no signal matches the properties', () => {
    // Arrange
    const signals: Signal[] = [
      {
        signalName: 'SignalElement18',
        description: 'Description Element18',
        component: 'Component1',
        system: 'System3',
        subSystem: 'SubSystem8',
        element: 'Element18',
      },
      {
        signalName: 'SignalElement19',
        description: 'Description Element19',
        component: 'Component2',
        system: 'System4',
        subSystem: 'SubSystem9',
        element: 'Element19',
      },
    ];
    component.signals = signals;
    component.createAlertFormGroup.controls.component.setValue('Component3');
    component.createAlertFormGroup.controls.system.setValue('System3');
    component.createAlertFormGroup.controls.subSystem.setValue('SubSystem8');
    component.createAlertFormGroup.controls.element.setValue('Element18');

    // Act
    const result = component['_findSignal']();

    // Assert
    expect(result).toBeUndefined();
  });

  it('should set the select elements correctly based on the filtered signals', () => {
    // Arrange
    component.components = [];
    const filteredSignals: Signal[] = [
      {
        signalName: 'SignalElement18',
        description: 'Description Element18',
        component: 'Component1',
        system: 'System3',
        subSystem: 'SubSystem8',
        element: 'Element18',
      },
      // Add more signals if needed
    ];
    component.filteredSignals = filteredSignals;


    // Act
    component.setSelectElements();

    // Assert
    expect(component.components.length).toEqual(1);
    expect(component.components[0]).toEqual('Component1');
  });

  it('should set the select elements to empty arrays if filtered signals is empty', () => {
    // Arrange

    component.components = [];
    const filteredSignals: Signal[] = [];
    component.filteredSignals = filteredSignals;

    // Act
    component.setSelectElements();

    // Assert
    expect(component.components).toEqual([]);
    expect(component.system).toEqual([]);
    expect(component.subSystem).toEqual([]);
    expect(component.element).toEqual([]);
  });

});
