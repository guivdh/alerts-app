import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {CreateAlertDialogComponent} from "./components/create-alert-dialog/create-alert-dialog.component";
import {NotificationService} from "./services/notification.service";
import {Notif} from "./models/notification.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'alerts';
  displayNotifBox = false;
  notifications: Notif[] = [];

  constructor(
    public dialog: MatDialog,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit() {
    // Subscribe to the notifications observable to get the latest notifications
    this.notificationService.notifications$.subscribe(res => {
      this.notifications = res;
    });
  }

  openCreateAlertDialog() {
    // Open the create alert dialog
    this.dialog.open(CreateAlertDialogComponent);
  }

  displayNotifs() {
    // Toggle the display of the notification box
    let el = document.getElementById('notification-box');
    if (el) {
      if (!this.displayNotifBox) {
        el.style.display = 'flex';
        this.displayNotifBox = true;
      } else {
        el.style.display = 'none';
        this.displayNotifBox = false;
      }
    }
  }

  deleteNotif(id: number) {
    // Delete a notification by its ID
    if (id) {
      this.notificationService.delete(id);
    }
  }

  markAllNotifAsRead() {
    // Mark all notifications as read
    this.notificationService.markAllAsRead();
  }

  getNotificationsUnRead(): number {
    // Get the count of unread notifications
    return this.notifications?.filter(x => !x.isRead).length;
  }

  markAsRead(notif: Notif) {
    // Mark a notification as read
    this.notificationService.markAsRead(notif);
  }
}
