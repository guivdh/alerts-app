import {Component, OnInit, ViewChild} from '@angular/core';
import {SignalService} from "../../services/signal.service";
import {Signal} from "../../models/signal.model";
import {FormBuilder} from "@angular/forms";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-signals',
  templateUrl: './signals.component.html',
  styleUrls: ['./signals.component.scss']
})
export class SignalsComponent implements OnInit {

  @ViewChild(MatTable) table: MatTable<any>

  signals: Signal[] = [];                    // Array to store all signals
  filteredSignals: Signal[] = [];            // Array to store filtered signals
  dataSource: MatTableDataSource<Signal>;    // Data source for the table

  components: string[] = [];                 // Array to store components for filtering
  system: string[] = [];                     // Array to store systems for filtering
  subSystem: string[] = [];                  // Array to store sub-systems for filtering
  element: string[] = [];                    // Array to store elements for filtering

  signalsFilterGroup = this._formBuilder.group({
    component: [''],
    system: [''],
    subSystem: [''],
    element: [''],
  });

  displayedColumns: string[] = ['name', 'description', 'component', 'system', 'subSystem', 'element'];

  constructor(
    private signalService: SignalService,
    private _formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    // Get all signals and assign them to the signals array
    this.signals = this.signalService.getSignals();

    // Set the initial filtered signals to all signals
    this.filteredSignals = this.signals;

    // Create the data source with the signals array
    this.dataSource = new MatTableDataSource<Signal>(this.signals);

    // Set the select elements for filtering
    this.setSelectElements();
  }

  setSelectElements() {
    // Iterate over the signals to extract unique values for components, systems, sub-systems, and elements
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

    // Sort the select elements in ascending order
    this.components.sort((a, b) => this._removeNoneNumberFromString(a) < this._removeNoneNumberFromString(b) ? -1 : 1);
    this.system.sort((a, b) => this._removeNoneNumberFromString(a) < this._removeNoneNumberFromString(b) ? -1 : 1);
    this.subSystem.sort((a, b) => this._removeNoneNumberFromString(a) < this._removeNoneNumberFromString(b) ? -1 : 1);
    this.element.sort((a, b) => this._removeNoneNumberFromString(a) < this._removeNoneNumberFromString(b) ? -1 : 1);
  }

  applyFilter() {
    // Reset the filtered signals to all signals
    this.filteredSignals = this.signals;

    // Apply filters based on the selected values in the form group
    if (this.signalsFilterGroup.value.component) {
      this.filteredSignals = this.filteredSignals.filter(x => x.component === this.signalsFilterGroup.value.component);
    }
    if (this.signalsFilterGroup.value.system) {
      this.filteredSignals = this.filteredSignals.filter(x => x.system === this.signalsFilterGroup.value.system);
    }
    if (this.signalsFilterGroup.value.subSystem) {
      this.filteredSignals = this.filteredSignals.filter(x => x.subSystem === this.signalsFilterGroup.value.subSystem);
    }
    if (this.signalsFilterGroup.value.element) {
      this.filteredSignals = this.filteredSignals.filter(x => x.element === this.signalsFilterGroup.value.element);
    }

    // Update the data source with the filtered signals
    this.dataSource.data = this.filteredSignals;

    // Render the table rows
    if (this.table) {
      this.table.renderRows();
    }
  }

  resetFilter() {
    // Reset the form group and set the data source and filtered signals back to all signals
    this.signalsFilterGroup.reset();
    this.dataSource.data = this.signals;
    this.filteredSignals = this.signals;
  }

  downloadFile() {
    const header = Object.keys(this.filteredSignals[0]);
    const csvRows = [];

    // Add the header row
    csvRows.push(header.join(';'));

    // Add each data row
    this.filteredSignals.forEach((row: any) => {
      const values = header.map((fieldName: any) => row[fieldName]);
      csvRows.push(values.join(';'));
    });

    // Create a CSV string by joining the rows
    const csvString = csvRows.join('\r\n');

    // Create a Blob from the CSV string and save it as a file
    const blob = new Blob([csvString], {type: 'text/csv;charset=utf-8,'});
    saveAs(blob, 'signals.csv');
  }

  private _removeNoneNumberFromString(element: string): number {
    return parseInt(element.replace(/^\D+/g, ''));
  }
}
