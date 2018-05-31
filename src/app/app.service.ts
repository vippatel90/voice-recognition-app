import { Injectable } from '@angular/core';
import Recorder from 'recorder-js';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// get subscription key of microsoft azure for speaker rekogntion
const subscriptionKey = 'cb3cb87d35e0420c974bfe3aa0189e15';

const httpOptionsJsonType = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key' : subscriptionKey }),
};
const httpOptionsMultipartType = {
  headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data', 'Ocp-Apim-Subscription-Key' : subscriptionKey }),
};
const httpOctetStreamType = {
  headers: new HttpHeaders({ 'Content-Type': 'application/octet-stream', 'Ocp-Apim-Subscription-Key' : subscriptionKey }),
};

@Injectable()
export class AppService {
  recorder: any;
  constructor(private http: HttpClient) {
  }

  initialiseMedia() {
    const promise = new Promise((resolve, reject) => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(
          stream => {
            this.initialiseRecorder(stream);
            resolve(stream);
          }  ,
          err => reject({mediaError : true })
        );
      } else {
        reject({mediaError : true });
      }
    });

    return promise;
  }

  initialiseRecorder(stream: any) {
    const audioContext =  new (AudioContext || (window as any).webkitAudioContext)();
    this.recorder = new Recorder(audioContext, { numChannels: 1, requiredSammpleRate: 16000 });
    this.recorder.init(stream);
  }

  getPhrases() {
    const url = 'https://westus.api.cognitive.microsoft.com/spid/v1.0/verificationPhrases?locale=en-US';
    return this.http.get(url , httpOptionsJsonType);
  }

  createProfileId() {
    const url = 'https://westus.api.cognitive.microsoft.com/spid/v1.0/verificationProfiles';
    return this.http.post(url , JSON.stringify({ 'locale' : 'en-us' }), httpOptionsJsonType);
  }

  enrollAudioForverification(profileId: any, blob: any) {
    const url = 'https://westus.api.cognitive.microsoft.com/spid/v1.0/verificationProfiles/' + profileId + '/enroll';
    return this.http.post(url, blob, httpOptionsMultipartType);
  }

  verifyAudio(profileId: any, blob: any) {
    const url = 'https://westus.api.cognitive.microsoft.com/spid/v1.0/verify?verificationProfileId=' + profileId;
    return this.http.post(url, blob, httpOctetStreamType);
  }

}


