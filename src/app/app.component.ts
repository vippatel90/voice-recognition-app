import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatStepper } from '@angular/material';
import Recorder from 'recorder-js';

const audioContext =  new (window.AudioContext || window.webkitAudioContext)();
const recorder = new Recorder(audioContext, { numChannels: 1 });
const httpOptionsJsonType = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key' : '5016377b7e2b4ae18dc0d230b1d56869' }),
};
const httpOptionsMultipartType = {
  headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data', 'Ocp-Apim-Subscription-Key' : '5016377b7e2b4ae18dc0d230b1d56869' }),
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  phrase = null;
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

  @ViewChild('audio')
  audio: ElementRef;

  @ViewChild('stepper')
  stepper: MatStepper;

  @ViewChild('recording')
  recording: ElementRef;

  @ViewChild('verify')
  verify: ElementRef;

  constructor(private http: HttpClient) { }

  startEnrollment() {
    this.http.get('https://westus.api.cognitive.microsoft.com/spid/v1.0/verificationPhrases?locale=en-US', httpOptionsJsonType).subscribe(
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
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
          recorder.init(stream);
          recorder.start();
          this.startRecording = false;
          this.stopRecording = true;
         // setTimeout(() => { this.stopListening() }, 10*1000);
        });
      }
    } else {
      this.isMannuallyStopCalled = true;
      this.stopListening(); // mannually stopped
    }
  }

  stopListening() {
    this.startRecording = false;
    this.stopRecording = true;
    recorder.stop().then(({blob, buffer}) => {
      if (this.verificationProfile.profileId) {
        this.enrollProfileAudioForVerification(blob);
      } else {
        this.createVerificationProfile(blob);
      }
    });
  }

  createVerificationProfile(blob) {
    this.http.post('https://westus.api.cognitive.microsoft.com/spid/v1.0/verificationProfiles', JSON.stringify({ 'locale' : 'en-us' }), httpOptionsJsonType).subscribe(
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
    this.http.post('https://westus.api.cognitive.microsoft.com/spid/v1.0/verificationProfiles/' + this.verificationProfile.profileId + '/enroll', blob, httpOptionsMultipartType).subscribe(
      (data: any) => {
        this.verificationProfile.remainingEnrollments = data.remainingEnrollments;
        if (this.verificationProfile.remainingEnrollments === 0) {
          this.isEnrolled = true;
          return;
        }

        this.stepper.selectedIndex = 3 - this.verificationProfile.remainingEnrollments; // success
     },
      err => { statusObj.error = true; statusObj.loading = false; this.startRecording = true; this.stopRecording = false; },
      () => { statusObj.error = false; statusObj.loading = false; this.startRecording = true; this.stopRecording = false; },
    );
  }

  verifyProfile() {
    if (this.verify.nativeElement.innerText.indexOf('Verify') !== -1) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
          recorder.init(stream);
          recorder.start();
          this.stopRecording = true;
         // setTimeout(() => { this.stopListening() }, 10*1000);
        });
      }

    } else {
        this.verifyAudioProfile();
    }
  }

  verifyAudioProfile() {
    console.log('verify..............auido');
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
