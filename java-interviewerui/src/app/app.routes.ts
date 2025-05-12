import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { InterviewerComponent } from './interviewer/interviewer.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { InterviewOptionsComponent } from './interview-options/interview-options.component';
// import { register } from 'module';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path:'register',component:RegisterComponent},
  { path: 'login', component: LoginComponent },
  { path: 'options', component: InterviewOptionsComponent },
  { path: 'instructions', component: InstructionsComponent },
  { path: 'interview', component: InterviewerComponent },
  { path: 'thank-you', component: ThankYouComponent }
];
