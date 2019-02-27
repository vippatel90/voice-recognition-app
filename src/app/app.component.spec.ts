import { TestBed, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';


describe('AppComponent', () => {
  let fixture;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
      ],
      schemas: [
         NO_ERRORS_SCHEMA, // supress all undeneath errors including custom tags created by angular and
         // attributes errors like (ngModel) and all
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
   
  }));
  it('should create the app', async(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  
});
