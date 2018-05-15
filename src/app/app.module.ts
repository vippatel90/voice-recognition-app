import { BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  MatCardModule,
  MatSelectModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatStepperModule,
} from '@angular/material';
import {AppService} from './app.service';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { LauncherComponent } from './launcher/launcher.component';
import { VerificationEnrollComponent } from './verification-enroll/verification-enroll.component';
import { AppRoutingModule } from './/app-routing.module';
import { VerificationAuthComponent } from './verification-auth/verification-auth.component';

@NgModule({
  exports: [
    MatCardModule,
    MatSelectModule,
    MatStepperModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class MaterialModule {}

@NgModule({
  declarations: [
    AppComponent,
    LauncherComponent,
    VerificationEnrollComponent,
    VerificationAuthComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    NgbModule.forRoot(),
  ],
  providers: [
    { provide: 'Window',  useValue: window },
    AppService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
