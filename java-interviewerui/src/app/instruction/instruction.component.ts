import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-instruction',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="instruction-container">
      <div class="instruction-box">
        <h2>Interview Instructions</h2>
        <div class="instructions">
          <h3>Please read the following instructions carefully:</h3>
          <ol>
            <li>This is a technical interview that will test your Java programming knowledge.</li>
            <li>You will be asked questions by an AI interviewer.</li>
            <li>You can respond using either text input or voice input.</li>
            <li>Each question will be read out loud by the AI.</li>
            <li>Take your time to think before answering.</li>
            <li>You can use the sidebar to review previous questions and answers.</li>
            <li>The interview will be evaluated based on your responses.</li>
            <li>You can end the interview at any time using the "End Interview" button.</li>
          </ol>
        </div>
        <div class="agreement">
          <label>
            <input type="checkbox" [(ngModel)]="isAgreed">
            I have read and understood the instructions
          </label>
        </div>
        <button class="start-button" [disabled]="!isAgreed" (click)="showStartButton = true">
          I Agree
        </button>
        <button *ngIf="showStartButton" class="start-interview-button" (click)="startInterview()">
          Start Interview
        </button>
      </div>
    </div>
  `,
  styles: [`
    .instruction-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
    }
    .instruction-box {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      max-width: 800px;
      width: 90%;
    }
    h2 {
      color: #333;
      text-align: center;
      margin-bottom: 1.5rem;
    }
    .instructions {
      margin-bottom: 2rem;
    }
    h3 {
      color: #444;
      margin-bottom: 1rem;
    }
    ol {
      padding-left: 1.5rem;
    }
    li {
      margin-bottom: 0.5rem;
      line-height: 1.5;
    }
    .agreement {
      margin: 1.5rem 0;
      text-align: center;
    }
    .agreement label {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    .start-button {
      display: block;
      width: 100%;
      padding: 1rem;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1.1rem;
      cursor: pointer;
      transition: background-color 0.3s;
      margin-bottom: 1rem;
    }
    .start-button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
    .start-button:not(:disabled):hover {
      background-color: #45a049;
    }
    .start-interview-button {
      display: block;
      width: 100%;
      padding: 1rem;
      background-color: #2196F3;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1.1rem;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    .start-interview-button:hover {
      background-color: #1976D2;
    }
  `]
})
export class InstructionComponent implements OnInit {
  isAgreed: boolean = false;
  showStartButton: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/login']);
    }
  }

  startInterview(): void {
    // Navigate to interviewer page
    this.router.navigate(['/interviewer']);
  }
} 