import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TtsService {
  private readonly TTS_ENDPOINT = 'http://localhost:8080/ask-audio';

  constructor(private http: HttpClient) {}

  speak(text: string): Observable<ArrayBuffer> {
    if (!text || text.trim() === '') {
      return throwError(() => new Error('No text provided for speech synthesis'));
    }

    const selectedTechnology = localStorage.getItem('selectedTechnology') || 'java';
    const payload = {
      message: text.trim(),
      voice: "en-US-Neural2-J",
      technology: selectedTechnology
    };

    console.log('Sending TTS request with payload:', payload);

    return this.http.post(this.TTS_ENDPOINT, payload, {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      catchError(error => {
        console.error('TTS Service Error:', error);
        if (error.status === 400) {
          return throwError(() => new Error('Invalid request format. Please check the payload.'));
        }
        return throwError(() => new Error('Failed to process text-to-speech request.'));
      })
    );
  }
} 