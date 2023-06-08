import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {of} from 'rxjs';
import {saveAs} from 'file-saver';
import {AlertsComponent} from './alerts.component';
import {AlertService} from '../../services/alert.service';
import {SignalService} from '../../services/signal.service';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatStepperModule} from "@angular/material/stepper";
import {MatSelectModule} from "@angular/material/select";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {Signal} from "../../models/signal.model";
import {Alert} from "../../models/alert.model";
import {CreateAlertDialogComponent} from "../../components/create-alert-dialog/create-alert-dialog.component";
import {ConfirmationDialogComponent} from "../../components/confirmation-dialog/confirmation-dialog.component";

describe('AlertsComponent', () => {
  let component: AlertsComponent;
  let fixture: ComponentFixture<AlertsComponent>;
  let alertService: AlertService;
  let signalService: SignalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertsComponent],
      imports: [
        MatDialogModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatStepperModule,
        MatSelectModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatIconModule,
        MatTableModule
      ],
      providers: [
        AlertService,
        SignalService,
        FormBuilder
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertsComponent);
    component = fixture.componentInstance;
    alertService = TestBed.inject(AlertService);
    signalService = TestBed.inject(SignalService);
    spyOn(alertService.alerts$, 'subscribe').and.returnValue(of([]).subscribe());
    spyOn(signalService, 'getSignals').and.returnValue([]);


    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the select elements correctly based on the filtered signals', () => {
    // Arrange
    component.signals = [];
    const signals: Signal[] = [
      {
        signalName: 'SignalElement18',
        description: 'Description Element18',
        component: 'Component1',
        system: 'System3',
        subSystem: 'SubSystem8',
        element: 'Element18',
      }, {
        signalName: 'SignalElement20',
        description: 'Description Element20',
        component: 'Component2',
        system: 'System3',
        subSystem: 'SubSystem0',
        element: 'Element20',
      },
      // Add more signals if needed
    ];
    component.signals = signals;


    // Act
    component.setSelectElements();

    // Assert
    expect(component.components).toEqual(['Component1', 'Component2']);
    expect(component.system).toEqual(['System3']);
    expect(component.subSystem).toEqual(['SubSystem0', 'SubSystem8']);
    expect(component.element).toEqual(['Element18', 'Element20']);
  });

  it('should apply the filter correctly', () => {
    // Mock alerts data
    component.filteredAlerts = [];
    component.alerts = [
      {
        id: 1,
        signal: {
          signalName: 'SignalElement55',
          description: 'Description Element55',
          component: 'Component4',
          system: 'System10',
          subSystem: 'SubSystem22',
          element: 'Element55',
        },
        lowerThreshold: 1,
        upperThreshold: 2,
      },
      {
        id: 2,
        signal: {
          signalName: 'SignalElement18',
          description: 'Description Element18',
          component: 'Component1',
          system: 'System3',
          subSystem: 'SubSystem8',
          element: 'Element18',
        },
        lowerThreshold: 10,
        upperThreshold: 45,
      },
    ];

    // Set initial alerts data to dataSource
    component.dataSource = new MatTableDataSource<Alert>(component.alerts);
    component.table = jasmine.createSpyObj('MatTable', ['renderRows']);

    // Set the filter values
    component.alertsFilterGroup.setValue({
      component: 'Component1',
      system: 'System3',
      subSystem: 'SubSystem8',
      element: 'Element18',
      min: null,
      max: null,
    });

    // Apply the filter
    component.applyFilter();

    // Check the filtered alerts
    expect(component.filteredAlerts.length).toBe(1);
    expect(component.filteredAlerts[0].signal.component).toBe('Component1');
  });

  it('should reset the filter correctly', () => {
    // Mock filtered alerts
    component.filteredAlerts = [
      {
        id: 1,
        signal: {
          signalName: 'SignalElement55',
          description: 'Description Element55',
          component: 'Component4',
          system: 'System10',
          subSystem: 'SubSystem22',
          element: 'Element55',
        },
        lowerThreshold: 1,
        upperThreshold: 2,
      },
      {
        id: 2,
        signal: {
          signalName: 'SignalElement18',
          description: 'Description Element18',
          component: 'Component1',
          system: 'System3',
          subSystem: 'SubSystem8',
          element: 'Element18',
        },
        lowerThreshold: 10,
        upperThreshold: 45,
      },
    ];

    // Set initial filtered alerts to dataSource
    component.dataSource = new MatTableDataSource<Alert>(component.filteredAlerts);

    // Reset the filter
    component.resetFilter();

    // Check if the filter group values are reset
    expect(component.alertsFilterGroup.value).toEqual({
      component: null,
      system: null,
      subSystem: null,
      element: null,
      min: null,
      max: null,
    });

    // Check if the dataSource and filteredAlerts are reset to the original alerts
    expect(component.dataSource.data).toEqual(component.alerts);
    expect(component.filteredAlerts).toEqual(component.alerts);
  });

  it('should download the file correctly', () => {
    // Mock filtered alerts
    component.filteredAlerts = [
      {
        id: 1,
        signal: {
          signalName: 'SignalElement55',
          description: 'Description Element55',
          component: 'Component4',
          system: 'System10',
          subSystem: 'SubSystem22',
          element: 'Element55',
        },
        lowerThreshold: 1,
        upperThreshold: 2,
      },
      {
        id: 2,
        signal: {
          signalName: 'SignalElement18',
          description: 'Description Element18',
          component: 'Component1',
          system: 'System3',
          subSystem: 'SubSystem8',
          element: 'Element18',
        },
        lowerThreshold: 10,
        upperThreshold: 45,
      },
    ];

    const saveAsSpy = spyOn(saveAs, 'saveAs');

    // Call the downloadFile function
    component.downloadFile();

    // Check if saveAs function is called with the correct arguments
    expect(saveAsSpy).toHaveBeenCalledWith(jasmine.any(Blob), 'signals.csv');
  });

  it('should delete the alert successfully', () => {
    // Mock an alert
    const alert: Alert = {
      id: 1,
      signal: {
        signalName: 'SignalElement55',
        description: 'Description Element55',
        component: 'Component4',
        system: 'System10',
        subSystem: 'SubSystem22',
        element: 'Element55'
      },
      lowerThreshold: 1,
      upperThreshold: 2
    };

    const alertService = (component as any).alertService;
    const snackBar = (component as any).snackBar;

    // Create a spy for the delete method of alertService
    const deleteSpy = spyOn(alertService, 'delete').and.returnValue(true);

    // Create a spy for the open method of snackBar
    const openSpy = spyOn(snackBar, 'open');

    // Create a spy for the open method of MatDialog
    const dialogOpenSpy = spyOn(TestBed.inject(MatDialog), 'open').and.returnValue({
      afterClosed: () => of(true), // Simulate the user confirming the deletion
      componentInstance: {}, // Add the componentInstance property
      close: () => {
      } // Add the close method
    } as MatDialogRef<any>); // Cast to MatDialogRef<any>


    // Call the delete method with the mock alert
    component.delete(alert);

    // Expect the open method of MatDialog to have been called with the ConfirmationDialogComponent
    expect(dialogOpenSpy).toHaveBeenCalledWith(ConfirmationDialogComponent, {
      data: {
        text: 'Are you sure you want to delete this alert ?'
      }
    });

    // Expect the snackBar open method to have been called with the correct parameters
    expect(openSpy).toHaveBeenCalledWith(
      'Alert deleted successfully !',
      undefined,
      {
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        duration: 4000
      }
    );

    // Expect the open method of MatDialog to have been called with the ConfirmationDialogComponent
    expect(dialogOpenSpy).toHaveBeenCalledWith(ConfirmationDialogComponent, {
      data: {
        text: 'Are you sure you want to delete this alert ?'
      }
    });
  });


  it('should open the dialog for editing an alert', () => {
    // Mock an alert
    const alert: Alert = {
      id: 1,
      signal: {
        signalName: 'SignalElement55',
        description: 'Description Element55',
        component: 'Component4',
        system: 'System10',
        subSystem: 'SubSystem22',
        element: 'Element55'
      },
      lowerThreshold: 1,
      upperThreshold: 2
    };

    // Access the private dialog property
    const dialog = (component as any).dialog;

    // Create a spy for the open method of dialog
    const openSpy = spyOn(dialog, 'open');

    // Call the edit method with the mock alert
    component.edit(alert);

    // Expect the open method to have been called with the CreateAlertDialogComponent
    expect(openSpy).toHaveBeenCalledWith(CreateAlertDialogComponent, {
      data: {
        edit: true,
        alert: alert
      }
    });
  });

});
