import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {SignalService} from "../../services/signal.service";
import {Signal} from "../../models/signal.model";
import {FormBuilder} from "@angular/forms";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import { saveAs } from 'file-saver';
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-signals',
  templateUrl: './signals.component.html',
  styleUrls: ['./signals.component.scss']
})
export class SignalsComponent implements OnInit {

  @ViewChild(MatTable) table: MatTable<any>

  signals: Signal[] = [];
  filteredSignals: Signal[] = [];
  dataSource: MatTableDataSource<Signal>;

  components: string[] = [];
  system: string[] = [];
  subSystem: string[] = [];
  element: string[] = [];

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
    this.signals = this.signalService.getSignals();
    this.filteredSignals = this.signals;
    this.dataSource = new MatTableDataSource<Signal>(this.signals);

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

  applyFilter() {
    this.filteredSignals = this.signals;
    if (this.signalsFilterGroup.value.component) {
      this.filteredSignals = this.signals.filter(x => x.component === this.signalsFilterGroup.value.component);
    }
    if (this.signalsFilterGroup.value.system) {
      this.filteredSignals = this.signals.filter(x => x.system === this.signalsFilterGroup.value.system);
    }
    if (this.signalsFilterGroup.value.subSystem) {
      this.filteredSignals = this.signals.filter(x => x.subSystem === this.signalsFilterGroup.value.subSystem);
    }
    if (this.signalsFilterGroup.value.element) {
      this.filteredSignals = this.signals.filter(x => x.element === this.signalsFilterGroup.value.element);
    }

    this.dataSource.data = this.filteredSignals;
    if (this.table) {
      this.table.renderRows();
    }
  }

  resetFilter() {
    this.signalsFilterGroup.reset();
    this.dataSource.data = this.signals;
    this.filteredSignals = this.signals;
  }

  downloadFile() {
    const header = Object.keys(this.filteredSignals[0]);
    const csvRows = [];

    // Ajouter l'en-tête
    csvRows.push(header.join(';'));

    // Ajouter chaque ligne
    this.filteredSignals.forEach((row: any) => {
      const values = header.map((fieldName: any) => row[fieldName]);
      csvRows.push(values.join(';'));
    });

    const csvString = csvRows.join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8,' });
    saveAs(blob, 'signals.csv');
  }

  private _removeNoneNumberFromString(element: string): number {
    return parseInt(element.replace(/^\D+/g, ''));
  }
}
