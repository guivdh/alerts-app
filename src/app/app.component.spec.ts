import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatIconModule} from "@angular/material/icon";
import {RouterModule} from "@angular/router";

describe('AppComponent', () => {
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

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
