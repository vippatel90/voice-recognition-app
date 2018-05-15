import { AppService } from '../app.service';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verification-auth',
  templateUrl: './verification-auth.component.html',
  styleUrls: ['./verification-auth.component.css']
})
export class VerificationAuthComponent implements OnInit {
  verificationStatus = {
    done: false,
    error: false,
    loading: false,
  };
  mobile: string;
  profile: any;
  stopRecording = false;

  @ViewChild('verify')
  verify: ElementRef;

  constructor(private route: ActivatedRoute, private appService: AppService) { }

  ngOnInit() {
    this.mobile = this.route.snapshot.paramMap.get('mobile');
    const registeredUsers = JSON.parse(window.localStorage.getItem('registeredUsers')) || [];
    this.profile = registeredUsers.find( (element: any) => {
      return element.mobile === this.mobile;
    });
    console.log(this.profile);
  }

  verifyProfile() {
    if (this.verify.nativeElement.innerText.indexOf('Start') !== -1) {
        this.appService.recorder.start();
        this.stopRecording = true;
    } else {
        this.verifyAudio();
    }
  }

  verifyAudio() {
    this.stopRecording = false;
    this.verificationStatus.loading = true;
    this.verificationStatus.error = false;
    this.appService.recorder.stop().then(({blob, buffer}) => {
      this.appService.verifyAudio(this.profile.profileId, blob).subscribe(
      (data: any) => {
        if (data && data.result === 'Accept') {
          this.verificationStatus.done = true;
          this.verificationStatus.loading = false;
        } else {
            this.verificationStatus.done = false;
            this.verificationStatus.error = true;
        }
     },
      err => { this.verificationStatus.error = true; this.verificationStatus.loading = false; this.stopRecording = false; },
      () => { this.verificationStatus.loading = false; this.stopRecording = false; },
    );

    });
  }
}
