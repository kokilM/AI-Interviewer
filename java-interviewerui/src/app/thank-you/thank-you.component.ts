import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thank-you',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss']
})
export class ThankYouComponent implements OnInit {
  score: number = 0;
  totalQuestions: number = 0;
  feedback: string = '';
  lastAiMessage: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const interviewData = localStorage.getItem('interviewData');
    if (interviewData) {
      const data = JSON.parse(interviewData);
      this.score = data.score || 0;
      this.totalQuestions = data.totalQuestions || 0;
      this.feedback = data.feedback || 'Thank you for completing the interview.';
      this.lastAiMessage = data.lastAiMessage || '';
    } else {
      this.router.navigate(['/interviewer']);
    }
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }
} 