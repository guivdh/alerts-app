import {Injectable} from '@angular/core';
import {Signal} from "../models/signal.model";
import {Alert} from "../models/alert.model";
import {BehaviorSubject, Observable} from "rxjs";
import * as alertsDatas from '../datas/alerts.json';
import {NotificationService} from "./notification.service";

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  alerts: Alert[];

  private _alerts$: BehaviorSubject<Alert[]> = new BehaviorSubject<Alert[]>(Array.from(alertsDatas));
  public alerts$: Observable<Alert[]> = this._alerts$.asObservable();

  constructor(
    private notificationService: NotificationService
  ) {
  }

  createAlert(signal: Signal, values: any): Alert | null {
    if (signal && values.min !== null && values.max !== null) {
      const alert = {
        id: this._alerts$.value.length + 1,
        signal,
        lowerThreshold: values.min,
        upperThreshold: values.max
      };
      this._alerts$.next([...this._alerts$.value, alert]);
      this.notificationService.createNotification('Alertes créée', 'alerts')
      return alert;
    }
    return null;
  }

  updateAlert(alert: Alert, values: any): boolean {
    let alerts = this._alerts$.value;
    let currentAlert = alerts.find(x => x.id === alert.id);
    if (currentAlert) {
      currentAlert.lowerThreshold = values.min;
      currentAlert.upperThreshold = values.max;
      this._alerts$.next(alerts);
      return true;
    }
    return false;
  }

  delete(id: number): boolean {
    let alerts = this._alerts$.value;
    const alert = alerts.find(x => x.id === id);
    if (alert) {
      const index = alerts.indexOf(alert)
      if (index > -1) {
        alerts.splice(index, 1);
        this._alerts$.next(alerts);
        this.alerts = alerts;
        return true;
      }
    }
    return false;
  }
}
