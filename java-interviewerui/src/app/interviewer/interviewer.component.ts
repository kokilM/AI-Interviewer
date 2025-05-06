import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AiService } from '../services/ai.service';
import { VoiceRecognitionService } from '../services/voice-recognition.service';
import { TtsService } from '../services/tts.service';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
// import { CodeEditorComponent } from '../code-editor/code-editor.component';

@Component({
  selector: 'app-interviewer',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './interviewer.component.html',
  styleUrls: ['./interviewer.component.scss']
})
export class InterviewerComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  userQuestion = '';
  aiResponse = '';
  isLoading = false;
  error = '';
  interimTranscript = '';
  history: { question: string; response: string }[] = [];
  isRecording = false;
  audioUrl = '';
  base64Audio = '';
  mediaRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];
  private isSpeaking = false;
  private aiSpeechQueue: string[] = [];
  totalQuestions: number = 5;
  showCodeEditor: boolean = true; 
  selectedTechnology: string = '';
  terminalOutput: string = '';

  constructor(
    private http: HttpClient,
    private aiService: AiService,
    private router: Router,
    public voiceRecognitionService: VoiceRecognitionService,
    private ttsService: TtsService
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.selectedTechnology = localStorage.getItem('selectedTechnology') || 'java';
    this.startInterview();

    // Subscribe to real-time AI responses
    this.aiService.getResponseStream()
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.aiResponse = response;
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async startInterview() {
    this.isLoading = true;
    this.aiService.askQuestionReactive('')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.aiResponse = response?.message || '';
          this.isLoading = false;
          this.queueAiSpeech(this.aiResponse);
        },
        error: (error) => {
          console.error('Error starting interview:', error);
          this.error = 'Failed to start interview';
          this.isLoading = false;
        }
      });
  }

  async askQuestion() {
    if (!this.userQuestion.trim()) {
      this.error = 'Please enter your response.';
      return;
    }

    this.isLoading = true;
    const userResponse = this.userQuestion.trim();

    this.aiService.askQuestionReactive(userResponse)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.aiResponse = response?.message || '';
          this.history.unshift({ question: this.aiResponse, response: userResponse });
          this.userQuestion = '';
          this.voiceRecognitionService.text = '';
          this.isLoading = false;

          if (this.aiResponse.toLowerCase().includes('write a program') || 
              this.aiResponse.toLowerCase().includes('write code') ||
              this.aiResponse.toLowerCase().includes('implement') ||
              this.aiResponse.toLowerCase().includes('coding question')) {
            this.showCodeEditor = true;
          }

          if (this.aiResponse.trim()) {
            this.queueAiSpeech(this.aiResponse);
          } else {
            this.error = 'No response from AI.';
          }
        },
        error: (error) => {
          console.error('Error asking question:', error);
          this.error = 'Failed to get response';
          this.isLoading = false;
        }
      });
  }

  async submitInterview() {
    this.isLoading = true;
    try {
      const evaluation = await firstValueFrom(this.aiService.evaluateAnswers(this.history));
      localStorage.setItem('interviewData', JSON.stringify({
        score: evaluation.score,
        totalQuestions: evaluation.totalQuestions,
        feedback: evaluation.feedback,
        lastAiMessage: this.aiResponse
      }));
      this.router.navigate(['/thank-you']);
    } catch (error) {
      console.error('Error submitting interview:', error);
      this.error = 'Failed to submit interview.';
    } finally {
      this.isLoading = false;
    }
  }

  stopInterview() {
    if (confirm('Are you sure you want to stop the interview?')) {
      localStorage.setItem('interviewData', JSON.stringify({
        score: 0,
        totalQuestions: this.history.length,
        feedback: 'Interview was stopped by the candidate.',
        lastAiMessage: 'Interview stopped. Thank you.',
        isStopped: true
      }));
      this.router.navigate(['/thank-you']);
    }
  }

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioChunks = [];
      const options = MediaRecorder.isTypeSupported('audio/webm') ? { mimeType: 'audio/webm' } : {};
      this.mediaRecorder = new MediaRecorder(stream, options);

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.audioUrl = URL.createObjectURL(blob);
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          this.base64Audio = reader.result as string;
          console.log('Base64 audio ready');
        };
      };

      this.mediaRecorder.start();
      this.isRecording = true;
    } catch (err: any) {
      console.error('Microphone access error:', err);
      this.error = `Microphone access failed: ${err.message}`;
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

  playRecording() {
    if (this.audioUrl) {
      const audio = new Audio(this.audioUrl);
      audio.play();
    }
  }

  toggleVoiceInput() {
    if (this.isRecording) {
      this.stopVoiceInput();
    } else {
      this.startVoiceInput();
    }
  }

  startVoiceInput() {
    this.isRecording = true;
    this.voiceRecognitionService.start();
    this.voiceRecognitionService.onTranscriptUpdate.subscribe((transcript: any) => {
      this.userQuestion = transcript.final;
      this.interimTranscript = transcript.interim;
    });
  }

  stopVoiceInput() {
    this.isRecording = false;
    this.voiceRecognitionService.stop();
  
    if (this.userQuestion.trim()) {
      this.askQuestion();
    }
  }
  

  queueAiSpeech(text: string) {
    if (!text.trim()) return;
    this.aiSpeechQueue.push(text);
    this.processSpeechQueue(); 
  }
  

  private processSpeechQueue() {
    if (this.isSpeaking || this.aiSpeechQueue.length === 0) return;

    const textToSpeak = this.aiSpeechQueue.shift();
    if (!textToSpeak) return;

    this.isSpeaking = true;

    if (this.isRecording) {
      this.voiceRecognitionService.stop();
    }

    this.ttsService.speak(textToSpeak).subscribe({
      next: (audioBuffer) => {
        const blob = new Blob([audioBuffer], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);

        audio.onended = () => {
          URL.revokeObjectURL(url);
          this.isSpeaking = false;

          if (this.isRecording) {
            this.voiceRecognitionService.start();
          }

          this.processSpeechQueue();
        };

        audio.onerror = () => {
          console.error('Audio playback error');
          this.error = 'Failed to play speech.';
          this.isSpeaking = false;

          if (this.isRecording) {
            this.voiceRecognitionService.start();
          }

          this.processSpeechQueue();
        };

        audio.play().catch(err => {
          console.error('Error playing audio:', err);
          this.error = 'Speech playback error.';
          this.isSpeaking = false;

          if (this.isRecording) {
            this.voiceRecognitionService.start();
          }

          this.processSpeechQueue();
        });
      },
      error: (err) => {
        console.error('TTS Error:', err);
        this.error = 'Text-to-Speech failed.';
        this.isSpeaking = false;

        if (this.isRecording) {
          this.voiceRecognitionService.start();
        }

        this.processSpeechQueue();
      }
    });
  }

  playAiSpeech(text: string) {
    if (!text.trim()) return;
    this.queueAiSpeech(text);
  }

  clearTerminal() {
    this.terminalOutput = '';
  }

  appendToTerminal(text: string) {
    this.terminalOutput += text + '\n';
  }
}
