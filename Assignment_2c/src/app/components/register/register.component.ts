import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: false
})
export class RegisterComponent {
  user: User = { name: '', email: '', password: '' };
  errorMsg = '';

  constructor(private userService: UserService, private router: Router) { }

  register() {
    if (this.userService.register(this.user)) {
      this.router.navigate(['/login']);
    } else {
      this.errorMsg = 'Email already exists.';
    }
  }
}
