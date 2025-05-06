import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, Subject, BehaviorSubject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { map, catchError, retry, share } from 'rxjs/operators';

export interface WebSocketMessage {
  type: string;
  data: any;
  error?: string;
}

export interface InterviewQuestion {
  id?: number;
  question: string;
  answer?: string;
}

export interface InterviewResponse {
  question: string;
  answer: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private readonly API_URL = 'http://localhost:8080';
  private responseSubject = new BehaviorSubject<string>('');
  private wsSubject: WebSocketSubject<WebSocketMessage> | null = null;

  constructor(private httpClient: HttpClient) {
    this.initWebSocket();
  }

  private initWebSocket() {
    this.wsSubject = webSocket<WebSocketMessage>({
      url: 'ws://localhost:8080/ws',
      deserializer: (e: MessageEvent) => JSON.parse(e.data),
      serializer: (msg: WebSocketMessage) => JSON.stringify(msg)
    });

    this.wsSubject.subscribe({
      next: msg => this.handleWebSocketMessage(msg),
      error: err => console.error('WebSocket error:', err),
      complete: () => console.log('WebSocket connection closed')
    });
  }

  private handleWebSocketMessage(msg: WebSocketMessage) {
    if (msg.type === 'aiResponse' && msg.data) {
      this.responseSubject.next(msg.data.toString());
    } else if (msg.error) {
      console.error('WebSocket error message:', msg.error);
    }
  }

  getResponseStream(): Observable<string> {
    return this.responseSubject.asObservable();
  }

  askQuestion(question: string): Observable<any> {
    if (question===null ||question===undefined){
      return question;
    }
    const selectedTechnology = localStorage.getItem('selectedTechnology') || 'java';
    return this.httpClient.get<any>(`${this.API_URL}/ask`, { 
      params: { 
        question,
        technology: selectedTechnology 
      } 
    });
  }

  submitAnswer(answer: string): Observable<any> {
    return of({ success: true });
  }

  evaluateAnswers(history: { question: string; response: string }[]): Observable<any> {
    // For now, we'll simulate the evaluation with a random score
    // In a real application, this would call your backend API to evaluate the answers
    const score = Math.floor(Math.random() * 3) + 3; // Random score between 3-5
    return of({ 
      score,
      totalQuestions: 5,
      feedback: 'Your answers were evaluated successfully.'
    }).pipe(delay(1000));
  }

  askQuestionReactive(question: string): Observable<any> {
    if (!question) {
      return of(null);
    }
    const selectedTechnology = localStorage.getItem('selectedTechnology') || 'java';
    return this.httpClient.get<any>(`${this.API_URL}/ask-reactive`, { 
      params: { 
        question,
        technology: selectedTechnology 
      } 
    });
  }

  setTechnologyReactive(technology: string): Observable<any> {
    return this.httpClient.post<any>(`${this.API_URL}/set-technology-reactive`, { technology });
  }

  askAudioReactive(message: string, technology: string): Observable<Blob> {
    return this.httpClient.post(`${this.API_URL}/ask-audio-reactive`, 
      { message, technology },
      { responseType: 'blob' }
    );
  }
}
