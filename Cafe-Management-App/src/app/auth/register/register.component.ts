import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AuthRequest } from '../../models/auth-request.model';
import { SharedService } from 'src/app/services/shared.service';
import { IdleService } from 'src/app/services/idle.service';

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
    private sharedService: SharedService,
    private idleService: IdleService,
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
      this.authService.autoRegisterAndLogin(userData).subscribe({
        next: (response) => {
          this.idleService.startWatching();
          this.sharedService.loginActions(response.token);
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
