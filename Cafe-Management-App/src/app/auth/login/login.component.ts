import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { IdleService } from 'src/app/services/idle.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  showForgotModal = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private idleService: IdleService,
    private sharedService: SharedService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  openForgotPasswordModal() {
    this.showForgotModal = true;
  }

  closeForgotPasswordModal() {
    this.showForgotModal = false;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login success', response);
          this.idleService.startWatching();
          this.sharedService.loginActions(response.token);
        },
        error: (error) => {
          console.log(error);
          this.errorMessage = 'Login failed';
        },
      });
    } else {
      this.errorMessage = 'Please fill out the form correctly.';
      return;
    }
  }
}
