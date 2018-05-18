import { Component, OnInit, Inject } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-launcher',
  templateUrl: './launcher.component.html',
  styleUrls: ['./launcher.component.css']
})
export class LauncherComponent implements OnInit {
  isMediaError = false;
  mobile = '04261112';
  isRegistered: boolean;
  constructor(@Inject('Window') window: Window, private appService: AppService ) {  }

  ngOnInit() {
    this.appService.initialiseMedia().then(() => {
      this.continue();
    }).catch(() => {
      this.isMediaError = true;
    });
  }

  continue() {
    const randomNumber = Math.floor(Math.random() * 100);
    this.mobile = this.mobile + randomNumber;
    this.isUserRegistered();
  }


  isUserRegistered() {
    const storageItem = window.localStorage.getItem('registeredUsers');
    const registeredUsers = JSON.parse(storageItem) || [];
    const profile = registeredUsers.find((element: any) => {
      return element.mobile === this.mobile;
    });
    if (profile) {
      this.isRegistered = true;
    } else {
      this.isRegistered = false;
    }

  }

}
