import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { QuizComponent } from './quiz/quiz';
import { ResultComponent } from './result/result';
import { authGuard } from './auth-guard';

export const routes: Routes = [

  { path: '', component: LoginComponent },

  { path: 'quiz',
    component: QuizComponent,
    canActivate:[authGuard]
  },

  { path: 'result',
    component: ResultComponent,
    canActivate:[authGuard]
  }

];