import {Injectable} from '@angular/core';
import {Notif} from "../models/notification.model";
import {BehaviorSubject, Observable} from "rxjs";
import * as notificationsDatas from "../datas/notifications.json";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private _notifications$: BehaviorSubject<Notif[]> = new BehaviorSubject<Notif[]>(Array.from(notificationsDatas));
  public notifications$: Observable<Notif[]> = this._notifications$.asObservable();


  constructor() {
  }

  createNotification(content: string, url: string) {
    let notif: Notif = {
      id: Date.now(),
      content,
      url,
      date: (new Date()).toString(),
      isRead: false
    }

    this._notifications$.next([...this._notifications$.value, notif])
  }

  delete(id: number) {
    const updatedNotifications = this._notifications$.value.filter((notif: Notif) => notif.id !== id);
    this._notifications$.next(updatedNotifications);
  }

  markAllAsRead() {
    const notifsRead = this._notifications$.value;
    notifsRead.forEach(x => x.isRead = true);
    this._notifications$.next(notifsRead);
  }
}
