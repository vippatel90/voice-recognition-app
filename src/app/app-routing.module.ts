import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LauncherComponent} from './launcher/launcher.component';
import {VerificationEnrollComponent} from './verification-enroll/verification-enroll.component';
import { VerificationAuthComponent } from './verification-auth/verification-auth.component';

// exported to test the routes with RouterTestingModule
export const routes: Routes = [
  { path: '', component: LauncherComponent },
  { path: 'launcher', component: LauncherComponent },
  { path: 'verify-enrollment/:mobile', component: VerificationEnrollComponent },
  { path: 'verify-auth/:mobile', component: VerificationAuthComponent },
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ],
})
export class AppRoutingModule {}
