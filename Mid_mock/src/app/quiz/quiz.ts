import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz',
  imports: [],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class QuizComponent {
  router = inject(Router);
  
  questions = [
    { 
      question: 'What does HTML stand for?', 
      options: ['Hyper Text Monkey Language', 'Hyper Text Markup Language', 'Hyper Text Makeup Language', 'Hyper Text MultiVerse Language'], 
      answer: 'Hyper Text Markup Language' 
    },
    { 
      question: 'What does CSS stand for?', 
      options: ['Common Style Sheet', 'Colorful Style Sheet', 'Computer Style Sheet', 'Cascading Style Sheet'], 
      answer: 'Cascading Style Sheet' 
    },
    { 
      question: 'Which of these is a framework used by this project?', 
      options: ['Django', 'Angular', 'Laravel', 'React'], 
      answer: 'Angular' 
    }
  ];
  
  currentQuestionIndex = 0;
  score = 0;
  selectedOption = '';

  selectOption(option: string) {
    this.selectedOption = option;
  }

  nextQuestion() {
    if (this.selectedOption === this.questions[this.currentQuestionIndex].answer) {
      this.score++;
    }
    
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.selectedOption = '';
    } else {
      localStorage.setItem('quizScore', this.score.toString());
      this.router.navigate(['/result']);
    }
  }
}
