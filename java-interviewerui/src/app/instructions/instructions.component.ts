import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-instructions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="instructions-container">
      <div class="instructions-content">
        <h1>Interview Instructions</h1>
        <div class="selected-tech">
          Selected Technology: <span>{{ selectedTechnology | titlecase }}</span>
        </div>

        <div class="instruction-list">
          <h2>Before You Begin</h2>
          <ol>
            <li>Make sure you're in a quiet environment with a stable internet connection.</li>
            <li>Test your microphone if you plan to use voice responses.</li>
            <li>Have a notepad ready if you need to write down any thoughts.</li>
          </ol>

          <h2>Interview Format</h2>
          <ol>
            <li>The interview will begin with some background questions.</li>
            <li>You'll then be asked about your projects and experience.</li>
            <li>Following that, you'll receive 3 technical questions related to {{ selectedTechnology | titlecase }}.</li>
            <li>Take your time to think before answering each question.</li>
          </ol>

          <h2>Response Options</h2>
          <ul>
            <li>You can type your responses in the text box.</li>
            <li>Or use the voice input button to speak your answers.</li>
            <li>You can review your answer before submitting.</li>
          </ul>

          <h2>Important Notes</h2>
          <ul>
            <li>Answer each question completely and clearly.</li>
            <li>If you need clarification, feel free to ask.</li>
            <li>You'll receive your score at the end of the interview.</li>
            <li>The interview can be stopped at any time.</li>
          </ul>
        </div>

        <div class="button-container">
          <button class="back-button" (click)="goBack()">
            ← Back to Options
          </button>
          <button class="start-button" (click)="startInterview()">
            Start Interview →
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .instructions-container {
      min-height: 100vh;
      padding: 2rem;
      background: linear-gradient(135deg, #f6f8ff 0%, #f0f4ff 100%);
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }

    .instructions-content {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      max-width: 800px;
      width: 100%;
      margin-top: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(99, 102, 241, 0.1);
    }

    h1 {
      color: #4f46e5;
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .selected-tech {
      background: #f3f4f6;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 2rem;
      text-align: center;
      font-size: 1.1rem;
      color: #4f46e5;
    }

    .selected-tech span {
      font-weight: 600;
    }

    .instruction-list h2 {
      color: #4f46e5;
      font-size: 1.25rem;
      font-weight: 600;
      margin: 2rem 0 1rem;
    }

    .instruction-list ol,
    .instruction-list ul {
      margin-bottom: 1.5rem;
      padding-left: 1.5rem;
    }

    .instruction-list li {
      color: #4b5563;
      margin-bottom: 0.75rem;
      line-height: 1.5;
    }

    .button-container {
      display: flex;
      justify-content: space-between;
      margin-top: 3rem;
      gap: 1rem;
    }

    button {
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .back-button {
      background: #f3f4f6;
      color: #4b5563;
    }

    .back-button:hover {
      background: #e5e7eb;
    }

    .start-button {
      background: #4f46e5;
      color: white;
    }

    .start-button:hover {
      background: #4338ca;
      transform: translateY(-1px);
    }

    @media (max-width: 768px) {
      .instructions-container {
        padding: 1rem;
      }

      .instructions-content {
        margin-top: 1rem;
        padding: 1.5rem;
      }

      h1 {
        font-size: 1.5rem;
      }

      .button-container {
        flex-direction: column;
      }

      button {
        width: 100%;
      }
    }
  `]
})
export class InstructionsComponent implements OnInit {
  selectedTechnology: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    const user = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.selectedTechnology = localStorage.getItem('selectedTechnology') || 'java';
  }

  startInterview() {
    this.router.navigate(['/interview']);
  }

  goBack() {
    this.router.navigate(['/options']);
  }
} 