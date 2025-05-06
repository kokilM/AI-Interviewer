import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface InterviewOption {
  id: string;
  name: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-interview-options',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './interview-options.component.html',
  styleUrls: ['./interview-options.component.scss']
})
export class InterviewOptionsComponent {
  interviewOptions: InterviewOption[] = [
    {
      id: 'java',
      name: 'Java',
      icon: '☕',
      description: 'Core Java, Spring Boot, and Enterprise Java concepts'
    },
    {
      id: 'python',
      name: 'Python',
      icon: '🐍',
      description: 'Python fundamentals, Django, Flask, and data science'
    },
    {
      id: 'cpp',
      name: 'C++',
      icon: '⚡',
      description: 'C++ programming, STL, and object-oriented concepts'
    },
    {
      id: 'react',
      name: 'React.js',
      icon: '⚛️',
      description: 'React.js, Redux, and modern frontend development'
    },
    {
      id: 'angular',
      name: 'Angular',
      icon: '🅰️',
      description: 'Angular framework, TypeScript, and RxJS'
    }
  ];

  constructor(private router: Router) {}

  selectOption(option: InterviewOption) {
    localStorage.setItem('selectedTechnology', option.id);
    this.router.navigate(['/instructions']);
  }
} 