import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../app.service';
import { MatStepper } from '@angular/material';
import Recorder from 'recorder-js';

@Component({
  selector: 'app-verification-enroll',
  templateUrl: './verification-enroll.component.html',
  styleUrls: ['./verification-enroll.component.css']
})
export class VerificationEnrollComponent implements OnInit {
  phrase = null;
  mobile = null;
  selectedPhrase = '';
  startRecording = true;
  stopRecording = false;
  isMannuallyStopCalled = false;
  isEnrolled = false;
  verificationProfile = {
    profileId : null,
    remainingEnrollments : 3,
  };
  sampleStatus = [
    {
      error : false,
      loading: false,
    },
    {
      error : false,
      loading: false,
    },
    {
      error : false,
      loading: false,
    },
  ];

  @ViewChild('stepper')
  stepper: MatStepper;

  @ViewChild('recording')
  recording: ElementRef;

  constructor(private route: ActivatedRoute, private appService: AppService) { }

  ngOnInit() {
    this.mobile = this.route.snapshot.paramMap.get('mobile');
  }

  startEnrollment() {
   this.appService.getPhrases().subscribe(
      data => {
        this.phrase = data;
      },
      err => console.log(err),
      () => console.log('done loading pharse')
    );
  }

  start() {
    if (this.recording.nativeElement.innerText.indexOf('Start') !== -1) {// start action
      if (this.verificationProfile.remainingEnrollments === 0) {
        return;
      }
      this.appService.recorder.start();
      this.startRecording = false;
      this.stopRecording = true;
    } else {
      this.isMannuallyStopCalled = true;
      this.stopListening(); // mannually stopped
    }
  }

  stopListening() {
    this.startRecording = false;
    this.stopRecording = true;
    this.appService.recorder.stop().then(({blob, buffer}) => {
      if (this.verificationProfile.profileId) {
        this.enrollProfileAudioForVerification(blob);
      } else {
        this.createVerificationProfile(blob);
      }
    });
  }

  createVerificationProfile(blob) {
   this.appService.createProfileId().subscribe(
      (data: any) => {
        this.verificationProfile.profileId = data.verificationProfileId;
        this.enrollProfileAudioForVerification(blob);
      },
      err => console.error(err),
      () => console.log('done creating profile')
    );
  }

  enrollProfileAudioForVerification(blob) {
    const sampleRecondNumber = 3 - this.verificationProfile.remainingEnrollments;
    const statusObj = this.sampleStatus[sampleRecondNumber];
    statusObj.loading = true;
    statusObj.error = false;
    this.appService.enrollAudioForverification(this.verificationProfile.profileId, blob).subscribe(
      (data: any) => {
        this.verificationProfile.remainingEnrollments = data.remainingEnrollments;
        if (this.verificationProfile.remainingEnrollments === 0) {
          this.isEnrolled = true;
          this.storeRegisteredUser();
          return;
        }

        this.stepper.selectedIndex = 3 - this.verificationProfile.remainingEnrollments; // success
     },
      err => { statusObj.error = true; statusObj.loading = false; this.startRecording = true; this.stopRecording = false; },
      () => { statusObj.error = false; statusObj.loading = false; this.startRecording = true; this.stopRecording = false; },
    );
  }

  storeRegisteredUser() {
    const storageItem = window.localStorage.getItem('registeredUsers');
    const registeredUsers = JSON.parse(storageItem) || [];
    console.log(registeredUsers);
    registeredUsers.push({ mobile: this.mobile, profileId: this.verificationProfile.profileId });
    window.localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
  }

  showAudio(blob) {
    const url = URL.createObjectURL(blob);
    const log = document.getElementById('log');

    let audio = document.querySelector('#replay');
    if (audio != null) { audio.parentNode.removeChild(audio); }

    audio = document.createElement('audio');
    audio.setAttribute('id', 'replay');
    audio.setAttribute('controls', 'controls');

    const source = document.createElement('source');
    source.src = url;

    audio.appendChild(source);
    log.parentNode.insertBefore(audio, log);
  }

}
