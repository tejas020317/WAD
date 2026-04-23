import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent {
  email = '';
  password = '';
  errorMsg = '';

  constructor(private userService: UserService, private router: Router) { }

  login() {
    if (this.userService.login(this.email, this.password)) {
      this.router.navigate(['/profile']);
    } else {
      this.errorMsg = 'Invalid email or password.';
    }
  }
}
