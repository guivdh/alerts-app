import { Injectable } from '@angular/core';
import * as signalsDatas from '../datas/signals.json';
import { Signal } from "../models/signal.model";

@Injectable({
  providedIn: 'root'
})
export class SignalService {

  signals: Signal[] = signalsDatas; // List of signals loaded from signals.json

  constructor() {
  }

  /**
   * Returns the list of signals.
   * @returns An array of Signal objects.
   */
  getSignals(): Signal[] {
    return Array.from(this.signals);
  }
}
