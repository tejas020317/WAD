import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  router = inject(Router);

  onLogin(event: Event) {
    event.preventDefault(); // Prevent full page reload
    // In a real app, you would validate credentials here
    localStorage.setItem('user', 'authenticated');
    this.router.navigate(['/quiz']);
  }
}
