import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {AlertService} from '../../services/alert.service';
import {SignalService} from '../../services/signal.service';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatStepperModule} from "@angular/material/stepper";
import {MatSelectModule} from "@angular/material/select";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {SignalsComponent} from "./signals.component";
import {Signal} from "../../models/signal.model";
import {saveAs} from "file-saver";

describe('SignalsComponent', () => {
  let component: SignalsComponent;
  let fixture: ComponentFixture<SignalsComponent>;
  let alertService: AlertService;
  let signalService: SignalService;

  // Mock SignalService
  const signalServiceMock = {
    getSignals: () => [
      {
        signalName: 'SignalElement12',
        description: 'Description Element12',
        component: 'Component1',
        system: 'System2',
        subSystem: 'SubSystem5',
        element: 'Element12'
      }, {
        signalName: "SignalElement23",
        description: "Description Element23",
        component: "Component2",
        system: "System4",
        subSystem: "SubSystem10",
        element: "Element23"
      }, {
        signalName: "SignalElement49",
        description: "Description Element49",
        component: "Component4",
        system: "System9",
        subSystem: "SubSystem20",
        element: "Element49"
      },
    ] as Signal[],
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignalsComponent],
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
        FormBuilder,
        {provide: SignalService, useValue: signalServiceMock},
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate select elements correctly', () => {
    component.setSelectElements();
    expect(component.components).toEqual(['Component1', 'Component2', 'Component4']);
    expect(component.system).toEqual(['System2', 'System4', 'System9']);
    expect(component.subSystem).toEqual(['SubSystem5', 'SubSystem10', 'SubSystem20']);
    expect(component.element).toEqual(['Element12', 'Element23', 'Element49']);
  });

  it('should apply filters correctly', () => {
    component.signalsFilterGroup.setValue({
      component: 'Component2',
      system: 'System4',
      subSystem: '',
      element: 'Element23',
    });
    component.applyFilter();
    expect(component.filteredSignals).toEqual([
      {
        signalName: 'SignalElement23',
        description: 'Description Element23',
        component: 'Component2',
        system: 'System4',
        subSystem: 'SubSystem10',
        element: 'Element23'
      },
    ]);
  });

  it('should return no signals if filter does not match any', () => {
    component.signalsFilterGroup.setValue({
      component: 'Component3',
      system: 'System5',
      subSystem: '',
      element: 'Element30',
    });
    component.applyFilter();
    expect(component.filteredSignals).toEqual([]);
  });

  it('should reset the filter correctly', () => {
    // Apply a filter
    component.signalsFilterGroup.setValue({
      component: 'Component2',
      system: 'System4',
      subSystem: '',
      element: 'Element23',
    });
    component.applyFilter();

    // Reset the filter
    component.resetFilter();

    expect(component.signalsFilterGroup.value).toEqual({
      component: null,
      system: null,
      subSystem: null,
      element: null,
    });
    expect(component.dataSource.data).toEqual(component.signals);
    expect(component.filteredSignals).toEqual(component.signals);
  });

  it('should download the file correctly', () => {

    const saveAsSpy = spyOn(saveAs, 'saveAs');

    // Call the downloadFile function
    component.downloadFile();

    // Check if saveAs function is called with the correct arguments
    expect(saveAsSpy).toHaveBeenCalledWith(jasmine.any(Blob), 'signals.csv');
  });

});
