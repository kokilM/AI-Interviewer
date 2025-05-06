import { Injectable, EventEmitter } from '@angular/core';

declare var webkitSpeechRecognition: any;

interface Transcription {
  interim: string;
  final: string;
  current: string;
}

@Injectable({
  providedIn: 'root',
})
export class VoiceRecognitionService {
  recognition = new webkitSpeechRecognition();
  isStoppedSpeechRecog = true;
  public text = '';
  tempWords = '';
  
  public onTranscriptUpdate = new EventEmitter<Transcription>();

  constructor() {
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
          this.text += ' ' + transcript;
          this.text = this.text.trim();
        } else {
          interimTranscript += transcript;
        }
      }

      this.onTranscriptUpdate.emit({
        interim: interimTranscript,
        final: this.text,
        current: interimTranscript || finalTranscript
      });
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };
  }

  start() {
    this.text = '';
    this.isStoppedSpeechRecog = false;
    this.recognition.start();
    console.log("Speech recognition started");

    this.recognition.addEventListener('end', () => {
      if (!this.isStoppedSpeechRecog) {
        this.recognition.start();
      }
    });
  }

  stop() {
    this.isStoppedSpeechRecog = true;
    this.recognition.stop();
    console.log("End speech recognition");
  }
}
