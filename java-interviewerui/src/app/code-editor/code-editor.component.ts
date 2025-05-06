// import { Component, Input, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { CodeEditorService } from '../services/code-editor.service';

// @Component({
//   selector: 'app-code-editor',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   template: `
//     <div class="code-editor-container">
//       <div class="editor-header">
//         <select [(ngModel)]="language" (change)="onLanguageChange($event)" class="language-selector">
//           <option value="java">Java</option>
//           <option value="python">Python</option>
//           <option value="cpp">C++</option>
//           <option value="typescript">TypeScript</option>
//           <option value="javascript">JavaScript</option>
//         </select>
//         <button (click)="runCode()" class="run-button">Run Code</button>
//       </div>
//       <div class="editor-wrapper">
//         <textarea
//           [(ngModel)]="code"
//           class="code-textarea"
//           spellcheck="false"
//           [placeholder]="'Write your ' + language + ' code here...'"
//         ></textarea>
//       </div>
//       <div class="output-container" *ngIf="output">
//         <h3>Output:</h3>
//         <pre>{{output}}</pre>
//       </div>
//     </div>
//   `,
//   styles: [`
//     .code-editor-container {
//       display: flex;
//       flex-direction: column;
//       gap: 1rem;
//       height: 100%;
//       background-color: #1e1e1e;
//       padding: 1rem;
//       border-radius: 8px;
//     }

//     .editor-header {
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       gap: 1rem;
//     }

//     .language-selector {
//       padding: 0.5rem;
//       border-radius: 4px;
//       background-color: #2d2d2d;
//       color: #ffffff;
//       border: 1px solid #3d3d3d;
//     }

//     .run-button {
//       padding: 0.5rem 1rem;
//       background-color: #0078d4;
//       color: white;
//       border: none;
//       border-radius: 4px;
//       cursor: pointer;
//       transition: background-color 0.2s;
//     }

//     .run-button:hover {
//       background-color: #006cbd;
//     }

//     .editor-wrapper {
//       flex: 1;
//       min-height: 60vh;
//       background-color: #1e1e1e;
//     }

//     .code-textarea {
//       width: 100%;
//       height: 100%;
//       min-height: 60vh;
//       padding: 1rem;
//       background-color: #1e1e1e;
//       color: #d4d4d4;
//       border: 1px solid #3d3d3d;
//       border-radius: 4px;
//       font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
//       font-size: 14px;
//       line-height: 1.5;
//       resize: none;
//       outline: none;
//     }

//     .code-textarea:focus {
//       border-color: #0078d4;
//     }

//     .output-container {
//       background-color: #2d2d2d;
//       padding: 1rem;
//       border-radius: 4px;
//       margin-top: 1rem;
//     }

//     .output-container h3 {
//       color: #ffffff;
//       margin-top: 0;
//       margin-bottom: 0.5rem;
//     }

//     .output-container pre {
//       color: #ffffff;
//       margin: 0;
//       white-space: pre-wrap;
//       word-wrap: break-word;
//     }
//   `]
// })
// export class CodeEditorComponent implements OnInit {
//   @Input() language: string = 'java';
//   code: string = '';
//   output: string = '';
//   isLoading: boolean = false;

//   constructor(private codeEditorService: CodeEditorService) {}

//   ngOnInit() {
//     this.code = this.codeEditorService.getDefaultCode(this.language);
//   }

//   onLanguageChange(event: Event) {
//     const target = event.target as HTMLSelectElement;
//     this.language = target.value;
//     this.code = this.codeEditorService.getDefaultCode(this.language);
//   }

//   runCode() {
//     this.isLoading = true;
//     this.codeEditorService.executeCode(this.code, this.language).subscribe({
//       next: (response) => {
//         this.output = response.output || 'No output';
//         this.isLoading = false;
//       },
//       error: (error) => {
//         this.output = 'Error executing code: ' + (error.message || 'Unknown error');
//         this.isLoading = false;
//       }
//     });
//   }
// } 