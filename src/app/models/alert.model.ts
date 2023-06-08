import {Signal} from "./signal.model";

export interface Alert {
  id: number;
  signal: Signal;
  lowerThreshold: number;
  upperThreshold: number;
}
