import { Injectable } from '@angular/core';
import { Notif } from "../models/notification.model";
import { BehaviorSubject, Observable } from "rxjs";
import * as notificationsDatas from "../datas/notifications.json";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private _notifications$: BehaviorSubject<Notif[]> = new BehaviorSubject<Notif[]>(Array.from(notificationsDatas));
  public notifications$: Observable<Notif[]> = this._notifications$.asObservable();

  constructor() {
  }

  /**
   * Creates a new notification with the specified content and URL.
   * @param content The content of the notification.
   * @param url The URL associated with the notification.
   */
  createNotification(content: string, url: string) {
    let notif: Notif = {
      id: Date.now(),
      content,
      url,
      date: (new Date()).toString(),
      isRead: false
    };

    this._notifications$.next([...this._notifications$.value, notif]);
  }

  /**
   * Deletes a notification with the specified ID.
   * @param id The ID of the notification to delete.
   */
  delete(id: number) {
    const updatedNotifications = this._notifications$.value.filter((notif: Notif) => notif.id !== id);
    this._notifications$.next(updatedNotifications);
  }

  /**
   * Marks all notifications as read.
   */
  markAllAsRead() {
    const notifsRead = this._notifications$.value;
    notifsRead.forEach(x => x.isRead = true);
    this._notifications$.next(notifsRead);
  }

  /**
   * Marks a specific notification as read.
   * @param notif The notification to mark as read.
   */
  markAsRead(notif: Notif) {
    const notifs = this._notifications$.value;
    notifs.filter(x => x.id === notif.id)?.forEach(y => y.isRead = true);
    this._notifications$.next(notifs);
  }
}
