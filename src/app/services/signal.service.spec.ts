import {TestBed} from '@angular/core/testing';
import {SignalService} from "./signal.service";


describe('SignalService', () => {
  let service: SignalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize the signals array', () => {
    expect(service.signals).toBeDefined();
    expect(service.signals.length).toBeGreaterThan(0);
  });
});
