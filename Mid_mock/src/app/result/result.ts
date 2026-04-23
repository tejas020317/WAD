import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  imports: [],
  templateUrl: './result.html',
  styleUrl: './result.css',
})
export class ResultComponent implements OnInit {
  router = inject(Router);
  score: number | null = null;
  totalQuestions = 3;

  ngOnInit() {
    const rawScore = localStorage.getItem('quizScore');
    if (rawScore !== null) {
      this.score = parseInt(rawScore, 10);
    } else {
      this.router.navigate(['/']); // redirect to home if no score
    }
  }

  restartQuiz() {
    localStorage.removeItem('quizScore');
    this.router.navigate(['/quiz']);
  }
}
