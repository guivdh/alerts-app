import {TestBed} from '@angular/core/testing';
import {AlertService} from "./alert.service";
import {Signal} from "../models/signal.model";
import {Alert} from "../models/alert.model";
import {NotificationService} from "./notification.service";


describe('AlertService', () => {
  let service: AlertService;
  let notificationService: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a new alert', () => {
    const notificationServiceMock: NotificationService = jasmine.createSpyObj('NotificationService', ['createNotification']);
    const alertService = new AlertService(notificationServiceMock);
    const signal: Signal = {
      signalName: "SignalElement12",
      description: "Description Element12",
      component: "Component1",
      system: "System2",
      subSystem: "SubSystem5",
      element: "Element12"
    };
    const values = {min: 10, max: 20};

    const newAlert = alertService.createAlert(signal, values);

    expect(newAlert).toBeDefined();
    if (newAlert) {
      expect(newAlert.id).toBe(alertService['_alerts$'].value.length); // Vérifie si l'ID de l'alerte correspond à la longueur actuelle du tableau d'alertes
      expect(newAlert.signal).toBe(signal); // Vérifie si le signal de l'alerte est correct
      expect(newAlert.lowerThreshold).toBe(values.min); // Vérifie si la limite inférieure de l'alerte est correcte
      expect(newAlert.upperThreshold).toBe(values.max); // Vérifie si la limite supérieure de l'alerte est correcte
      expect(notificationServiceMock.createNotification).toHaveBeenCalledWith('Alert created successfully !', 'alerts');
    }
  });

  it('should not create an alert if signal or threshold values are missing', () => {
    const notificationServiceMock: NotificationService = jasmine.createSpyObj('NotificationService', ['createNotification']);
    const alertService = new AlertService(notificationServiceMock);
    const signal: Signal = {
      signalName: "SignalElement12",
      description: "Description Element12",
      component: "Component1",
      system: "System2",
      subSystem: "SubSystem5",
      element: "Element12"
    };
    const values = {min: null, max: 20};

    const newAlert = alertService.createAlert(signal, values);

    expect(newAlert).toBeNull();
  });

  it('should update an existing alert', () => {
    const notificationServiceMock: NotificationService = jasmine.createSpyObj('NotificationService', ['createNotification']);
    const alertService = new AlertService(notificationServiceMock);
    const alerts: Alert[] = [
      {

        id: 1,
        signal: {
          signalName: "SignalElement55",
          description: "Description Element55",
          component: "Component4",
          system: "System10",
          subSystem: "SubSystem22",
          element: "Element55"
        },
        lowerThreshold: 1,
        upperThreshold: 2
      }, {

        id: 2,
        signal: {
          signalName: "SignalElement18",
          description: "Description Element18",
          component: "Component1",
          system: "System3",
          subSystem: "SubSystem8",
          element: "Element18"
        },
        lowerThreshold: 10,
        upperThreshold: 45
      }, {

        id: 3,
        signal: {
          signalName: "SignalElement53",
          description: "Description Element53",
          component: "Component4",
          system: "System9",
          subSystem: "SubSystem21",
          element: "Element53"
        },
        lowerThreshold: 7,
        upperThreshold: 20
      }
    ];
    alertService.alerts = alerts;
    alertService['_alerts$'].next(alerts);
    const alertToUpdate = alerts[2];
    const values = {min: 5, max: 15};

    const isUpdated = alertService.updateAlert(alertToUpdate, values);

    expect(isUpdated).toBeTrue();
    const updatedAlert = alertService.alerts.find(alert => alert.id === alertToUpdate.id);
    expect(updatedAlert).toBeDefined();
    expect(updatedAlert?.lowerThreshold).toBe(values.min);
    expect(updatedAlert?.upperThreshold).toBe(values.max);
  });


  it('should return false if the alert does not exist', () => {
    const notificationServiceMock: NotificationService = jasmine.createSpyObj('NotificationService', ['createNotification']);
    const alertService = new AlertService(notificationServiceMock);
    const alerts: Alert[] = [
      {

        id: 1,
        signal: {
          signalName: "SignalElement55",
          description: "Description Element55",
          component: "Component4",
          system: "System10",
          subSystem: "SubSystem22",
          element: "Element55"
        },
        lowerThreshold: 1,
        upperThreshold: 2
      }, {

        id: 2,
        signal: {
          signalName: "SignalElement18",
          description: "Description Element18",
          component: "Component1",
          system: "System3",
          subSystem: "SubSystem8",
          element: "Element18"
        },
        lowerThreshold: 10,
        upperThreshold: 45
      }, {

        id: 3,
        signal: {
          signalName: "SignalElement53",
          description: "Description Element53",
          component: "Component4",
          system: "System9",
          subSystem: "SubSystem21",
          element: "Element53"
        },
        lowerThreshold: 7,
        upperThreshold: 20
      }
    ];
    alertService['_alerts$'].next(alerts);
    const nonExistingAlert: Alert = {
      id: 999,
      signal: {
        signalName: "SignalElement12",
        description: "Description Element12",
        component: "Component1",
        system: "System2",
        subSystem: "SubSystem5",
        element: "Element12"
      },
      lowerThreshold: 0,
      upperThreshold: 10
    };
    const values = {min: 5, max: 15};

    const isUpdated = alertService.updateAlert(nonExistingAlert, values);

    expect(isUpdated).toBeFalse();
  });

  it('should delete an existing alert', () => {
    const notificationServiceMock: NotificationService = jasmine.createSpyObj('NotificationService', ['createNotification']);
    const alertService = new AlertService(notificationServiceMock);
    const alerts: Alert[] = [
      {

        id: 1,
        signal: {
          signalName: "SignalElement55",
          description: "Description Element55",
          component: "Component4",
          system: "System10",
          subSystem: "SubSystem22",
          element: "Element55"
        },
        lowerThreshold: 1,
        upperThreshold: 2
      }, {

        id: 2,
        signal: {
          signalName: "SignalElement18",
          description: "Description Element18",
          component: "Component1",
          system: "System3",
          subSystem: "SubSystem8",
          element: "Element18"
        },
        lowerThreshold: 10,
        upperThreshold: 45
      }, {

        id: 3,
        signal: {
          signalName: "SignalElement53",
          description: "Description Element53",
          component: "Component4",
          system: "System9",
          subSystem: "SubSystem21",
          element: "Element53"
        },
        lowerThreshold: 7,
        upperThreshold: 20
      }
    ];
    alertService.alerts = alerts; // Initialise la propriété alerts avec les alertes existantes
    const idToDelete = 1; // ID de l'alerte à supprimer

    const isDeleted = alertService.delete(idToDelete);

    expect(isDeleted).toBeTrue();

    // Vérifier si l'alerte a été supprimée correctement
    const deletedAlert = alertService.alerts.find(alert => alert.id === idToDelete);
    expect(deletedAlert).toBeUndefined();
  });

  it('should return false when deleting a non-existing alert', () => {
    const notificationServiceMock: NotificationService = jasmine.createSpyObj('NotificationService', ['createNotification']);
    const alertService = new AlertService(notificationServiceMock);
    const alerts: Alert[] = [
      {

        id: 1,
        signal: {
          signalName: "SignalElement55",
          description: "Description Element55",
          component: "Component4",
          system: "System10",
          subSystem: "SubSystem22",
          element: "Element55"
        },
        lowerThreshold: 1,
        upperThreshold: 2
      }, {

        id: 2,
        signal: {
          signalName: "SignalElement18",
          description: "Description Element18",
          component: "Component1",
          system: "System3",
          subSystem: "SubSystem8",
          element: "Element18"
        },
        lowerThreshold: 10,
        upperThreshold: 45
      }, {

        id: 3,
        signal: {
          signalName: "SignalElement53",
          description: "Description Element53",
          component: "Component4",
          system: "System9",
          subSystem: "SubSystem21",
          element: "Element53"
        },
        lowerThreshold: 7,
        upperThreshold: 20
      }
    ];
    alertService.alerts = alerts; // Initialise la propriété alerts avec les alertes existantes
    const idToDelete = 999; // ID d'une alerte qui n'existe pas

    const isDeleted = alertService.delete(idToDelete);

    expect(isDeleted).toBeFalse();
  });

});
