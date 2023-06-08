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
    this.notificationService.notifications$.subscribe(res => {
      this.notifications = res;
    })
  }

  openCreateAlertDialog() {
    this.dialog.open(CreateAlertDialogComponent);
  }

  displayNotifs() {
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
    if (id) {
      this.notificationService.delete(id);
    }
  }

  markAllNotifAsRead() {
    this.notificationService.markAllAsRead();
  }

  getNotificationsUnRead(): number {
    return this.notifications?.filter(x => !x.isRead).length;
  }
}
