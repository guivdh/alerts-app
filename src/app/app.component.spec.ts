import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatIconModule} from "@angular/material/icon";
import {RouterModule} from "@angular/router";
import {NotificationService} from "./services/notification.service";
import {Notif} from "./models/notification.model";

describe('AppComponent', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let notificationService: NotificationService;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, MatIconModule, RouterModule.forRoot([])],
      declarations: [
        AppComponent
      ],
      providers: [
        {provide: MatDialogRef, useValue: {}}
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    notificationService = TestBed.inject(NotificationService);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should mark all notifications as read', () => {
    spyOn(notificationService, 'markAllAsRead');

    component.markAllNotifAsRead();

    expect(notificationService.markAllAsRead).toHaveBeenCalled();
  });

  it('should return the number of unread notifications', () => {
    const notification: Notif = {
      id: 2,
      content: 'Notification 2',
      date: '2023-06-05T15:45:00.000Z',
      url: 'alerts',
      isRead: true
    };

    component.notifications = [notification];

    const unreadCount = component.getNotificationsUnRead();

    expect(unreadCount).toBe(0);
  });

  it('should return the number of unread notifications', () => {
    const notifications: Notif[] = [
      {
        id: 1,
        content: 'Notification 2',
        date: '2023-06-05T15:45:00.000Z',
        url: 'alerts',
        isRead: false
      }, {
        id: 2,
        content: 'Notification 2',
        date: '2023-06-05T15:45:00.000Z',
        url: 'alerts',
        isRead: false
      },
    ];

    component.notifications = notifications;

    const unreadCount = component.getNotificationsUnRead();

    expect(unreadCount).toBe(2);
  });

  it('should toggle displayNotifBox and update style', () => {
    const el = document.createElement('div');
    el.id = 'notification-box';
    spyOn(document, 'getElementById').and.returnValue(el);

    // Initial state
    expect(component.displayNotifBox).toBeFalse();
    expect(el.style.display).toBe('');

    // First click
    component.displayNotifs();
    expect(component.displayNotifBox).toBeTrue();
    expect(el.style.display).toBe('flex');

    // Second click
    component.displayNotifs();
    expect(component.displayNotifBox).toBeFalse();
    expect(el.style.display).toBe('none');
  });
});
