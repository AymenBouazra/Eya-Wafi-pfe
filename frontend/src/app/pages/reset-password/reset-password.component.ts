import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  isLoading = false;
  isSubmitted = false;
  resetForm?: FormGroup
  constructor(private router: Router, private route: ActivatedRoute, private toast: HotToastService, private authService: AuthService) { }

  ngOnInit(): void {
    this.resetForm = new FormGroup({
      password: new FormControl('', [Validators.minLength(6), Validators.required]),
      confirmPassword: new FormControl('', [Validators.minLength(6), Validators.required]),
    },
      { validators: [this.passwordConfirmation] }
    );
  }
  submit() {
    this.isSubmitted = true;
    if (this.resetForm?.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.resetPassword(this.route.snapshot.params.token, this.resetForm?.value).subscribe({
      next: (v: any) => {
        this.toast.success(v.message)
        this.router.navigate(['/login']);
      },
      error: (e) => {
        console.error(e.message)
        this.toast.error(e.error.message)
      },
      complete: () => {
        this.isLoading = false;
        this.isSubmitted = false;
      },
    });
  }
  passwordConfirmation(group: AbstractControl): { [key: string]: any } | null {
    const password = group.get('password')
    const confirmPassword = group.get('confirmPassword')
    if (password?.pristine || confirmPassword?.pristine) {
      return null;
    }
    return password && confirmPassword && password.value !== confirmPassword.value ? { 'mismatch': true } : null
  }

}
