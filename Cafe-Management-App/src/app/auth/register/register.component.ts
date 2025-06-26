import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AuthRequest } from '../../models/auth-request.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const userData: AuthRequest = this.registerForm.value;
      this.authService.register(userData).subscribe({
        next: (response) => {
          console.log('Registered and logged in', response);
        },
        error: (error) => {
          console.log(error);
          this.errorMessage = 'Registration failed';
        },
      });
    } else {
      this.errorMessage = 'Please fill out the form correctly.';
      return;
    }
  }
}
