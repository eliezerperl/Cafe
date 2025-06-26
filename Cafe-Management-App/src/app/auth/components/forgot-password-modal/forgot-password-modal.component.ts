import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password-modal',
  templateUrl: './forgot-password-modal.component.html',
  styleUrls: ['./forgot-password-modal.component.css'],
})
export class ForgotPasswordModalComponent {
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();

  passwordForm: FormGroup;
  message = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {
    this.passwordForm = this.fb.group({
      username: ['', Validators.required],
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      const { username, oldPassword, newPassword } = this.passwordForm.value;

      this.authService
        .changePassword({ username, oldPassword, newPassword })
        .subscribe({
          next: () => {
            this.message = 'Password changed successfully';
            this.error = '';
            this.passwordForm.reset();
          },
          error: (err) => {
            console.log(err);
            this.error = 'Failed to change password';
            this.message = '';
          },
        });
    }
  }

  closeModal() {
    this.close.emit();
  }
}
