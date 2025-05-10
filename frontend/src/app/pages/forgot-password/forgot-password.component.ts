import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm?: FormGroup
  isLoading = false;
  constructor(private router: Router, private authService: AuthService, private toast: HotToastService) { }

  ngOnInit(): void {
    this.forgotForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]),
    });
  }

  submit() {
    if (this.forgotForm?.invalid) {
      return;
    }
    console.log(this.forgotForm?.value);
    this.isLoading = true;
    this.authService.forgotPassword(this.forgotForm?.value).subscribe({
      next: (v: any) => {
        this.toast.success(v.message)
      },
      error: (e) => {
        console.error(e)
        this.toast.error(e.message)
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

}
