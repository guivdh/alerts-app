import {Injectable} from '@angular/core';
import * as signalsDatas from '../datas/signals.json';
import {Signal} from "../models/signal.model";

@Injectable({
  providedIn: 'root'
})
export class SignalService {

  signals: Signal[] = signalsDatas;

  constructor() {
  }

  getSignals(): Signal[] {
    return Array.from(this.signals);
  }
}
